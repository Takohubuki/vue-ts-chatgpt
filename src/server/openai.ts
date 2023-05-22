import { ChatMessage, ChatResponse, GPTRequestConfig } from '../types';
import GPTRequest from './http';

const apiKey = import.meta.env.VITE_OPEN_API_KEY

export async function makeChatCompletionStream(messageList: ChatMessage[]) {
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
        console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}

interface ChatRequestConfig<T> extends GPTRequestConfig {
    data?: T
}

const baseURL = (import.meta.env.VITE_BASE_URL as string);
const request = new GPTRequest({
    baseURL: baseURL,
    timeout: 1000 * 60 * 5,
    interceptors: {
        // request interceptor
        requestInterceptors: config => {
            console.log('实例请求拦截器');
            return config;
        },
        responseInterceptors: result => {
            console.log('实例响应拦截器');
            return result;
        }
    }
})
const ChatRequest = <D, T = ChatResponse> (config: ChatRequestConfig<D>) => {
    const { method = 'POST'} = config;
    if (method === 'get' || method === 'GET') {
        config.params = config.data
    }
    return request.request<T>(config);
}

export default ChatRequest;