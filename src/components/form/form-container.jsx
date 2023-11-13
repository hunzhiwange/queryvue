import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'
import SearchSelect from '../search/select'
import SearchSwitch from '../search/switch'
import SearchTreeSelect from '../search/tree-select'
import SearchTree from '../search/tree'
import SearchDialog from '../search/dialog'
import SearchCity from '../search/city'
import SearchComponent from '../search/component'
import SearchMarkdown from '../search/markdown'
import SearchUploadImage from '../search/upload-image'
import Datetime from '../datetime'
import utils from '../../utils'
import validateForm from '../../utils/validate-form'

const defaultOptions = {
  form: {
    // 行内表单模式
    inline: false,
    // 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width
    labelPosition: 'top',
    // 表单域标签的后缀
    labelSuffix: undefined,
    // 是否显示必填字段的标签旁边的红色星号
    hideRequiredAsterisk: false,
    // 表单域标签的宽度，例如 '50'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto。
    labelWidth: 'auto',
    // 是否显示校验错误信息
    showMessage: true,
    // 是否以行内形式展示校验信息
    inlineMessage: false,
    // 是否在输入框中显示校验结果反馈图标
    statusIcon: false,
    // 是否在 rules 属性改变后立即触发一次验证
    validateOnRuleChange: true,
    // 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效
    disabled: false,
    // 用于控制该表单内组件的尺寸 medium / small / mini
    size: undefined,
    // 是否显示 label
    title: true,
    // 是否仅仅展示而不可编辑，可用来做信息展示
    displayOnly: false,
  },
  row: {
    // 栅格间隔
    gutter: 0,
    // 布局模式，可选 flex，现代浏览器下有效
    type: undefined,
    // flex 布局下的垂直排列方式 top/middle/bottom
    align: undefined,
    // flex 布局下的水平排列方式 start/end/center/space-around/space-between
    justify: undefined,
    // 自定义元素标签
    tag: 'div',
  },
  submitBtn: {
    // 类型 primary / success / warning / danger / info / text
    type: 'primary',
    // 尺寸 medium / small / mini
    size: 'medium',
    // 是否朴素按钮
    plain: false,
    // 是否圆角按钮
    round: false,
    // 是否圆形按钮
    circle: false,
    // 是否加载中状态
    loading: false,
    // 是否禁用状态
    disabled: false,
    // 图标类名
    icon: 'el-icon-upload',
    // 按钮宽度
    width: '100%',
    // 是否默认聚焦
    autofocus: false,
    // 原生 type 属性
    nativeType: 'button',
    // 按钮内容
    innerText: '提交',
    // 按钮是否显示
    show: true,
    // 按钮布局规则
    col: undefined,
    // 按钮点击事件
    click: undefined,
  },
  resetBtn: {
    type: 'default',
    size: 'medium',
    plain: false,
    round: false,
    circle: false,
    loading: false,
    disabled: false,
    icon: 'el-icon-refresh',
    width: '100%',
    autofocus: false,
    nativeType: 'button',
    innerText: '重置',
    show: false,
    col: undefined,
    click: undefined,
  },
  info: {
    // 提示消息类型,popover,tooltip
    type: 'popover',
  },
  wrap: {},
}

export default defineComponent({
  components: {
    SearchSelect,
    SearchSwitch,
    SearchTreeSelect,
    SearchTree,
    Datetime,
    SearchDialog,
    SearchCity,
    SearchComponent,
    SearchMarkdown,
    SearchUploadImage,
  },
  name: 'FormContainer',
  props: {
    pageType: {
      type: String,
      default: '',
    },
    menuLeft: {
      type: Array,
      default: [],
    },
    menuRight: {
      type: Array,
      default: [],
    },
    layoutData: {
      type: Array,
      default: [
        {
          span: 24,
          minWith: 1100,
          subgroups: [
            {
              span: 24,
              id: 'default',
              tag: 'card',
            },
          ],
        },
      ],
      required: true,
    },
    formOptions: {
      type: Object,
      default: {},
    },
    columns: {
      type: Array,
      default: [],
      required: true,
    },
    formData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      actionLoading: false,
      currentOptions: {},
      currentRules: {},
      currentColumns: [],
      keepResetFields: [],
      formDefaultData: {},
      componentKey: '',
    }
  },
  methods: {
    colLayoutStyle(item) {
      return Object.prototype.hasOwnProperty.call(item, 'flex')
        ? 'overflow: hidden;'
        : ''
    },
    colLayoutValue(item) {
      return Object.prototype.hasOwnProperty.call(item, 'flex')
        ? item.flex
        : item.span
    },
    colLayoutProp(item) {
      return Object.prototype.hasOwnProperty.call(item, 'flex')
        ? 'flex'
        : 'span'
    },
    updateCommonDate(res, field) {
      this.formData[field] = res
    },
    updateArrayJsonData(res, field) {
      this.formData[field] = res.join(',')
    },
    updateCityData(res, field) {
      this.formData[field] = res[res.length - 1]
    },
    updateCreateAt(res, field) {
      this.formData[field] = res[0]
      this.formData[`${field.substring(0, field.lastIndexOf('_min'))}_max`] =
        res[1]
    },
    handleSubmit(toList = false) {
      const name = 'formData'
      this.actionLoading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit('handleSubmit', this.formData, toList)
          this.actionLoading = false
        } else {
          this.$Message.error(__('数据验证失败，请修改数据后重新提交。'))
          this.actionLoading = false
        }
      })
    },
    handleReset() {
      const remainData = {}
      this.keepResetFields.forEach((fieldName) => {
        if (Object.prototype.hasOwnProperty.call(this.formData, fieldName)) {
          remainData[fieldName] = this.formData[fieldName]
        }
      })
      // 重置表单为 undefined
      this.$refs.formData.resetFields()
      // 赋值默认值
      Object.assign(this.formData, this.formDefaultData)
      // 恢复保留字段
      Object.assign(this.formData, remainData)
      // 自动刷新自定义组件
      this.componentKey = Math.random()
      this.$emit('handleReset')
    },
    prepareDefault() {
      let specialType = ['checkbox', 'checkbox_border', 'component', 'markdown']

      if (this.currentOptions.form.displayOnly) {
        specialType = ['checkbox_border', 'component', 'markdown']
      }

      const newColumns = cloneDeep(this.columns)
      newColumns.forEach((item) => {
        if (!item.key) {
          return
        }

        if (
          Object.prototype.hasOwnProperty.call(item, 'keep_reset_fields') &&
          item.keep_reset_fields === true
        ) {
          this.keepResetFields.push(item.key)
        }

        item.labelShow = true
        if (
          !Object.prototype.hasOwnProperty.call(item, 'displayOnly') &&
          this.currentOptions.form.displayOnly
        ) {
          item.displayOnly = true
        }

        if (item.meta && item.meta.data_type === 'yes_no') {
          item.meta.data = [
            {
              name: 'YES',
              value: '1',
              msg: __('是'),
            },
            {
              name: 'NO',
              value: '0',
              msg: __('否'),
            },
          ]
          item.meta.key = 'value'
          item.meta.value = 'msg'
        }

        // 默认值
        if (Object.prototype.hasOwnProperty.call(item, 'default_value')) {
          this.formData[item.key] = item.default_value
          this.formDefaultData[item.key] = item.default_value
        } else if (item.type == 'input_number') {
          this.formData[item.key] = ''
          this.formDefaultData[item.key] = ''
        }

        if (
          specialType.includes(item.type) &&
          !Object.prototype.hasOwnProperty.call(item, 'labelWidth')
        ) {
          item.labelWidth = 0
          item.labelShow = false
        }

        if (item.labelWidth === 0) {
          item.labelShow = false
        }

        if (
          item.displayOnly &&
          Object.prototype.hasOwnProperty.call(this.currentRules, item.key)
        ) {
          delete this.currentRules[item.key]
        }

        this.currentColumns.push(item)
      })
    },
  },
  beforeMount() {
    // 合并当前配置
    utils.deepMerge(defaultOptions, this.formOptions)
    this.currentOptions = defaultOptions

    // 合并消息
    if (!this.currentOptions.form.displayOnly) {
      this.currentRules = validateForm(this.columns)
    }

    // 默认值
    this.prepareDefault()
  },
})
