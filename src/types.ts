import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface GPTRequestInterceptors {
    // request interceptor
    requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
    requestInterceptorsCatch?: (err: any) => any;

    // response interceptor
    responseInterceptors?: <T = AxiosResponse>(config: T) => T;
    responseInterceptorsCatch?: (err: any) => any;
}

export interface GPTRequestConfig extends AxiosRequestConfig {
    interceptors?: GPTRequestInterceptors;
}

export interface ChatMessage {
    role: Role
    content: string
    special?: 'default' | 'locked' | 'temporary'
}

interface ChatResponseMessage {
    index: number,
    message: ChatMessage,
    finish_reason: string
}

interface Usage {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number
}

export type Role = 'system' | 'user' | 'assistant' | 'error'
export type Model = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-32k'

export interface PromptItem {
    desc: string
    prompt: string
    positions?: Set<number>
}

export interface ChatRequest {
    model: Model,
    messages: ChatMessage[],
    temperature?: Number,
    top_p?: Number,
    n?: Number,
    stream?: Boolean,
    stop?: Boolean,
    max_tokens?: Number,
    presence_penalty?: Number,
    frequency_penalty?: Number,
    user?: String
}

export interface ChatResponse {
    id: string,
    object: string,
    created: number,
    model: string,
    choices: ChatResponseMessage[],
    usage: Usage
}