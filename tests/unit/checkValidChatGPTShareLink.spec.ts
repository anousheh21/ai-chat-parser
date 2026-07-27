import { test, expect, vi, beforeEach } from "vitest";
import { checkValidChatGPTShareLink } from "../../src/services/checkValidChatGPTShareLink.js";
import { getPageSource } from "../../src/services/getPageSource.js";

vi.mock("../../src/services/getPageSource.js");

beforeEach(() => {
    vi.mocked(getPageSource).mockReset();
    vi.mocked(getPageSource).mockResolvedValue("linear_conversation");
});

test("checkValidChatGPTShareLink returns false if it is passed a non-url", async () => {
    const input = "sharelink";

    const expectedResult = false;
    const actualResult = await checkValidChatGPTShareLink(input);

    expect(actualResult).toBe(expectedResult);
})

test("checkValidChatGPTShareLink returns false if it is passed a URL with an incorrect hostname", async () => {
    const input = "https://google.com";
    const actualResult = await checkValidChatGPTShareLink(input);

    expect(actualResult).toBe(false);
})

test("checkValidChatGPTShareLink returns false if the protocol is http (not https)", async () => {
    const input = "http://chatgpt.com/share/6a5cef4a-90f0-83ed-baec-990096809dd4";
    const actualResult = await checkValidChatGPTShareLink(input);

    expect(actualResult).toBe(false);
})

test("checkValidChatGPTShareLink returns false if there is an additional path segment after the chat identifier", async () => {
    const input = "https://chatgpt.com/share/6a5cef4a-90f0-83ed-baec-990096809dd4/hello";
    const actualResult = await checkValidChatGPTShareLink(input);

    expect(actualResult).toBe(false);
})


test("checkValidChatGPTShareLink returns false if the chat identifier is invalid", async () => {
    vi.mocked(getPageSource).mockResolvedValue("bad_result");

    const input = "https://chatgpt.com/share/6a5d3210-3d0c-83eb-86fd-e940cee4eeda7";
    const actualResult = await checkValidChatGPTShareLink(input);

    expect(getPageSource).toHaveBeenCalledWith(input);
    expect(actualResult).toBe(false);
})
