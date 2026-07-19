import type { Request, Response } from "express";
import { chatLinkToJson } from "../services/chatToJson.js";
import { checkValidUrl } from "../services/checkValidUrl.js";

export const chatControllerPost = async (req: Request, res: Response) => {
    // The link received
    const chatGPTShareLink = req.body.chatGPTShareLink;

    // Functionality goes here for turning the share link into JSON
    checkValidUrl(chatGPTShareLink);
    const jsonChat = await chatLinkToJson(chatGPTShareLink);

    // This is what we are sending back, so this needs to be the chat as a JSON array
    res.status(200).json(jsonChat);
}