import { test, expect } from "vitest";
import { chatLinkToJson } from "../../src/services/chatToJson.js";

test("Generate correct JSON chat from share link", async () => {
    const shareLink = "https://chatgpt.com/share/6a5cef4a-90f0-83ed-baec-990096809dd4";

    const expectedOutput = [
        {
            "role": "user",
            "message": [
                "Tell me an interesting fact in 1 sentence"
            ]
        },
        {
            "role": "assistant",
            "message": [
                "Octopuses have three hearts, and two stop beating while they swim."
            ]
        },
        {
            "role": "user",
            "message": [
                "What day is it today?"
            ]
        },
        {
            "role": "assistant",
            "message": [
                "Today is **Sunday, 19 July 2026**."
            ]
        },
        {
            "role": "user",
            "message": [
                "In 3 sentences, explain how cheese is made"
            ]
        },
        {
            "role": "assistant",
            "message": [
                "Milk is warmed and mixed with bacteria and rennet, which makes it separate into solid curds and liquid whey. The curds are cut, drained, salted, and often pressed into shape. Some cheeses are eaten fresh, while others are aged to develop stronger flavours and firmer textures."
            ]
        }
    ]

    const generateJsonChat = await chatLinkToJson(shareLink);

    expect(generateJsonChat).toEqual(expectedOutput);
})