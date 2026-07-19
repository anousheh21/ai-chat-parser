import { test, expect } from "vitest";
import { getPageSource } from "../getPageSource.js";

test("getPageSource returns the page source for a valid share link", async () => {
    const input = "https://chatgpt.com/share/6a5cef4a-90f0-83ed-baec-990096809dd4";
    const actualResult = await getPageSource(input);

    expect(actualResult).toBeTypeOf("string");
    expect(actualResult).toContain("<!DOCTYPE html>");
    expect(actualResult).toContain("</html>");
    expect(actualResult).toContain("linear_conversation");
})
