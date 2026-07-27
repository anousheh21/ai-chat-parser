# ai-chat-parser

`ai-chat-parser` converts ChatGPT conversations into JSON, enabling them to be used easily in software projects. It is available as a node package or self-hosted REST API.


## Requirements

- Node.js 22.12.0 or later
- npm


## Package

### Installation

Install with npm:
```bash
npm install ai-chat-parser
```


### Usage

```ts
import { chatLinkToJson, checkValidChatGPTShareLink } from "ai-chat-parser";
import type { ConversationItem } from "ai-chat-parser";

async function main() {
    const chatGPTShareLink = 'https://chatgpt.com/share/6a5cef4a-90f0-83ed-baec-990096809dd4';

    try {
        const isValidShareLink = await checkValidChatGPTShareLink(chatGPTShareLink);

        if (isValidShareLink) {
            const json: ConversationItem[] = await chatLinkToJson(chatGPTShareLink);
            console.log(json);
        } else  {
            console.log("Invalid share link");
        }
    } catch (error) {
        console.error("Failed to parse chat:", error);
    }
}
```


#### Functions

`ai-chat-parser` exposes 2 functions: 

- `chatLinkToJson`: accepts a valid ChatGPT share link. Accesses a ChatGPT chat via its share link, parses the chat and returns `Promise<ConversationItem[]>`.
- `checkValidChatGPTShareLink`: accepts a string and returns `Promise<boolean>` - true if the string is a valid ChatGPT share link and false otherwise.


#### Types

`ai-chat-parser` exposes the `ConversationItem` type. The `chatLinkToJson` function returns an array of `ConversationItem`s.
```ts
type ConversationItem = {
    role: "user" | "assistant",
    message: string[]
}
```


## API

### Getting Started

Clone the repository:

```bash
git clone https://github.com/anousheh21/ai-chat-parser.git
```

Navigate to the project directory:

```bash
cd ai-chat-parser
```

Install project dependencies (do not use `npm install --omit=dev` as this will omit some dependencies that are required for the API to work successfully):

```bash
npm install
```

Run the project locally:

```bash
npm run dev
```

Optionally, you can check the project is working with the curl command below. You can replace the ChatGPT share link in the command with your own share link (but the one below does work):

```bash
curl -X POST http://localhost:4000/v1/chat-parser \
  -H "Content-Type: application/json" \
  -d '{"chatGPTShareLink": "https://chatgpt.com/share/6a5cef4a-90f0-83ed-baec-990096809dd4"}'
```


### REST API Reference

```http
POST /v1/chat-parser
```

The request body must contain a ChatGPT share link:

```json
{
  "chatGPTShareLink": "https://chatgpt.com/share/share-id"
}
```

If the share link sent is valid, the API will return  a `200 OK` response, alongside a JSON array of objects. The objects have a `role` property, which will be either `user` or `assistant`, and a `message` property, which will contain the message. The JSON array returned will be ordered in the same order as the messages in the shared chat:

```json
[
  {
    "role": "user",
    "message": ["Tell me an interesting fact in 1 sentence"]
  },
  {
    "role": "assistant",
    "message": ["Octopuses have three hearts, and two stop beating while they swim."]
  }
]
```

If an invalid link is provided, the API will return a `404 Not Found` response:

```json
{
  "error": "https://chatgpt.com/share/your-share-id is an invalid ChatGPT share link"
}
```


## Coming Soon

Support for Claude.


## License

This project is licensed under the MIT License. See LICENSE for details.
