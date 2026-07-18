import type { Request, Response } from "express";

export const chatControllerPost = (req: Request, res: Response) => {
    const chatGPTShareLink = req.body.chatGPTShareLink;
    res.status(200).json(chatGPTShareLink);
}