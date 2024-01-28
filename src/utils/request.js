import axios from 'axios'
import isJSON from 'validator/lib/isJSON'
import qs from 'qs'
import JSONBig from 'json-bigint'
import { isObject } from 'lodash'
import { lock } from '@/utils/auth'
import { createSignature } from './signature'
import store from '../store'
import utils from './index'
import router from '@/router'
import getServerConfig from './server-config'

const serverConfig = await getServerConfig()

// 创建 axios 实例
const service = axios.create({
  baseURL: `${serverConfig.APP_BASE_API}/`, // api 的 base_url
  timeout: 15000, // 请求超时时间
  transformResponse: [
    function (data) {
      try {
        // 超过16位的整型无法处理
        return JSONBig({ storeAsString: true }).parse(data)
      } catch (err) {
        return data
      }
    },
  ],
})

function packageParams(requestData, urlParams) {
  const baseData = {
    format: 'json',
    app_key: serverConfig.APP_KEY,
    app_secret: '',
    timestamp: new Date().getTime(),
    signature_method: 'hmac_sha256',
  }

  const apiToken = store.state.user.token
  if (apiToken) {
    baseData.token = apiToken
  }

  const { appSecret } = store.state.user
  if (Object.keys(appSecret).length > 0) {
    baseData.app_key = appSecret.tmp_app_key
    baseData.app_secret = appSecret.tmp_app_secret
  }

  if (requestData instanceof FormData) {
    if (!requestData.has('v1')) {
      baseData.version = 'v1'
    }
    baseData.signature = createSignature(baseData, baseData.app_secret)

    for (const key in baseData) {
      requestData.append(key, baseData[key])
    }

    if (Object.keys(urlParams).length > 0) {
      for (const key in urlParams) {
        requestData.append(key, urlParams[key])
      }
    }
  } else {
    Object.assign(requestData, baseData)
    if (Object.keys(urlParams).length > 0) {
      Object.assign(requestData, urlParams)
    }
    if (!Object.prototype.hasOwnProperty.call(requestData, 'version')) {
      requestData.version = 'v1'
    }

    requestData.signature = createSignature(requestData, baseData.app_secret)
  }
}

function getUrlParams(queryString) {
  const params = {}
  const regex = /\?([^#]*)/
  const match = regex.exec(queryString)
  if (match) {
    const query = match[1]
    const pairs = query.split('&')
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=')
      const key = decodeURIComponent(pair[0])
      const value = decodeURIComponent(pair[1])
      params[key] = value
    }
  }
  return params
}

// request 拦截器
service.interceptors.request.use(
  (config) => {
    if (
      config.method == 'post'
      && !Object.prototype.hasOwnProperty.call(config.headers, 'Content-Type')
    ) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    if (config.method == 'get') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    if (
      !(
        Object.prototype.hasOwnProperty.call(config.headers, 'Content-Type')
        && config.headers['Content-Type'] === 'multipart/form-data'
      )
    ) {
      config.transformRequest = [
        function (data) {
          return qs.stringify(data)
        },
      ]
    }

    const methods = ['get', 'delete']

    let urlParams = {}
    if (config.url.indexOf('?') > -1) {
      urlParams = getUrlParams(config.url)
    }

    if (methods.includes(config.method)) {
      packageParams(config.params, urlParams)
    } else {
      packageParams(config.data, urlParams)
    }

    return config
  },
  (error) => Promise.reject(error),
)

// respone 拦截器
service.interceptors.response.use(
  (response) => {
    if (typeof response.data !== 'object') {
      utils.error('Response data must be JSON.')
      return Promise.reject()
    }

    // 调试信息
    if (Object.prototype.toString.call(response.data) === '[object Array]') {
      const lastItem = response.data[response.data.length - 1]

      if (lastItem && lastItem[':trace']) {
        response.data.pop()
      }
    } else if (response.data[':trace']) {
      delete response.data[':trace']
    }

    if (response.data.success) {
      if (typeof response.data.success !== 'object') {
        utils.error('Response success data must be JSON.')
        return Promise.reject()
      }

      if (
        response.data.success.throw_message
        && response.data.success.message
      ) {
        utils.success(response.data.success.message)
      }
    }

    return response.data
  },
  (err) => {
    if (err && err.response) {
      let duration = 5
      if (isObject(err.response.data)) {
        if (
          isObject(err.response.data.error)
          && err.response.data.error.duration
        ) {
          duration = err.response.data.error.duration
        }

        if (isJSON(err.response.data.error.message)) {
          const tmp = JSON.parse(err.response.data.error.message)
          let errorMessage = '<ul class="list-disc text-left m-l-15">'
          Object.keys(tmp).forEach((key) => {
            tmp[key].forEach((v) => {
              errorMessage += `<li>${v}</li>`
            })
          })
          errorMessage += '</ul>'
          utils.multilineError(errorMessage, duration)
        } else {
          utils.error(err.response.data.error.message, duration)
        }
      } else {
        utils.error(err.response.data, duration)
      }

      if (err.response.status === 424) {
        lock('dashboard')

        setTimeout(() => {
          router.replace('/locking')
        }, 1000)
      } else if (err.response.status === 401) {
        setTimeout(() => {
          store.dispatch('logout')
          router.replace('/login')
        }, 1000)
      }
    }

    return Promise.reject(err)
  },
)

export default service
