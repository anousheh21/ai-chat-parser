import { getPageSource } from "./getPageSource.js";

export const checkValidChatGPTShareLink = async (chatGPTShareLink: string): Promise<boolean> => {
    try {
        const shareLinkUrl = new URL(chatGPTShareLink);

        const expectedProtocol = "https:";
        const expectedHostname = "chatgpt.com";
        const expectedPathnameForm = /^\/share\/([^/]+)\/?$/;

        if (shareLinkUrl.protocol != expectedProtocol || shareLinkUrl.hostname != expectedHostname || !expectedPathnameForm.test(shareLinkUrl.pathname)) {
            return false;
        }

        const data = await getPageSource(chatGPTShareLink);

        const linearConversationIndex = data.indexOf("linear_conversation");

        if (linearConversationIndex == -1) {
            return false;
        };

        return true;

    } catch {
        return false;
    }
}

