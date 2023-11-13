import { isString } from 'lodash'
import apiMethods from './http'

function uniqArray(array) {
  const temp = []
  const zeroData = ['', '0', 0]
  for (let i = 0; i < array.length; i++) {
    if (!zeroData.includes(array[i]) && temp.indexOf(array[i]) == -1) {
      temp.push(array[i])
    }
  }
  return temp
}

function uniqString(array) {
  return uniqArray(array.join(',').split(',')).join(',')
}

function getBaseColumns(apiExtends = {}, template = [], excludeColumns = []) {
  const baseColumns = []
  template.forEach((item) => {
    if (!Object.prototype.hasOwnProperty.call(item, 'field')) {
      return
    }

    const currentField = item.field

    if (excludeColumns.includes(currentField)) {
      return
    }

    let currentFields = [currentField]
    if (currentField.indexOf(',') >= 0) {
      currentFields = currentField.split(',')
    }

    currentFields.forEach((field) => {
      if (field.indexOf('.') < 0) {
        baseColumns.push(field)
        return
      }

      const key = field.substring(0, field.indexOf('.'))
      if (!Object.prototype.hasOwnProperty.call(apiExtends, key)) {
        return
      }

      apiExtends[key].columns.push(field.substring(field.indexOf('.') + 1))
    })
  })

  Object.keys(apiExtends).forEach((key) => {
    const item = apiExtends[key]
    baseColumns.push(item.source_key)
  })

  return baseColumns
}

async function getCurrentData(api, apiExtends, baseColumns = []) {
  if (!Object.prototype.hasOwnProperty.call(api, 'params')) {
    api.params = {}
  }
  api.params.column = uniqString(baseColumns)

  let currentData = []
  await apiMethods.methods.apiGet(api.api, api.params).then((res) => {
    res.data.forEach((item) => {
      Object.keys(apiExtends).forEach((key) => {
        const apiExtend = apiExtends[key]
        apiExtend.source_data.push(item[apiExtend.source_key])
      })
    })
    currentData = res
  })
  return currentData
}

function getBatchApis(apiExtends) {
  const batchApis = {}
  const batchParams = {}
  const zeroData = ['', '0', 0]
  Object.keys(apiExtends).forEach((key) => {
    const apiExtend = apiExtends[key]
    const inData = uniqString(apiExtend.source_data)
    // 如果没有数据，不请求
    if (zeroData.includes(inData)) {
      return
    }

    batchApis[key] = apiExtend.api
    apiExtend.columns.push(apiExtend.target_key)

    batchParams[key] = {
      column: uniqString(apiExtend.columns),
    }
    batchParams[key][apiExtend.target_key] = {
      in: inData,
    }
    Object.assign(batchParams[key], apiExtend.params)
  })

  return { apis: batchApis, params: batchParams }
}

async function getApiExtendData(batchApis) {
  let apiExtendData = []
  await apiMethods.methods
    .apiGetBatch(batchApis.apis, batchApis.params)
    .then((res) => {
      apiExtendData = res
    })
  return apiExtendData
}

function parseData(
  currentData,
  apiExtends,
  apiExtendData,
  keepColumns = false,
) {
  currentData.data.forEach((item) => {
    Object.keys(apiExtends).forEach((key) => {
      const apiExtend = apiExtends[key]
      if (!keepColumns) {
        item[key] = {}
      }
      if (!apiExtendData[key] || !apiExtendData[key].data) {
        return
      }
      apiExtendData[key].data.forEach((apiExtendItem) => {
        Object.keys(apiExtendItem).forEach((apiExtendKey) => {
          if (
            apiExtend.target_key === apiExtendKey
            && apiExtendItem[apiExtendKey] === item[apiExtend.source_key]
          ) {
            if (keepColumns) {
              Object.keys(apiExtendItem).forEach((apiExtendKeyNew) => {
                item[`${key}.${apiExtendKeyNew}`] = apiExtendItem[apiExtendKeyNew]
              })
            } else {
              item[key] = apiExtendItem
            }
          }
        })
      })
    })
  })

  return currentData
}

async function api(
  api = {},
  apiExtends = {},
  template = [],
  excludeColumns = [],
  keepColumns = false,
  convertTemplates = false,
) {
  Object.keys(apiExtends).forEach((key) => {
    apiExtends[key].columns = []
    apiExtends[key].source_data = []
    if (!Object.prototype.hasOwnProperty.call(apiExtends[key], 'params')) {
      apiExtends[key].params = {}
    }
  })

  if (convertTemplates) {
    if (isString(template)) {
      template = template.split(',')
    }
    template = template.map((item) => ({
      field: item,
    }))
  }

  if (excludeColumns.length === 0) {
    excludeColumns = [
      'framework_action',
      'framework_index',
      'framework_selection',
    ]
  }

  const baseColumns = getBaseColumns(apiExtends, template, excludeColumns)
  const currentData = await getCurrentData(api, apiExtends, baseColumns)
  const batchApis = getBatchApis(apiExtends)

  if (Object.keys(batchApis.apis).length < 1) {
    return currentData
  }

  const apiExtendData = await getApiExtendData(batchApis)
  return parseData(currentData, apiExtends, apiExtendData, keepColumns)
}

export default api
