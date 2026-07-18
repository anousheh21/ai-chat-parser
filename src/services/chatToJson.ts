import type { Server } from "node:http";
import { decode } from "turbo-stream";

// ORGANISE THIS PAGE, MAYBE IN TO SEVERAL SEPARATE ONES, ONCE YOU'VE FINISHED. IT'S A MESS BC I CARED ABOUT THE LOGIC FIRST! ALSO FIX VARIABLE NAMES AND DO A GENERAL TIDY UP!

export const chatToJson = async (chatGPTShareLink: URL) => {
    const json = await getJSON(chatGPTShareLink);
    return json;
}

const getJSON = async (chatGPTShareLink: URL) => {
    const response = await fetch(chatGPTShareLink);

    if (!response.ok) {
        const errorBody = await response.text();
        console.log(errorBody);

        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.text();

    const payload =  extractTurboStreamSerialization(data);
    const parsedPayload =  extractJson(payload);
    const decoded = await decodeTurboStream(parsedPayload);
    const useful = usefulConversationBits(decoded);
    return useful;
    // return decoded;
    // return data;
}

const extractShareId = (chatGPTShareLink: URL) => {

}

const extractTurboStreamSerialization = (pageSource: string) => {

    // Find index of first payload character (first ")
    const firstEnqueueCall = "window.__reactRouterContext.streamController.enqueue(";
    const firstEnqueueCallStartIndex = pageSource.indexOf(firstEnqueueCall);
    const payloadStartIndex = firstEnqueueCallStartIndex + firstEnqueueCall.length;

    // Find index of last payload character (last ")
    let currentIndex = payloadStartIndex + 1;
    while (pageSource[currentIndex] != "\"" || pageSource[currentIndex - 1] == "\\") {
        currentIndex++;
    }

    // Payload contains the serialized turbo stream we're after
    const payload = pageSource.slice(payloadStartIndex, currentIndex + 1);
   
    return payload;
}

const extractJson = (payload: string) => {
    const json = JSON.parse(payload);
    return json;
}

const decodeTurboStream = async(parsedPayload: string) => {
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

const usefulConversationBits = (decoded: Decoded) => {
    const linearConversation = decoded.value.loaderData["routes/share.$shareId.($action)"].serverResponse.data.linear_conversation;

    return linearConversation;
}

type LinearConversation = unknown[];

type Data = {
    linear_conversation: LinearConversation
}

type ServerResponse = {
    data: Data
}

type RouteIdentifier = {
    serverResponse: ServerResponse
}

type LoaderData = {
    ["routes/share.$shareId.($action)"]: RouteIdentifier
}

type Value = {
    loaderData: LoaderData
}

type Decoded = {
    value: Value
}
