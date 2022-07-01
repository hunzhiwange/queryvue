import service from './request'

const apiMethods = {
    methods: {
        apiGet(url, params, headers) {
            return this.api(url, {}, 'get', params, headers)
        },
        apiPost(url, data, params, headers) {
            return this.api(url, data, 'post', params, headers)
        },
        apiDelete(url, id, data, params, headers) {
            return this.api(url + (id ? '/' + id : ''), data, 'delete', params, headers)
        },
        apiPut(url, id, data, params, headers) {
            return this.api(url + (id ? '/' + id : ''), data, 'put', params, headers)
        },
        api(url, data, type, params, headers) {
            data = data || {}
            type = type || 'get'
            params = params || {}
            headers = headers || {}

            // 判断 URL 版本
            if (-1 === url.indexOf(':')) {
                url = 'v1:' + url
            }

            return new Promise((resolve, reject) => {
                service({
                    url: url,
                    method: type,
                    data: data,
                    params: params,
                    headers: headers,
                }).then(
                    response => {
                        resolve(response)
                    },
                    response => {
                        reject(response)
                    }
                )
            })
        },
    },
}

export default apiMethods
