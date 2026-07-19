import { decode } from "turbo-stream";
import type { ConversationItem } from "../types/conversationItem.js";
import type { Decoded } from "../types/decodedChatTypes.js";

// ORGANISE THIS PAGE, MAYBE IN TO SEVERAL SEPARATE ONES, ONCE YOU'VE FINISHED. IT'S A MESS BC I CARED ABOUT THE LOGIC FIRST! ALSO FIX VARIABLE NAMES AND DO A GENERAL TIDY UP!

export const chatLinkToJson = async (chatGPTShareLink: URL) => {
    const response = await fetch(chatGPTShareLink);

    if (!response.ok) {
        const errorBody = await response.text();
        console.log(errorBody);

        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.text();

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
    const linearConversation = decoded.value.loaderData["routes/share.$shareId.($action)"].serverResponse.data.linear_conversation;

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
