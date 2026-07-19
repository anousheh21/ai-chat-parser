export type Decoded = {
    value: Value
}

type Value = {
    loaderData: LoaderData
}

type LoaderData = {
    ["routes/share.$shareId.($action)"]: RouteIdentifier
}

type RouteIdentifier = {
    serverResponse: ServerResponse
}

type ServerResponse = {
    data: Data
}

type Data = {
    linear_conversation: LinearConversation
}

type LinearConversation = any[];