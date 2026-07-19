export const checkValidChatGPTShareLink = async (chatGPTShareLink: string): Promise<boolean> => {
    const shareLinkStart = "https://chatgpt.com/share/";

    if (!chatGPTShareLink.startsWith(shareLinkStart)) {
        return false;
    }

    const chatIdentifier = chatGPTShareLink.slice(shareLinkStart.length);
    const isValidPageContent = await checkValidPageContent(chatGPTShareLink, chatIdentifier);

    if (isValidPageContent === false) {
        return false;
    }

    return true;
}

// TODO: Ask Codex if there is any possibility that this will block valid links or allow through invalid links

const checkValidPageContent = async (chatGPTShareLink: string, chatIdentifier: string): Promise<boolean> => {
    const response = await fetch(chatGPTShareLink);

    if (!response.ok) {
        const errorBody = await response.text();
        console.log(errorBody);

        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.text();

    const firstEnqueueCall = "window.__reactRouterContext.streamController.enqueue(";
    const firstEnqueueCallStartIndex = data.indexOf(firstEnqueueCall);

    if (firstEnqueueCallStartIndex == -1) {
        return false;
    }

    const invalidIdentifierMessage = `Can't load shared conversation ${chatIdentifier}`;
    const invalidIdentifierMessageStartIndex = data.indexOf(invalidIdentifierMessage);

    // TODO: There is a problem with this though, because what if, in a working chat, someone writes out the thing in invalidIdentifierMessage?

    if (invalidIdentifierMessageStartIndex != -1) {
        return false;
    }

    return true;
}