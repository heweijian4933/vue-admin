/**
 * axios封装
 */

import axios from 'axios';
import config from '@/config'

import router from '@/router'

import { ElMessage } from "element-plus"
const TOKEN_INVALID = 'Token认证失败,请重新登录'
const NETWORK_ERROR = '网络请求异常,请稍后重试'

// 创建axios实例,添加全局配置
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000,
})

// 请求拦截封装
service.interceptors.request.use(req => {
    // todo,添加token
    const headers = req.headers
    if (!headers.Authorization) headers.Authorization = "Bear token to be added"
    return req
})

// 响应拦截封装
service.interceptors.response.use(res => {
    const { code, msg, data } = res.data

    if (code === 200) {
        // 说明响应正常
        return data
    } else if (code === 40001) {
        // 40001: token认证失败(大部分情况下是因为token过期)
        ElMessage.error(TOKEN_INVALID)
        setTimeout(() => {
            router.push('/login')
        }, 1000)
        return Promise.reject(TOKEN_INVALID)
    } else {
        //提示错误 或者 在没有正确返回格式(msg)的情况下提示网络错误
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
})

/**
 * 请求核心函数封装
 * @param {*} options 请求配置
 */
function request(options) {
    options.method = options.method || 'get'

    // 习惯将get的参数设置到params,这样后续方便区分
    if (options.method.toLowerCase() == 'get') {
        options.params = options.data
    }

    if (config.env == 'prod') {
        // 强制将开发环境的请求地址设置正确,防止误入mock的请求地址造成事故
        service.defaults.baseURL = config.baseApi
    } else {
        service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
    }

    return service(options)
}

// 以上request会在main.js里面挂载作为全局关键字$request去调用
// 直接$request({options}).then(res=>{//do something})就可以调用
// 有些时候或者有些成员习惯用request.get('/query',{name:'stephen'},{mock:true})这样的方式来请求
// 因此对request的不同方法做了以下配置
['get', 'post', 'put', 'delete', 'patch'].forEach(method => {
    request[method] = (url, data, options) => {
        return request({
            url,
            data,
            method,
            ...options,
        })
    }
})

export default request