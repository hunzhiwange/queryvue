import search from '@/utils/search'
import SearchSelect from '../../../../components/search/select'
import SearchDialog from '../../../search/dialog'
import Datetime from '../../../../components/datetime/index'
import SearchTreeSelect from '../../../search/tree-select'

export default {
  components: {
    SearchSelect,
    SearchDialog,
    SearchTreeSelect,
    Datetime,
  },
  props: {
    minDialog: {
      type: Object,
      default: {
        minDialog: false,
      },
    },
    mustColumn: {
      type: String,
      default: '',
    },
    searchColumn: {
      type: Array,
      default: [],
    },
    searchPlanSourceType: {
      type: Number,
      default: 0,
    },
    enabledSearchPlan: {
      type: Boolean,
      default: true,
    },
    searchApi: {
      type: String,
      default: '',
    },
    searchApiParams: {
      type: Object,
      default: {},
    },
    searchApiExtend: {
      type: Object,
      default: {},
    },
    searchPrimaryKey: {
      type: Array,
      default: ['id'],
    },
    isDetailPage: {
      type: Boolean,
      default: false,
    },
    treeOption: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      resetForm: {},
      columns: [],
    }
  },
  computed: {
    sliceConfigItem() {
      if (this.isDetailPage) {
        return []
      }

      let index = 0
      let arrTemp = []
      let searchConfigWidth = 0
      this.searchColumn.forEach((item) => {
        if (!Object.prototype.hasOwnProperty.call(item, 'type')) {
          return
        }

        if (!Object.prototype.hasOwnProperty.call(item, 'width')) {
          item.width = 1
        }

        // 搜索条件的select默认可清空
        if (item.type == 'select') {
          if (!item.meta) {
            item.meta = {
              clearable: true,
            }
          } else if (
            !Object.prototype.hasOwnProperty.call(item.meta, 'clearable')
          ) {
            item.meta.clearable = true
          }
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

        if (!Object.prototype.hasOwnProperty.call(item, 'nameExtend')) {
          item.nameExtend = ''
        }

        if (item.search && !item.initSearchName) {
          item.initSearchName = true

          if (item.search === 'min') {
            item.nameExtend = __('最小值')
          }

          if (item.search === 'max') {
            item.nameExtend = __('最大值')
          }
        }

        searchConfigWidth += item.width
        index = Math.ceil(searchConfigWidth / 4) - 1
        if (arrTemp.length <= index) {
          arrTemp[index] = {}
        }
        arrTemp[index][item.key] = item
      })
      return arrTemp
    },
  },
  methods: {
    initColumns(columns) {
      this.columns = columns
      this.$nextTick(() => {
        this.initBase()
        if (Object.keys(this.$route.query).length <= 0) {
          Object.assign(this.searchForm, this.getDefaultValue())
        }
      })
    },
    getDefaultValue() {
      let defaultValue = {}
      this.searchColumn.forEach((item) => {
        if (Object.prototype.hasOwnProperty.call(item, 'default_value')) {
          defaultValue[item.key] = item['default_value']
        }
      })

      return defaultValue
    },
    initResetForm() {
      let resetForm = {
        page: 1,
        page_size: 30,
      }

      this.searchColumn.forEach((item) => {
        resetForm[item.key] = ''
      })

      this.resetForm = resetForm
    },
    updateCommonDate(res, field) {
      this.searchForm[field] = res
    },
    updateArrayJsonData(res, field) {
      this.searchForm[field] = res.join(',')
    },
    updateCreateAt(res, field) {
      this.searchForm[field] = res[0]
      this.searchForm[field.substring(0, field.lastIndexOf('_min')) + '_max'] =
        res[1]
    },
    initBase() {
      this.initResetForm()
      this.resetData()
    },
    searchTypeName(searchType, fieldType) {
      if (fieldType === 'input_search') {
        return __('模糊')
      }

      if (fieldType === 'datetime') {
        return __('范围')
      }

      switch (searchType) {
        case 'like':
          return __('模糊')
        case 'min':
          return __('最小值')
        case 'max':
          return __('最大值')
        case 'in':
        case 'in_end':
          return __('包含')
        default:
          return __('等于')
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit('toggleShow')
    })
  },
  mixins: [search],
}
