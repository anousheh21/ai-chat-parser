import { decode } from "turbo-stream";
import type { ConversationItem } from "../types/conversationItem.js";
import type { Decoded } from "../types/decodedChatTypes.js";
import { getPageSource } from "./getPageSource.js";

export const chatLinkToJson = async (chatGPTShareLink: string) => {
    const data = await getPageSource(chatGPTShareLink);

    const payload =  extractTurboStreamSerialization(data);
    const decoded = await decodeTurboStream(payload);
    const jsonChat = jsonChatCleanup(decoded);

    return jsonChat;
}

const extractTurboStreamSerialization = (pageSource: string) => {
    const firstEnqueueCall = "window.__reactRouterContext.streamController.enqueue(";
    const firstEnqueueCallStartIndex = pageSource.indexOf(firstEnqueueCall);
    const payloadStartIndex = firstEnqueueCallStartIndex + firstEnqueueCall.length;

    let currentIndex = payloadStartIndex + 1;
    while (pageSource[currentIndex] != "\"" || pageSource[currentIndex - 1] == "\\") {
        currentIndex++;
    }

    const payload = pageSource.slice(payloadStartIndex, currentIndex + 1);
    return payload;
}

const decodeTurboStream = async(payload: string) => {
    const parsedPayload = JSON.parse(payload);
    const textToBytesEncoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
        start(controller) {
            controller.enqueue(textToBytesEncoder.encode(parsedPayload));
            controller.close();
        }
    })

    const decoded = await decode(stream) as Decoded;
    return decoded;
}

const jsonChatCleanup = (decoded: Decoded) => {
    const linearConversation = decoded?.value?.loaderData["routes/share.$shareId.($action)"]?.serverResponse?.data?.linear_conversation;

    if (!linearConversation) {
        throw new Error("Conversation not found");
    }

    const conversationLength = linearConversation.length;
    const conversationArray: ConversationItem[] = [];

    for(let i = 0; i < conversationLength; i++) {
       if (linearConversation[i]?.message && linearConversation[i]?.message?.author) {
            const conversationItemRole = linearConversation[i].message.author.role;
            const conversationItemMessage = linearConversation[i].message.content.parts;

            if((conversationItemRole == "user" || conversationItemRole == "assistant") && conversationItemMessage && conversationItemMessage != "Original custom instructions no longer available") {
                const conversationItem: ConversationItem = {
                    role: conversationItemRole,
                    message: conversationItemMessage
                }

                conversationArray.push(conversationItem);
            }
       }

    }

    return conversationArray;
}
