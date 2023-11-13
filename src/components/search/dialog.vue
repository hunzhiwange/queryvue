<template>
  <Modal
    v-model="modal"
    fullscreen
    :title="placeholder"
    class="ivu-modal-half-fullscreen i-layout-content"
    @on-ok="submitDialog"
    @on-cancel="cancelDialog"
    v-if="showModal"
  >
    <component
      ref="dialog"
      :is="currentComponent"
      :minDialog="minDialog"
      :mustColumn="apiSource.mustColumn"
      :selectionRadio="{ radio: !isMultiple }"
    />
  </Modal>
  <Row :wrap="false" class="i-curd-dialog">
    <Col flex="auto">
      <Select
        v-model="valueSelected"
        :multiple="isMultiple"
        @on-change="changeSelect"
        :transfer="true"
        :loading="searchLoading"
        :filterable="!displayOnly"
        @on-query-change="searchData"
        @mouseenter="handleMouseEnterSelect()"
        @on-clear="clearRadioSelected"
        :placeholder="placeholder"
        :clearable="!displayOnly"
        :class="displayOnly ? 'i-curd-select-display-only' : ''"
        :max-tag-count="apiSource.maxTagCount"
        :max-tag-placeholder="maxTagPlaceholder"
      >
        <Option
          v-for="item in list"
          :value="item[apiSource.key]"
          :key="item[apiSource.key]"
          :disabled="displayOnly || !!item.disabled"
          :label="item[apiSource.value]"
        >
          <dialog-expand
            :data="item"
            :render="apiSource.render"
            :apiSource="apiSource"
          ></dialog-expand>
        </Option>
      </Select>
    </Col>
    <Col flex="none" v-if="!displayOnly">
      <Button icon="md-more" type="text" @click="openDialog"></Button>
    </Col>
  </Row>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { cloneDeep, isArray, isString } from 'lodash'
import relation from '@/utils/relation'
import DialogExpand from './dialog-expand'

export default {
  name: 'SearchDialog',
  components: { DialogExpand },
  props: {
    currentField: {
      type: String,
    },
    currentValue: {
      default: null,
    },
    placeholder: {
      type: String,
      default: __('请选择项目'),
    },
    isMultiple: {
      type: Boolean,
      default: true,
    },
    cachedList: {
      type: Array,
      default: null,
    },
    apiSource: {
      type: Object,
      default: {
        component: '',
        key: 'id',
        value: 'name',
        mustColumn: '',
        render: null,
        radioDefaultValue: null,
        radioDefaultName: '',
        radioClearResetToDefault: false,
        maxTagCount: 99999,
      },
    },
    shouldUpdateDataAll: {
      type: Boolean,
      default: false,
    },
    displayOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showModal: false,
      list: [],
      valueSelected: [],
      modal: false,
      currentComponent: null,
      minDialog: {
        minDialog: true,
        title: '',
      },
      singleSelectData: false,
      initSearch: false,
      searchLoading: false,
      initSearchData: false,
    }
  },
  methods: {
    handleMouseEnterSelect(currentValue = []) {
      if (this.initSearchData) {
        return
      }

      this.searchData('', currentValue)
    },
    clearRadioSelected() {
      if (
        this.apiSource.radioClearResetToDefault
        && this.apiSource.radioClearResetToDefault === true
      ) {
        this.resetRadioSelected()
        return
      }

      this.valueSelected = []
      this.updateData(this.valueSelected)
    },
    resetRadioSelected() {
      this.addRadioDefaultValue()
      this.valueSelected = [this.getRadioDefaultValue()]
      this.updateData(this.valueSelected)
    },
    addRadioDefaultValue() {
      if (
        this.apiSource.radioDefaultValue !== null
        && this.apiSource.radioDefaultValue !== undefined
      ) {
        const index = this.list.findIndex(
          (listItem) => listItem[this.apiSource.key] === this.getRadioDefaultValue(),
        )
        if (index === -1) {
          this.list.unshift({
            [this.apiSource.key]: this.getRadioDefaultValue(),
            [this.apiSource.value]: this.apiSource.radioDefaultName
              ? this.apiSource.radioDefaultName
              : this.placeholder,
          })
        }
      }
    },
    getRadioDefaultValue() {
      return this.apiSource.radioDefaultValue.toString()
    },
    submitDialog() {
      window.removeEventListener('resize', this.handleWindowResize)

      let selectedFullData = []
      if (this.isMultiple) {
        selectedFullData = this.$refs.dialog.$refs.curdIndex.selectedFullData
      } else {
        selectedFullData = [
          this.$refs.dialog.$refs.curdIndex.getRadioSelected(),
        ]
      }

      if (this.shouldUpdateDataAll) {
        const currentList = []
        selectedFullData.forEach((item) => {
          currentList.push(item)
        })
        this.updateDataAll(currentList)
      } else {
        selectedFullData.forEach((item) => {
          if (this.isMultiple) {
            if (!this.valueSelected.includes(item[this.apiSource.key])) {
              this.valueSelected.push(item[this.apiSource.key])
            }
          } else {
            const selectedRadioData = this.$refs.dialog.$refs.curdIndex.getRadioSelected()
            this.valueSelected = [selectedRadioData[this.apiSource.key]]
          }

          const index = this.list.findIndex(
            (listItem) => listItem[this.apiSource.key] === item[this.apiSource.key],
          )
          if (index === -1) {
            this.list.push(item)
          }
        })
      }

      if (this.isMultiple) {
        this.$refs.dialog.$refs.curdIndex.clearSelectedData()
      } else {
        this.$refs.dialog.$refs.curdIndex.clearRadioSelectedData()
      }

      this.showModal = false

      if (!this.shouldUpdateDataAll) {
        this.updateData(this.valueSelected)
      }
    },
    cancelDialog() {
      this.showModal = false
      window.removeEventListener('resize', this.handleWindowResize)
    },
    openDialog() {
      this.showModal = true
      this.modal = true
      this.computeSearchTableHeight()
    },
    computeSearchTableHeight() {
      if (this.$refs.dialog && this.$refs.dialog.$refs) {
        const { curdIndex } = this.$refs.dialog.$refs
        curdIndex.computeSearchTableHeight()
        curdIndex.initValueSelected(this.valueSelected)
        window.addEventListener('resize', this.handleWindowResize)
      } else {
        setTimeout(() => {
          this.computeSearchTableHeight()
        }, 50)
      }
    },
    initDialog(successCallback) {
      this.showModal = true
      if (!(this.$refs.dialog && this.$refs.dialog.$refs)) {
        setTimeout(() => {
          this.initDialog(successCallback)
        }, 50)
      } else {
        successCallback()
      }
    },
    changeSelect(valueSelected) {
      if (this.shouldUpdateDataAll && this.singleSelectData) {
        const currentList = []
        this.list.forEach((item) => {
          if (valueSelected.includes(item[this.apiSource.key])) {
            currentList.push(item)
            this.valueSelected = []
            this.updateDataSingle(currentList, this.list)
          }
        })

        return
      }

      if (this.shouldUpdateDataAll) {
        return
      }

      if (!isArray(valueSelected)) {
        valueSelected = [valueSelected]
      }

      this.valueSelected = valueSelected
      this.updateData(this.valueSelected)
    },
    updateData(valueSelected) {
      this.$emit('updateData', valueSelected, this.currentField)
    },
    updateDataAll(currentList) {
      this.$emit('updateDataAll', currentList, this.currentField)
    },
    updateDataSingle(currentList, list) {
      this.$emit('updateDataSingle', [currentList, list], this.currentField)
    },
    prepareValueSelected() {
      let { currentValue } = this
      if (currentValue === null) {
        currentValue = ''
      }

      // 清除单选的默认模板
      if (currentValue === '' && !this.isMultiple) {
        this.clearRadioSelected()
      }

      if (!isArray(currentValue)) {
        if (!isString(currentValue)) {
          currentValue += ''
        }

        currentValue = currentValue ? currentValue.split(',') : []
      }

      if (!this.initSearch && currentValue.length > 0) {
        this.initDialogData(currentValue)
      }

      return currentValue
    },
    initDialogData(currentValue) {
      this.initDialog(() => {
        this.handleMouseEnterSelect(currentValue)
        this.valueSelected = currentValue
      })
    },
    handleWindowResize() {
      utils.once(() => {
        const { curdIndex } = this.$refs.dialog.$refs
        curdIndex.computeSearchTableHeight()
      }, 300)
    },
    searchData(query, currentValue = []) {
      if (
        currentValue.length === 0
        && query === ''
        && this.cachedList !== null
      ) {
        this.singleSelectData = true
        this.initSearchData = true
        this.list = this.cachedList
        return
      }

      utils.once(
        () => {
          this.initDialog(() => {
            this.singleSelectData = true
            this.searchLoading = true

            const { curdIndex } = this.$refs.dialog.$refs
            const searchColumn = `${this.apiSource.key},${
              this.apiSource.value
            }${
              this.apiSource.mustColumn ? `,${this.apiSource.mustColumn}` : ''
            }`
            const searchParams = {
              limit: this.$store.state.app.pageSize,
            }

            if (query) {
              searchParams.key = query
            } else if (
              currentValue.length > 0
              && currentValue.join(',') !== '0'
            ) {
              searchParams[`${this.apiSource.key}[in]`] = currentValue.join(',')
            }

            // 合并参数
            const params = cloneDeep(curdIndex.searchApiParams)
            Object.assign(params, searchParams)

            const tableData = relation(
              {
                api: `${curdIndex.searchApi}/list-only`,
                params,
              },
              curdIndex.searchApiExtend,
              searchColumn,
              [],
              true,
              true,
            )

            tableData.then((res) => {
              this.searchLoading = false
              this.initSearchData = true
              this.list = res.data
              this.addRadioDefaultValue()
            })
          })
        },
        query === '' ? 0 : 300,
      )
    },
    maxTagPlaceholder(num) {
      return `+${num}`
    },
  },
  watch: {
    currentValue() {
      this.prepareValueSelected()
    },
  },
  beforeMount() {
    this.currentComponent = defineAsyncComponent({
      loader: utils.importComponent(this.apiSource.component),
      delay: 0,
    })
  },
  mounted() {
    this.prepareValueSelected()
  },
}
</script>
