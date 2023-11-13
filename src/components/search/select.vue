<template>
  <Select
    v-model="currentValueSelected"
    :filterable="!isMultiple && apiSource.filterable === true && !displayOnly"
    :clearable="!isMultiple && apiSource.clearable === true && !displayOnly"
    :multiple="isMultiple"
    :placeholder="placeholder"
    @on-change="updateData"
    :max-tag-count="1"
    :max-tag-placeholder="maxTagPlaceholder"
    :class="displayOnly ? 'i-curd-select-display-only' : ''"
    :transfer="true"
  >
    <Option
      v-for="(option, index) in list"
      :value="option[apiSource.key]"
      :key="index"
      :disabled="displayOnly"
    >
      {{ option[apiSource.value] }}
    </Option>
  </Select>
</template>

<script>
import CryptoJS from 'crypto-js'
import { isArray } from 'lodash'
import { getCache, setCache } from '@/utils/cache'

export default {
  name: 'SearchSelect',
  props: {
    currentField: {
      type: String,
    },
    currentValue: {},
    placeholder: {
      type: String,
      default: __('请选择项目'),
    },
    isMultiple: {
      type: Boolean,
      default: true,
    },
    apiSource: {
      type: Object,
      default: {
        url: '',
        params: {},
        key: '',
        value: '',
        clearable: true,
        type: '',
        data_type: '',
        data: [],
      },
    },
    displayOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [],
    }
  },
  methods: {
    init() {
      if (this.apiSource.data && isArray(this.apiSource.data)) {
        this.list = this.apiSource.data
        return
      }

      if (!this.apiSource.url) {
        return
      }

      let cacheKey = null
      if (
        Object.prototype.hasOwnProperty.call(this.apiSource, 'expire')
        && this.apiSource.expire > 0
      ) {
        cacheKey = `searchField${this.apiSource.url}${CryptoJS.MD5(
          JSON.stringify(this.apiSource),
        ).toString()}`
        const cacheData = getCache(cacheKey)
        if (cacheData !== null) {
          this.list = cacheData
          return
        }
      }

      setTimeout(() => {
        if (!Object.prototype.hasOwnProperty.call(this.apiSource, 'params')) {
          this.apiSource.params = {}
        }
        this.apiSource.params.column = `${this.apiSource.key},${this.apiSource.value}`

        this.apiGet(this.apiSource.url, this.apiSource.params).then((res) => {
          if (res !== null && typeof res === 'object' && res.data) {
            res = res.data
          }

          // 强制转换成字符串类型，不然单选和多选无法选中
          if (res.length > 0) {
            const keys = Object.keys(res[0])
            res.forEach((item) => {
              keys.forEach((key) => {
                item[key] += ''
              })
            })
          }

          this.list = res
          if (Object.prototype.hasOwnProperty.call(this.apiSource, 'expire')) {
            setCache(cacheKey, res, this.apiSource.expire)
          }
        }, 2000)
      })
    },
    updateData(res) {
      if (!this.isMultiple) {
        if (this.apiSource.type === 'int') {
          res = res ? parseInt(res) : 0
        }
        res = [res]
      }

      this.$emit('updateData', res, this.currentField)
    },
    prepareValueSelected() {
      let { currentValue } = this

      if (!this.isMultiple) {
        if (currentValue == undefined) {
          currentValue = ''
        } else {
          // 强制转字符串
          currentValue += ''
        }
        return currentValue
      }

      if (currentValue && typeof currentValue !== 'string') {
        currentValue += ''
      }

      currentValue = currentValue ? currentValue.split(',') : []
      return currentValue
    },
    maxTagPlaceholder(num) {
      return `+${num}`
    },
  },
  computed: {
    currentValueSelected() {
      return this.prepareValueSelected()
    },
  },
  mounted() {
    this.init()
  },
}
</script>
