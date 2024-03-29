import qs from 'qs'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import Base64 from 'crypto-js/enc-base64'
import ksort from 'json-ksort'

export function createSignature(params, appSecret) {
  if (Object.keys(params).length === 0) {
    return ''
  }

  const str = parseParamsString(params, appSecret)
  return Base64.stringify(hmacSHA256(str, appSecret))
}

function parseParamsString(params, appSecret) {
  if (Object.keys(params).length === 0) {
    return ''
  }

  // 解析表单键为 `hello[foo][bar]` 此类数据为对象
  let paramsNew = qs.parse(qs.stringify(params))
  // 按键排序数据
  paramsNew = ksort(paramsNew)

  const tmpParams = [appSecret]
  for (const i in paramsNew) {
    let value = paramsNew[i]
    if (typeof paramsNew[i] === 'object' || paramsNew[i] instanceof Array) {
      value = createSignature(paramsNew[i], appSecret)
    } else if (typeof value === 'string' && value.constructor == String) {
      value = value.replace(/^\s+/, '').replace(/\s+$/, '')
    }
    tmpParams.push(i + value)
  }
  tmpParams.push(appSecret)

  return tmpParams.join('')
}
