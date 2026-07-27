import { expect, test } from "vitest";
import * as publicApi from "../../src/index.js";

test("public API exposes the intended runtime functions", () => {
    expect(Object.keys(publicApi).sort()).toEqual([
        "chatLinkToJson",
        "checkValidChatGPTShareLink"
    ]);
    expect(publicApi.chatLinkToJson).toBeTypeOf("function");
    expect(publicApi.checkValidChatGPTShareLink).toBeTypeOf("function");
});
