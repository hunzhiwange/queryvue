import service from './request'

const apiMethods = {
  methods: {
    apiGet(url, params, headers, config = {}) {
      return this.api(url, {}, 'get', params, headers, config)
    },
    apiPost(url, data, params, headers, config = {}) {
      return this.api(url, data, 'post', params, headers, config)
    },
    apiDelete(url, id, data, params, headers, config = {}) {
      return this.api(
        url + (id ? `/${id}` : ''),
        data,
        'delete',
        params,
        headers,
        config,
      )
    },
    apiPut(url, id, data, params, headers, config = {}) {
      return this.api(
        url + (id ? `/${id}` : ''),
        data,
        'put',
        params,
        headers,
        config,
      )
    },
    apiPatch(url, id, method, data, params, headers, config = {}) {
      return this.api(
        url + (id ? `/${id}` : '') + (method ? `/${method}` : ''),
        data,
        'patch',
        params,
        headers,
        config,
      )
    },
    apiGetBatch(api, params, headers, config = {}) {
      return this.api(
        'apiQL/v1:batch',
        {},
        'get',
        {
          apis: api,
          params,
        },
        headers,
        config,
      )
    },
    api(url, data, type, params, headers, config = {}) {
      data = data || {}
      type = type || 'get'
      params = params || {}
      headers = headers || {}

      let app = ''
      if (url.indexOf('app:') === 0) {
        const index = url.indexOf('/')
        if (index !== -1) {
          app = url.substring(0, index)
          url = url.substring(index + 1)
        }
      }

      // 判断 URL 版本
      if (!/apiQL\/v[1-9]+:/.test(url)) {
        url = `apiQL/v1:${url}`
      }

      if (app) {
        url = `${app}/${url}`
      }

      return new Promise((resolve, reject) => {
        service({
          url,
          method: type,
          data,
          params,
          headers,
          ...config,
        }).then(
          (response) => {
            resolve(response)
          },
          (response) => {
            reject(response)
          },
        )
      })
    },
  },
}

export default apiMethods
