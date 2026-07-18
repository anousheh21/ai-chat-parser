export const chatToJson = async (chatGPTShareLink: URL) => {
    const json = await getJSON(chatGPTShareLink);
    return json;
}

const getJSON = async (chatGPTShareLink: URL) => {
    const response = await fetch(chatGPTShareLink);

    if (!response.ok) {
        const errorBody = await response.text();
        console.log(errorBody);

        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.text();
    return data;
}

const extractShareId = (chatGPTShareLink: URL) => {

}