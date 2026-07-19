export const getPageSource = async (chatGPTShareLink: string) => {
    const response = await fetch(chatGPTShareLink);

    if (!response.ok) {
        const errorBody = await response.text();
        console.log(errorBody);

        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.text();
    return data;
}