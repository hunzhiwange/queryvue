// 基于 async-validator 的表单验证
// https://github.com/yiminghe/async-validator

import { sprintf } from 'sprintf-js'

const typesMap = {
  string: '字符串',
  method: '方法',
  array: '数组',
  object: '对象',
  number: '数字',
  date: '日期',
  boolean: '布尔值',
  integer: '整数',
  float: '浮点数',
  regexp: '有效的正则表达式',
  email: '有效的电子邮件',
  url: '有效的URL',
  hex: '有效的十六进制',
}

const messages = {
  default: '字段 %s 的验证错误',
  required: '%s 不能为空',
  enum: '%s 必须是以下值之一：%s',
  whitespace: '%s 不能为空',
  date: {
    format: '%s 的日期 %s 格式无效，应为 %s',
    parse: '%s 的日期无法解析，%s 无效',
    invalid: '%s 的日期 %s 无效',
  },
  types: {
    string: '%s 不是一个 %s',
    method: '%s 不是一个 %s（函数）',
    array: '%s 不是一个 %s',
    object: '%s 不是一个 %s',
    number: '%s 不是一个 %s',
    date: '%s 不是一个 %s',
    boolean: '%s 不是一个 %s',
    integer: '%s 不是一个 %s',
    float: '%s 不是一个 %s',
    regexp: '%s 不是一个有效的 %s',
    email: '%s 不是一个有效的 %s',
    url: '%s 不是一个有效的 %s',
    hex: '%s 不是一个有效的 %s',
  },
  string: {
    len: '%s 必须是 %s 个字符',
    min: '%s 至少需要 %s 个字符',
    max: '%s 不能超过 %s 个字符',
    range: '%s 必须在 %s 到 %s 个字符之间',
  },
  number: {
    len: '%s 必须等于 %s',
    min: '%s 不能小于 %s',
    max: '%s 不能大于 %s',
    range: '%s 必须在 %s 到 %s 之间',
  },
  array: {
    len: '%s 的长度必须为 %s',
    min: '%s 的长度不能小于 %s',
    max: '%s 的长度不能大于 %s',
    range: '%s 的长度必须在 %s 到 %s 之间',
  },
  pattern: {
    // mismatch: '%s 的值 %s 不符合模式 %s'
    mismatch: '%s 的值%s不符合模式 %s',
  },
}

function validateForm(formData) {
  const validateRules = {}
  const rangeTypes = ['string', 'number', 'array']
  formData.forEach((formItem) => {
    if (!formItem.rules || !Array.isArray(formItem.rules)) {
      return
    }

    validateRules[formItem.key.replace('.', '_comma_')] = formItem.rules.map(
      (rule) => {
        const adaptedRule = { ...rule }
        const { required, type, pattern } = adaptedRule

        if (required) {
          adaptedRule.message = sprintf.apply(null, [
            messages.required,
            formItem.name,
          ])
        } else if (adaptedRule.enum) {
          adaptedRule.message = sprintf.apply(null, [
            messages.enum,
            formItem.name,
            adaptedRule.enum.join(','),
          ])
        }

        if (type && messages.types[type]) {
          adaptedRule.message = sprintf.apply(null, [
            messages.types[type],
            formItem.name,
            typesMap[type],
          ])

          if (rangeTypes.includes(type)) {
            if (adaptedRule.len) {
              adaptedRule.message = sprintf.apply(null, [
                messages[type].len,
                formItem.name,
                adaptedRule.len,
              ])
            } else if (adaptedRule.min && adaptedRule.max) {
              adaptedRule.message = sprintf.apply(null, [
                messages[type].range,
                formItem.name,
                adaptedRule.min,
                adaptedRule.max,
              ])
            } else if (adaptedRule.min) {
              adaptedRule.message = sprintf.apply(null, [
                messages[type].min,
                formItem.name,
                adaptedRule.min,
              ])
            } else if (adaptedRule.max) {
              adaptedRule.message = sprintf.apply(null, [
                messages[type].max,
                formItem.name,
                adaptedRule.max,
              ])
            }
          }
        }

        if (adaptedRule.whitespace && type == 'string') {
          adaptedRule.message = sprintf.apply(null, [
            messages.whitespace,
            formItem.name,
          ])
        }

        if (pattern) {
          adaptedRule.message = sprintf.apply(null, [
            messages.pattern.mismatch,
            formItem.name,
            '',
            pattern,
          ])
        }

        if (!adaptedRule.message) {
          adaptedRule.message = sprintf.apply(null, [
            messages.default,
            formItem.name,
          ])
        }

        return adaptedRule
      },
    )
  })

  return validateRules
}

export default validateForm
