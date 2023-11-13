import minimatch from 'minimatch'
import { Message, Notice, Modal } from 'view-ui-plus'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import { isObject } from 'lodash'
import $store from '../store'
import router from '@/router'

const utils = {}

utils.title = function (title) {
  window.document.title = __(title)
}

utils.inOf = function (arr, targetArr) {
  let res = true
  arr.map((item) => {
    if (targetArr.indexOf(item) < 0) {
      res = false
    }
  })
  return res
}

utils.oneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true
  }
  return false
}

utils.showThisRoute = function (itAccess, currentAccess) {
  if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
    return utils.oneOf(currentAccess, itAccess)
  }
  return itAccess === currentAccess
}

utils.getRouterObjByName = function (routers, name) {
  if (!name || !routers || !routers.length) {
    return null
  }

  let routerObj = null
  for (const item of routers) {
    if (item.name === name) {
      return item
    }
    routerObj = utils.getRouterObjByName(item.children, name)
    if (routerObj) {
      return routerObj
    }
  }
  return null
}

utils.handleItem = function (vm, item) {
  if (item == undefined) {
    return false
  }

  return {
    meta: {
      title: item.meta && item.meta.title ? item.meta.title : '',
    },
    icon: item.icon ? item.icon : '',
    name: item.name,
    path: item.path,
  }
}

utils.setCurrentPath = function (vm, name) {
  return
  let curRouter = []
  let currentPathArr = []

  $store.state.app.routers.forEach((item) => {
    if (item.children.length === 1) {
      if (item.children[0].name === name) {
        curRouter = utils.handleItem(vm, item)
      }
    } else {
      item.children.forEach((child) => {
        if (!child.children || child.children < 1) {
          if (child.name === name) {
            curRouter = utils.handleItem(vm, child)
          }
        } else {
          child.children.forEach((child) => {
            if (child.name === name) {
              curRouter = utils.handleItem(vm, child)
            }
          })
        }
      })
    }
  })

  if (name === 'dashboard') {
    currentPathArr = [curRouter]
  } else {
    let currentPathObj = $store.state.app.routers.filter((item) => {
      if (item.children.length <= 1) {
        return item.children[0].name === name
      }
      let i = 0
      const childArr = item.children
      const len = childArr.length
      while (i < len) {
        if (childArr[i].name === name) {
          return true
        }
        i++
      }
      return false
    })[0]

    let currentSubPathObj
    let currentFirstLevelPathObj

    if (!currentPathObj) {
      let i = 0
      const routerArr = $store.state.app.routers
      const len = routerArr.length
      outer: while (i < len) {
        let m = 0
        const childArr = routerArr[i].children
        const lenChild = childArr.length
        while (m < lenChild) {
          if (childArr[m].children && childArr[m].children.length > 0) {
            let n = 0
            const subChildArr = childArr[m].children
            const lenSubChild = subChildArr.length
            while (n < lenSubChild) {
              if (subChildArr[n].name === name) {
                currentPathObj = childArr[m]
                currentSubPathObj = subChildArr[n]
                currentFirstLevelPathObj = routerArr[i]
                break outer
              }
              n++
            }
          }
          m++
        }
        i++
      }
    }

    if (currentPathObj === undefined) {
      throw 'Can not find children router'
    } else if (currentPathObj.children.length <= 1) {
      currentPathArr = [
        utils.handleItem(
          vm,
          utils.getRouterObjByName($store.state.app.routers, 'dashboard'),
        ),
        utils.handleItem(vm, currentPathObj),
      ]
    } else {
      currentPathArr = [
        utils.handleItem(
          vm,
          utils.getRouterObjByName($store.state.app.routers, 'dashboard'),
        ),
      ]

      if (currentFirstLevelPathObj) {
        currentPathArr.push(utils.handleItem(vm, currentFirstLevelPathObj))
      } else {
        const parent = utils.handleItem(vm, currentPathObj)
        const childFirst = utils.handleItem(vm, currentPathObj.children[0])
        parent.name = childFirst.name
        parent.path = childFirst.path
        currentPathArr.push(parent)
      }

      if (currentSubPathObj) {
        currentPathArr.push(utils.handleItem(vm, currentPathObj))
        currentPathArr.push(utils.handleItem(vm, currentSubPathObj))
      } else {
        const childObj = currentPathObj.children.filter(
          (child) => child.name === name,
        )[0]
        currentPathArr.push(utils.handleItem(vm, childObj))
      }
    }
  }

  $store.commit('setCurrentPath', currentPathArr)
  return currentPathArr
}

utils.openNewPage = function (vm, name, argu, query) {
  if ($store === undefined) {
    return
  }

  const pageOpenedList = $store.state != undefined ? $store.state.app.pageOpenedList : []
  const openedPageLen = pageOpenedList.length
  let i = 0
  let tagHasOpened = false
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) {
      // 页面已经打开
      $store.commit('pageOpenedList', {
        index: i,
        argu,
        query,
      })
      tagHasOpened = true
      break
    }
    i++
  }
  if (!tagHasOpened) {
    let tag = $store.state.app.tagsList.filter((item) => {
      if (item.children && item.children.length > 1) {
        return item.children.filter((v) => name === v.name).length > 0
      }
      if (item.children) {
        return name === item.children[0].name
      }
      return name === item.name
    })

    tag = tag[0]
    if (tag) {
      if (tag.children && tag.children.length > 1) {
        tag = tag.children.filter((v) => name === v.name)[0]
      } else if (tag.children) {
        tag = tag.children[0]
      }

      if (argu) {
        tag.argu = argu
      }
      if (query) {
        tag.query = query
      }
      $store.commit('increateTag', tag)
    }
  }
  $store.commit('setCurrentPageName', name)
}

utils.toDefaultPage = function (routers, name, route, next) {
  const len = routers.length
  let i = 0
  let notHandle = true
  while (i < len) {
    if (
      routers[i].name === name
      && routers[i].children
      && routers[i].redirect === undefined
    ) {
      route.replace({ name: routers[i].children[0].name })
      notHandle = false
      next()
      break
    }
    i++
  }
  if (notHandle) {
    next()
  }
}

utils.fullscreenEvent = function (vm) {
  $store.commit('initCachePage')
  // 权限菜单过滤相关
  $store.commit('updateMenulist')
  // 全屏相关
}

utils.j2s = function (obj) {
  return JSON.stringify(obj)
}

utils.success = function (message, title, duration = 1.5) {
  Notice.success({
    title: title || '',
    desc: message || __('操作成功'),
    duration,
  })
}

utils.info = function (message, title, duration = 1.5) {
  Notice.info({
    title: title || '',
    desc: message || __('操作成功'),
    duration,
  })
}

utils.warning = function (message, title, duration = 1.5) {
  Notice.warning({
    title: title || '',
    desc: message || __('操作失败'),
    duration,
  })
}

utils.error = function (message, duration = 5) {
  Message.error({
    content: message || __('操作失败'),
    duration,
    closable: true,
    background: true,
  })
}

utils.errorNotFound = function () {
  utils.error(__('抱歉，没有找到相关数据，这可能是因为数据已被删除。'))
}

utils.multilineError = function (message, duration = 5) {
  Modal.error({
    title: __('操作失败'),
    content: message,
  })

  if (duration > 0) {
    setTimeout(() => {
      Modal.remove()
    }, duration * 1000)
  }
}

utils.multilineWarning = function (message, duration = 5) {
  Modal.warning({
    title: __('操作提示'),
    content: message,
  })

  if (duration > 0) {
    setTimeout(() => {
      Modal.remove()
    }, duration * 1000)
  }
}

utils.multilineSuccess = function (message, duration = 5) {
  Modal.success({
    title: __('操作成功'),
    content: message,
  })

  if (duration > 0) {
    setTimeout(() => {
      Modal.remove()
    }, duration * 1000)
  }
}

utils.multilineInfo = function (message, duration = 5) {
  Modal.info({
    title: __('操作提示'),
    content: message,
  })

  if (duration > 0) {
    setTimeout(() => {
      Modal.remove()
    }, duration * 1000)
  }
}

utils.clearVuex = function (cate) {
  store.dispatch(cate, [])
}

utils.getHasRule = function (val) {
  const moduleRule = 'admin'
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  if (userInfo.id == 1) {
    return true
  }
  const authList = moduleRule + JSON.parse(localStorage.getItem('authList'))
  return _.includes(authList, val)
}

utils.parseTime = function (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (`${time}`.length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = `0${value}`
    }
    return value || 0
  })
  return time_str
}

utils.formatTime = function (time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  }
  if (diff < 3600) {
    // less 1 hour
    return `${Math.ceil(diff / 60)}分钟前`
  }
  if (diff < 3600 * 24) {
    return `${Math.ceil(diff / 3600)}小时前`
  }
  if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  }
  return `${
    d.getMonth() + 1
  }月${d.getDate()}日${d.getHours()}时${d.getMinutes()}分`
}

// 格式化时间
utils.getQueryObject = function (url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
utils.getByteLen = function (val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

utils.cleanArray = function (actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

utils.param = function (json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return ''
      return `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`
    }),
  ).join('&')
}

utils.param2Obj = function (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    `{"${decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')}"}`,
  )
}

utils.html2Text = function (val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

utils.objectMerge = function (target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  for (const property in source) {
    if (Object.prototype.hasOwnProperty.call(source, property)) {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = objectMerge(target[property], sourceProperty)
        continue
      }
      target[property] = sourceProperty
    }
  }
  return target
}

utils.scrollTo = function (element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = (difference / duration) * 10
  setTimeout(() => {
    element.scrollTop += perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

utils.toggleClass = function (element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += `${className}`
  } else {
    classString = classString.substr(0, nameIndex)
      + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

utils.getTime = function (type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  }
  return new Date(new Date().toDateString())
}

utils.debounce = function (func, wait, immediate) {
  let timeout
  let args
  let context
  let timestamp
  let result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为 immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

utils.deepClone = function (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (Object.prototype.hasOwnProperty.call(source, keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

let timeoutForOnce = null
utils.once = function (fn, time) {
  if (timeoutForOnce) {
    clearTimeout(timeoutForOnce)
  }

  timeoutForOnce = setTimeout(fn, time)
}

utils.pregQuote = function (data) {
  // 不包含 *，因为要作为通配符匹配规则
  // Js 版本的 preg-quote
  // http://php.net/manual/zh/function.preg-quote.php
  // JS 配合 minimatch 来实现和 PHP 一样的效果，可能有点差异
  // 通过设置正则规则限制一些非常特殊的字符串来达到效果
  // console.log(minimatch("hello?worldyes", utils.pregQuote("hello?world*yes"))) // true
  // $regex = preg_quote($regex, '/');
  // $regex = '/^'.str_replace('\*', '(\S*)', $regex).'$/';
  // return $regex;

  const specials = '.+?[^]$(){}=!<>|-:'

  specials.split('').forEach((v) => {
    data = data.replace(new RegExp(`\\${v}`, 'g'), `\\${v}`)
  })

  return data
}

utils.permission = function (resource, method) {
  const permissionData = {}
  if (isObject($store)) {
    Object.assign(permissionData, $store.state.user.rules)
  }

  if (!permissionData.static) {
    // 权限设置
    const authList = window.localStorage.getItem('authList')
    Object.assign(
      permissionData,
      authList ? JSON.parse(authList) : { static: [], dynamic: [] },
    )
  }

  // 超级管理员
  if (permissionData.static.includes('*')) {
    return true
  }

  // 所有请求
  if (permissionData.static.includes(resource)) {
    return true
  }

  // 带有请求类型
  if (method && permissionData.static.includes(`${method}:${resource}`)) {
    return true
  }

  // 动态类型
  let p = ''
  for (let i = 0; i < permissionData.dynamic.length; i++) {
    p = permissionData.dynamic[i]

    // 无请求类型
    if (minimatch(resource, utils.pregQuote(p))) {
      return true
    }

    // 带有请求类型
    if (method && minimatch(`${method}:${resource}`, utils.pregQuote(p))) {
      return true
    }
  }

  return false
}

utils.objArraySort = function (array, key) {
  array.sort((a, b) => a[key] - b[key])
}

utils.compareJsonTypes = function (json1, json2) {
  if (typeof json1 !== typeof json2) {
    return false
  }

  if (typeof json1 !== 'object' || json1 === null || json2 === null) {
    // 如果两个值不是对象或者其中一个值为 null，则类型一致
    return true
  }

  const keys1 = Object.keys(json1)
  const keys2 = Object.keys(json2)

  if (keys1.length !== keys2.length) {
    // 如果两个对象的键数量不一致，则类型不一致
    return false
  }

  for (const key of keys1) {
    if (
      !Object.prototype.hasOwnProperty.call(json2, key)
      || !utils.compareJsonTypes(json1[key], json2[key])
    ) {
      // 如果 json2 中不包含 json1 的键，或者 json1 和 json2 中同名键的值类型不一致，则类型不一致
      return false
    }
  }

  // 所有键的值类型都一致
  return true
}

utils.refreshPage = function (args) {
  if (Object.prototype.hasOwnProperty.call(args, 'fullPath')) {
    args = {
      path: args.path,
      query: args.query,
    }
  }

  const query = {}
  query.redirect = JSON.stringify(args)
  router.push({ name: 'black-page', query })
}

function _extends() {
  _extends = Object.assign
    || function (target) {
      for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i]

        for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }

      return target
    }

  return _extends.apply(this, arguments)
}

utils.deepMerge = function (target, source) {
  if (source) {
    for (const s in source) {
      if (Object.prototype.hasOwnProperty.call(source, s)) {
        const value = source[s]

        if (typeof value === 'object' && typeof target[s] === 'object') {
          target[s] = { ...target[s], ...value }
        } else {
          target[s] = value
        }
      }
    }
  }

  return target
}

utils.buildTree = function (data, parentId) {
  const tree = []

  for (let i = 0; i < data.length; i++) {
    if (data[i].parent_id == parentId) {
      const node = {
        title: data[i].name,
        value: data[i].id.toString(),
        selected: false,
        checked: false,
        expand: true, // 添加 expand 字段并设置为 true
        children: utils.buildTree(data, data[i].id),
      }

      tree.push(node)
    }
  }

  return tree
}

utils.ucFirst = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

utils.importComponent = function (path) {
  const viewModules = import.meta.glob('../views/**/*.vue')
  const fileKey = `../views/${path}.vue`

  if (Object.prototype.hasOwnProperty.call(viewModules, fileKey)) {
    return viewModules[fileKey]
  }

  throw new Error(`Can't find the path '${fileKey}' of component '${path}' .`)
}

utils.uuid = function (namespace) {
  let uuid = uuidv4()
  if (namespace) {
    uuid = uuidv5(uuid, namespace)
  }

  return uuid
}

utils.toProductDetail = function (productId) {
  router.push({ path: `/product-detail/${productId}` })
}

utils.toDocDetail = function (orderNo) {
  const prefix = orderNo.substr(0, 2)
  let path = ''
  switch (prefix) {
    case 'XH':
      path = 'spot-order'
      break
    case 'QP':
      path = 'force-order'
      break
    case 'QH':
      path = 'future-order'
      break
    case 'YS':
      path = 'pre-sale-order'
      break
    case 'TH':
      path = 'returns'
      break
    case 'RK':
      path = 'in-storage'
      break
    case 'CK':
      path = 'out-storage'
      break
    case 'CG':
      path = 'purchase'
      break
    case 'DB':
      path = 'stock-transfer'
      break
    case 'CT':
      path = 'purchase-return'
      break
    case 'PD':
      path = 'inventory-check'
      break
    case 'BH':
      path = 'replenishment'
      break
  }

  router.push({ path: `/${path}-detail/${orderNo}` })
}

export default utils
