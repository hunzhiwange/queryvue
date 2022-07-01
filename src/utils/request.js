import axios from 'axios'
import isJSON from 'validator/lib/isJSON'
import { lock } from '@/utils/auth'
import Vue from 'vue'
import qs from 'qs'
import { createSignature } from './signature'

Vue.prototype.$axios = axios

// 创建 axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API + '/api/', // api 的 base_url
    timeout: 15000, // 请求超时时间
})

function package_params(requestData) {
    let baseData = {
        format: 'json',
        app_key: process.env.VUE_APP_KEY,
        timestamp: new Date().getTime(),
        method: 'set_or_get.module.demo',
        signature_method: 'hmac_sha256',
    }

    let apiToken = bus.$store.state.user.token
    if (apiToken) {
        baseData['token'] = apiToken;
    }

    if (requestData instanceof FormData) {
        if (!requestData.has('v1')) {
            baseData['version'] = 'v1'
        }
        baseData['signature'] = createSignature(baseData, process.env.VUE_APP_SECRET)

        for (let key in baseData) {
            requestData.append(key, baseData[key])
        }
    } else {
        Object.assign(requestData, baseData)
        if (!requestData.hasOwnProperty('version')) {
            requestData['version'] = 'v1'
        }
        requestData['signature'] = createSignature(requestData, process.env.VUE_APP_SECRET)
    }
}

// request 拦截器
service.interceptors.request.use(
    config => {
        if (config.method == 'post' && !config.headers.hasOwnProperty('Content-Type')) {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }

        if (config.method == 'get') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }

        if (!(config.headers.hasOwnProperty('Content-Type') && config.headers['Content-Type'] == 'multipart/form-data')) {
            config.transformRequest = [
                function (data) {
                    return qs.stringify(data)
                },
            ]
        }

        let methods = ['get', 'delete']

        if (methods.includes(config.method)) {
            package_params(config.params)
        } else {
            package_params(config.data)
        }

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// respone 拦截器
service.interceptors.response.use(
    response => {
        if ('object' !== typeof response.data) {
            utils.error('Response data must be JSON.')
            return Promise.reject()
        }

        // 调试信息
        if (Object.prototype.toString.call(response.data) === '[object Array]') {
            let lastItem = response.data[response.data.length - 1]

            if (lastItem && lastItem[':trace']) {
                response.data.pop()
            }
        } else if (response.data[':trace']) {
            delete response.data[':trace']
        }

        if (response.data['success']) {
            if ('object' !== typeof response.data['success']) {
                utils.error('Response success data must be JSON.')
                return Promise.reject()
            }

            if (response.data['success']['throw_message'] &&
                response.data['success']['message']) {
                utils.success(response.data['success']['message'])
            }
        }

        return response.data

        // const res = response.data
        // if (res.code) {
        //     switch (res.code) {
        //         case 200:
        //             return response.data
        //             break
        //         case 101:
        //             utils.warning(res.message, res.code)
        //             setTimeout(() => {
        //                 router.replace('/login')
        //             }, 1500)
        //             // 为了重新实例化 vue-router 对象,避免 bug
        //             // location.reload()
        //             break
        //         case 102:
        //             utils.warning(res.message, res.code)
        //             setTimeout(() => {
        //                 router.push({name: 'locking'});
        //             }, 1500)
        //             break
        //         case 103:
        //             utils.warning(res.message, res.code)
        //             setTimeout(() => {
        //                 router.replace('/login')
        //             }, 1500)
        //             // 为了重新实例化 vue-router 对象,避免 bug
        //             // location.reload()
        //             break
        //         case 400:
        //             utils.warning(res.message)
        //             break;
        //         default:
        //             utils.warning(res.message, res.code)
        //     }
        //     return Promise.reject(response.data)
        // } else {
        //     return Promise.reject([])
        // }
    },
    err => {
        if (err && err.response) {
            // switch (err.response.status) {
            //     case 400:
            //         err.message = '请求错误'
            //         break

            //     case 401:
            //         err.message = '未授权，请登录'
            //         break

            //     case 403:
            //         err.message = '拒绝访问'
            //         break

            //     case 404:
            //         err.message = '请求地址出错'
            //         break

            //     case 408:
            //         err.message = '请求超时'
            //         break

            //     case 500:
            //         err.message = '服务器内部错误'
            //         break

            //     case 501:
            //         err.message = '服务未实现'
            //         break

            //     case 502:
            //         err.message = '网关错误'
            //         break

            //     case 503:
            //         err.message = '服务不可用'
            //         break

            //     case 504:
            //         err.message = '网关超时'
            //         break

            //     case 505:
            //         err.message = 'HTTP版本不受支持'
            //         break

            //     default:
            // }

            if (isJSON(err.response.data.error.message)) {
                let tmp = JSON.parse(err.response.data.error.message)

                Object.keys(tmp).forEach(key => {
                    tmp[key].forEach(v => {
                        utils.error(v)
                    })
                })
            } else {
                utils.error(err.response.data.error.message)
            }

            if (424 === err.response.status) {
                lock('dashboard')

                setTimeout(() => {
                    router.replace('/locking')
                }, 1000)
            } else if (401 === err.response.status) {
                setTimeout(() => {
                    bus.$store.dispatch('logout')
                    router.replace('/login')
                }, 1000)
            }
        }

        return Promise.reject(err)
    }
)

export default service
