<template>
  <TreeSelect
    v-model="currentValueSelected"
    :data="list"
    :multiple="this.isMultiple"
    :show-checkbox="this.isMultiple"
    @on-change="updateData"
    :class="displayOnly ? 'i-curd-select-display-only' : ''"
    :transfer="true"
    :max-tag-count="apiSource.maxTagCount ? apiSource.maxTagCount : 999999"
    :max-tag-placeholder="maxTagPlaceholder"
    :placeholder="placeholder"
  />
</template>

<script>
import CryptoJS from 'crypto-js'
import { getCache, setCache } from '@/utils/cache'
import utils from '../../utils'

export default {
  name: 'SearchTreeSelect',
  props: {
    currentField: {
      type: String,
    },
    currentValue: {},
    placeholder: {
      type: String,
      default: __('请选择'),
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
        parent_key: '',
        type: '',
        maxTagCount: 99999,
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
    maxTagPlaceholder(num) {
      return `+${num}`
    },
    init() {
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
        this.apiSource.params.column = `${this.apiSource.key},${this.apiSource.value},${this.apiSource.parent_key}`

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

          res = utils.buildTree(res, 0)
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
        this.updateData(currentValue)
        return currentValue
      }

      if (currentValue && typeof currentValue !== 'string') {
        currentValue += ''
      }

      currentValue = currentValue ? currentValue.split(',') : []
      return currentValue
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
