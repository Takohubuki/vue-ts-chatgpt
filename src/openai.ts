import { ChatMessage } from './types';
const apiKey = import.meta.env.OPEN_API_KEY

export async function makeChatCompletion(messageList: ChatMessage[]) {
    console.log('sending requests!');
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                // stream: true,
                messages: messageList
            })
        });
        return response;
    } catch (error) {
        throw error;
    }
}
