import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { GPTRequestConfig, GPTRequestInterceptors } from '../types';

class GPTRequest {
    // axios instance
    instance: AxiosInstance;
    interceptorsObj?: GPTRequestInterceptors;

    constructor(config: GPTRequestConfig) {
        this.instance = axios.create(config);
        
        // interceptors
        this.instance.interceptors.request.use(
            (res: AxiosRequestConfig) => {
                console.log('global request interceptor');
                if (res.headers) {
                    res.headers.Authorization = `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`;
                }
                return res;
            },
            (err: any) => err
        )

        // instance interceptors
        this.instance.interceptors.request.use(
            this.interceptorsObj?.requestInterceptors,
            this.interceptorsObj?.requestInterceptorsCatch
        )
        this.instance.interceptors.response.use(
            this.interceptorsObj?.responseInterceptors,
            this.interceptorsObj?.responseInterceptorsCatch
        )

        // make sure global response interceptor is at the last
        this.instance.interceptors.response.use(
            (res: AxiosResponse) => {
                console.log('global response interceptor');
                // console.log(res.status);
                return res.data;
            },
            (err: any) => err
        )

    }

    request<T>(config: GPTRequestConfig): Promise<T> {
        return new Promise((resolve, reject) => {
            if (config.interceptors?.requestInterceptors) {
                config = config.interceptors.requestInterceptors(config)
            }
            this.instance.request<any, T>(config).then(res => {

                if (config.interceptors?.responseInterceptors) {
                    res = config.interceptors.responseInterceptors<T>(res);
                }

                console.log(res instanceof Response);
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            })
        })
    }
    // request(config: AxiosRequestConfig) {
    //     return this.instance.request(config);
    // }
}

export default GPTRequest