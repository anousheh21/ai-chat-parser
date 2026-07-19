import type { Request, Response } from "express";
import { chatLinkToJson } from "../services/chatToJson.js";
import { checkValidChatGPTShareLink } from "../services/checkValidChatGPTShareLink.js";

export const chatControllerPost = async (req: Request, res: Response) => {
    const chatGPTShareLink = req.body.chatGPTShareLink;

    // Testing that the checkValidUrl function works
    const validUrl = await checkValidChatGPTShareLink(chatGPTShareLink);
    res.status(200).json(validUrl);

    // TODO: Uncomment this, as this is the actual app flow. It is commented for now, so I can test the checkValidUrl function.
    // const jsonChat = await chatLinkToJson(chatGPTShareLink);

    // // This is what we are sending back, so this needs to be the chat as a JSON array
    // res.status(200).json(jsonChat);
}