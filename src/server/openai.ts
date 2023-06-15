import { ChatMessage, GPTResponse, GPTRequestConfig } from '../types';
import GPTRequest from './http';

const apiKey = import.meta.env.VITE_OPEN_API_KEY

export async function makeChatCompletionStream(messageList: ChatMessage[]) {
    console.log('sending requests!');
    try {
        const response = await fetch('http://www.tako1224.top:3000/', {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                // Authorization: `Bearer aiwefjwaeoifh`
                Authorization: `Bearer ${apiKey}`
            },
            mode: 'cors',
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                stream: true,
                uri: '/chat/completions/',
                messages: messageList
            })
        });
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
const ChatRequest = <D, T = GPTResponse> (config: ChatRequestConfig<D>) => {
    const { method = 'POST'} = config;
    if (method === 'get' || method === 'GET') {
        config.params = config.data
    }
    return request.request<T>(config);
}

export default ChatRequest;