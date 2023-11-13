<template>
  <Switch
    v-model="currentValueSelected"
    size="large"
    :true-value="list[0] ? list[0][apiSource.key] : ''"
    :false-value="list[1] ? list[1][apiSource.key] : ''"
    @on-change="updateData"
  >
    <template #open>
      <span>{{ list[0] ? list[0][apiSource.value] : '' }}</span>
    </template>
    <template #close>
      <span>{{ list[1] ? list[1][apiSource.value] : '' }}</span>
    </template>
  </Switch>
</template>

<script>
import CryptoJS from 'crypto-js'
import { getCache, setCache } from '@/utils/cache'

export default {
  name: 'SearchSwitch',
  props: {
    currentField: {
      type: String,
    },
    currentValue: {},
    placeholder: {
      type: String,
      default: __('请选择项目'),
    },
    apiSource: {
      type: Object,
      default: {
        url: '',
        params: {},
        key: '',
        value: '',
      },
    },
  },
  data() {
    return {
      list: [],
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
      this.$emit('updateData', res, this.currentField)
    },
    prepareValueSelected() {
      let { currentValue } = this
      // 强制转字符串
      currentValue += ''
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
