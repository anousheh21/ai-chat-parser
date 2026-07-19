import type { Request, Response } from "express";
import { chatLinkToJson } from "../services/chatToJson.js";
import { checkValidChatGPTShareLink } from "../services/checkValidChatGPTShareLink.js";

export const chatControllerPost = async (req: Request, res: Response) => {
    const chatGPTShareLink = req.body.chatGPTShareLink;
    const isValidUrl = await checkValidChatGPTShareLink(chatGPTShareLink);
    // res.status(200).json(isValidUrl);

    if (!isValidUrl) {
        res.status(404).json({ error: `${chatGPTShareLink} is an invalid ChatGPT share link`});
        return;
    }

    const jsonChat = await chatLinkToJson(chatGPTShareLink);

    // This is what we are sending back, so this needs to be the chat as a JSON array
    res.status(200).json(jsonChat);
}