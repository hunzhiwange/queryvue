<template>
  <Tree
    :data="list"
    :multiple="this.isMultiple"
    :show-checkbox="this.isMultiple"
    check-strictly
    @on-check-change="updateData"
    @on-select-change="updateSelectData"
  />
</template>

<script>
import CryptoJS from 'crypto-js'
import { getCache, setCache } from '@/utils/cache'
import utils from '../../utils'

export default {
  name: 'SearchTree',
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
        parent_key: '',
      },
    },
  },
  data() {
    return {
      list: [],
      valueSelected: [],
    }
  },
  methods: {
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
          this.afterInit()
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
          this.afterInit()

          if (Object.prototype.hasOwnProperty.call(this.apiSource, 'expire')) {
            setCache(cacheKey, res, this.apiSource.expire)
          }
        }, 2000)
      })
    },
    updateData(allCheckedNodes) {
      const checkedNodes = []
      allCheckedNodes.forEach((item) => {
        checkedNodes.push(item.value)
      })

      this.$emit('updateData', checkedNodes, this.currentField)
    },
    updateSelectData(allCheckedNodes) {
      if (this.isMultiple) {
        return
      }

      this.updateData(allCheckedNodes)
    },
    travelTree(data) {
      data.forEach((item) => {
        if (this.valueSelected.includes(item.value)) {
          item.checked = true
        } else {
          item.checked = false
        }

        if (item.children) {
          this.travelTree(item.children)
        }
      })
    },
    prepareValueSelected() {
      let { currentValue } = this

      if (currentValue && typeof currentValue !== 'string') {
        currentValue += ''
      }

      currentValue = currentValue ? currentValue.split(',') : []
      return currentValue
    },
    afterInit() {
      this.valueSelected = this.prepareValueSelected()
      this.travelTree(this.list)
    },
  },
  watch: {
    currentValue(newVal, oldVal) {
      this.afterInit()
    },
  },
  mounted() {
    this.init()
  },
}
</script>
