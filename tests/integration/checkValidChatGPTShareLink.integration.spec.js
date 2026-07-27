import { test, expect } from "vitest";
import { checkValidChatGPTShareLink } from "../../src/services/checkValidChatGPTShareLink.js";

test("checkValidChatGPTShareLink returns true if it is passed a valid share link", async () => {
    const input = "https://chatgpt.com/share/6a5cef4a-90f0-83ed-baec-990096809dd4";
    const actualResult = await checkValidChatGPTShareLink(input);

    expect(actualResult).toBe(true);
})
