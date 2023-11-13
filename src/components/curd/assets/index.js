import search from './../search/index'
import page from '@/utils/page'
import curd from '@/utils/curd'
import util from '../../../utils'
//see https://github.com/SortableJS/Vue.Draggable
import draggable from 'vuedraggable'
import { getCache, setCache } from '@/utils/cache'
import relation from '../../../utils/relation'
import { cloneDeep } from 'lodash'
import { renderSummary, renderCommon } from '../../../utils/render.jsx'

let resetSearchPlan = {
  id: 0,
  name: __('恢复默认列配置'),
}

export default {
  name: 'CurdIndex',
  components: {
    search,
    draggable,
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
    selectionRadio: {
      type: Object,
      default: {
        radio: false,
      },
    },
    searchColumn: {
      type: Array,
      default: [],
    },
    searchPlanSourceType: {
      type: Number,
      default: 0,
    },
    enabledSearchColumn: {
      type: Boolean,
      default: true,
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
    importPageLink: {
      type: String,
      default: '',
    },
    addLink: {
      type: String,
      default: '',
    },
    isDetailPage: {
      type: Boolean,
      default: false,
    },
    showSummary: {
      type: Boolean,
      default: false,
    },
    detailPageTitle: {
      type: String,
      default: __('商品明细'),
    },
    leftLinks: {
      type: Array,
      default: [],
    },
    leftTabMenus: {
      type: Array,
      default: [],
    },
    tree: {
      type: Object,
      default: {},
    },
    actions: {
      type: Array,
      default: [],
    },
    batchActions: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      columns: [],
      default_columns: {},
      columns_styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static',
      },
      searchPlanModelForColumn: false,
      searchPlanNameForColumn: '',
      searchPlanIdForColumn: '',
      currentSearchPlan: resetSearchPlan,
      loadingTable: false,
      treeOption: {},
      searchTableHeight: 0,
    }
  },
  methods: {
    initColumns(columns) {
      if (this.enabledSearchColumn) {
        this.default_columns = this.parseColumnData(columns, true)
        let cacheKey = this.searchColumnCurrentCacheKey()
        let searchColumn = getCache(cacheKey)
        if (null !== searchColumn) {
          this.initCurrentSearchColumn(searchColumn, columns)
        }
      }

      // 通用渲染
      renderCommon(columns)

      // 对话框需要删除操作
      // 对话框单选
      if (this.minDialog.minDialog || this.selectionRadio.radio) {
        this.initRemoveSelectedColumns(columns)
      }

      // 对话框单选
      if (this.selectionRadio.radio) {
        this.initSelectedRadioColumns(columns)
      }

      this.columns = columns
      this.$refs.search.initColumns(columns)
      this.init()
    },
    initRemoveSelectedColumns(columns) {
      let newColumns = []
      columns.forEach((column, index) => {
        if (
          Object.prototype.hasOwnProperty.call(column, 'key') &&
          column.key == 'framework_action' &&
          this.minDialog.minDialog
        ) {
          return
        }

        if (
          Object.prototype.hasOwnProperty.call(column, 'type') &&
          column.type == 'selection' &&
          this.selectionRadio.radio
        ) {
          columns[index] = {
            title: '',
            width: 55,
            key: 'framework_selection',
            align: 'center',
            className: 'table-selection-radio',
            fixed: 'left',
            render: (h, params) => {
              return (
                <div>
                  <RadioGroup v-model={this.selectedRadio}>
                    <Radio label={params.row.id}>&nbsp;</Radio>
                  </RadioGroup>
                </div>
              )
            },
          }
        }

        newColumns.push(column)
      })

      columns = newColumns
    },
    initSelectedRadioColumns(columns) {
      columns.forEach((column, index) => {
        if (
          Object.prototype.hasOwnProperty.call(column, 'type') &&
          column.type == 'selection'
        ) {
          columns[index] = {
            title: '',
            width: 55,
            key: 'framework_selection',
            align: 'center',
            className: 'table-selection-radio',
            fixed: 'left',
            render: (h, params) => {
              return (
                <div>
                  <RadioGroup v-model={this.selectedRadio}>
                    <Radio label={params.row.id}>&nbsp;</Radio>
                  </RadioGroup>
                </div>
              )
            },
          }

          return
        }
      })
    },
    handleSummary({ columns, data }) {
      return renderSummary(columns, data)
    },
    getSearchPlan(callback, immediately) {
      if (!this.enabledSearchColumn) {
        return
      }

      let cacheKey = 'searchColumn' + this.searchPlanSourceType
      if (!immediately) {
        let cacheData = getCache(cacheKey)
        if (null !== cacheData) {
          this.searchPlanData = cacheData
          if (callback) {
            callback()
          }
          return
        }
      }

      setTimeout(
        () => {
          this.apiGet('search_plan/list-only', {
            type: 2,
            source_type: this.searchPlanSourceType,
            column: 'id,name,plan',
          }).then((res) => {
            this.searchPlanData = res.data
            this.searchPlanData.unshift(resetSearchPlan)
            if (callback) {
              callback()
            }

            setCache(cacheKey, this.searchPlanData, 86400 * 30)
          })
        },
        immediately ? 0 : 3000,
      )
    },
    columnLeft(column) {
      column.fixed = 'left'
    },
    columnRight(column) {
      column.fixed = 'right'
    },
    columnNotFixed(column) {
      if (Object.prototype.hasOwnProperty.call(column, 'fixed')) {
        delete column.fixed
      }
    },
    saveSearchPlanForColumn() {
      this.searchPlanModelForColumn = true
    },
    confirmSaveColumnTemp() {
      let data = this.parseColumnData(null, true)
      let cacheKey = this.searchColumnCurrentCacheKey()
      setCache(cacheKey, data)

      util.success(__('保存成功'))

      this.column_set = false
    },
    parseColumnData(columns, init_priority) {
      if (!columns) {
        columns = this.columns
      }

      let data = {}
      let priority = 0
      columns.forEach((item) => {
        let obj = {}
        if (Object.prototype.hasOwnProperty.call(item, 'priority')) {
          obj.priority = item.priority
        }
        if (init_priority) {
          obj.priority = priority
        }
        if (item.show === false) {
          obj.show = false
        } else {
          obj.show = true
        }
        if (Object.prototype.hasOwnProperty.call(item, 'width')) {
          obj.width = item.width
        }
        if (Object.prototype.hasOwnProperty.call(item, 'fixed')) {
          obj.fixed = item.fixed
        }
        data[item.key] = obj
        priority++
      })

      return data
    },
    confirmSaveColumn() {
      let data = this.parseColumnData()
      let cacheKey = this.searchColumnCurrentCacheKey()
      setCache(cacheKey, data)

      if (!this.searchPlanNameForColumn) {
        this.searchPlanNameForColumn = 'no title'
      }

      if (this.searchPlanIdForColumn) {
        this.apiPut('search_plan', this.searchPlanIdForColumn, {
          name: this.searchPlanNameForColumn,
          plan: JSON.stringify(data),
          source_type: this.searchPlanSourceType,
        }).then((res) => {
          let searchPlanIdForColumnTemp = this.searchPlanIdForColumn
          this.currentSearchPlan.name = this.searchPlanNameForColumn
          this.searchPlanIdForColumn = ''
          this.searchPlanNameForColumn = ''
          this.getSearchPlan(() => {
            this.initSearchPlan(searchPlanIdForColumnTemp)
          }, true)
        })
      } else {
        this.apiPost('search_plan', {
          type: 2,
          name: this.searchPlanNameForColumn,
          plan: JSON.stringify(data),
          source_type: this.searchPlanSourceType,
        }).then((res) => {
          this.searchPlanName = ''
          this.getSearchPlan(() => {
            this.initSearchPlan(res.id)
          }, true)
        })
      }
    },
    searchPlanClick(id) {
      if (id == 'save') {
        this.searchPlanModelForColumn = true
        this.searchPlanNameForColumn = ''
        this.searchPlanIdForColumn = ''
        return
      }

      if (id == 'update') {
        let searchPlanId = null
        if (this.currentSearchPlan.id) {
          searchPlanId = this.currentSearchPlan.id
        } else {
          util.error(__('未选中当前的列配置，请先选择后保存'))
          return
        }
        this.searchPlanModelForColumn = true
        this.searchPlanNameForColumn = this.currentSearchPlan.name
        this.searchPlanIdForColumn = searchPlanId
        return
      }

      if (id == 'delete') {
        this.$Modal.confirm({
          content: __('确认删除该列配置?'),
          onOk: () => {
            this.apiDelete('search_plan', this.currentSearchPlan.id).then(
              (res) => {
                this.getSearchPlan(() => {
                  this.initSearchPlan(0)
                }, true)
              },
            )
          },
        })
        return
      }

      this.initSearchPlan(id)
    },
    searchColumnCurrentCacheKey() {
      return 'searchColumnCurrent' + this.searchPlanSourceType
    },
    initSearchPlan(id) {
      let plan = this.searchPlanData.find((item) => {
        return item.id == id
      })

      if (id && !plan) {
        util.error(__('未找到列配置'))
        return
      }

      this.currentSearchPlan = plan
      let cacheKey = this.searchColumnCurrentCacheKey()

      if (!id) {
        this.initCurrentSearchColumn(this.default_columns)
        setCache(cacheKey, this.parseColumnData())
        util.success(__('已恢复默认列配置'))
        return
      }

      let searchForm = JSON.parse(plan.plan)
      this.initCurrentSearchColumn(searchForm)

      setCache(cacheKey, this.parseColumnData())

      util.success(__('切换列配置成功'))
    },
    initCurrentSearchColumn(searchForm, columns) {
      if (!columns) {
        columns = this.columns
      }
      columns.forEach((item) => {
        if (Object.prototype.hasOwnProperty.call(searchForm, item.key)) {
          if (Object.prototype.hasOwnProperty.call(item, 'fixed')) {
            delete item.fixed
          }
          if (Object.prototype.hasOwnProperty.call(item, 'priority')) {
            delete item.priority
          }
          Object.assign(item, searchForm[item.key])
        }
      })
      util.objArraySort(columns, 'priority')
    },
    init: function () {
      this.searchList()
    },
    searchExtend(res) {
      this.$emit('searchExtend', res)
    },
    async handleLoadData(item, callback) {
      if (!this.treeOption.tree) {
        return
      }

      // 合并参数
      const params = cloneDeep(this.searchApiParams)
      params[this.treeOption.parent_key] = item.id

      let treeApi = this.searchApi
      if (-1 === treeApi.indexOf('/list-only')) {
        treeApi += '/list-only'
      }

      const tableData = await relation(
        {
          api: treeApi,
          params,
        },
        this.searchApiExtend,
        this.$refs.search.searchTemplate(),
        [],
        true,
        true,
      )

      if (tableData.data && tableData.data.length > 0) {
        // tree
        tableData.data.forEach((item) => {
          if (item[`children.${this.treeOption.parent_key}`]) {
            item.children = []
            item._loading = false
          }
        })
        callback(tableData.data)
      } else {
        delete item.children
        delete item._loading
      }
    },
    prepareNewSearchFormCustomer(newSearchForm) {
      this.$emit('prepareNewSearchFormCustomer', newSearchForm)
    },
    searchExtendCallback(res, resSub) {
      this.$emit('searchExtendCallback', res, resSub)
    },
    searchBaseExtend(page, pageSize, searchForm) {
      this.$emit('searchBaseExtend', page, pageSize, searchForm)
    },
    leftLinkAccess(leftLink) {
      this.$router.push({
        path: leftLink.link,
      })
    },
    exportData(type) {
      if (type === 1) {
        this.$refs.table.exportCsv({
          filename: __('导出当前页数据'),
        })
      } else if (type === 2) {
        this.$refs.table.exportCsv({
          filename: __('导出筛选数据'),
          original: false,
        })
      }
    },
    prepareLeftLinks() {
      this.leftLinks.forEach((item) => {
        if (item.type == 'create') {
          if (!item.icon) {
            item.icon = 'md-add'
          }
          if (!item.name) {
            item.name = __('新增')
          }
          if (!item.button) {
            item.button = 'primary'
          }
        }

        if (item.type == 'import') {
          if (!item.icon) {
            item.icon = 'md-cloud-upload'
          }
          if (!item.name) {
            item.name = __('导入')
          }
          if (!item.button) {
            item.button = 'default'
          }
        }

        if (item.type == 'export') {
          if (!item.icon) {
            item.icon = 'md-cloud-download'
          }
          if (!item.name) {
            item.name = __('导出')
          }
          if (!item.button) {
            item.button = 'default'
          }
        }
      })
    },
    prepareActions() {
      this.actions.forEach((item) => {
        if (!Object.prototype.hasOwnProperty.call(item, 'show')) {
          show: true
        }

        if (item.type == 'create') {
          if (!item.icon) {
            item.icon = 'md-add'
          }
          if (!item.name) {
            item.name = __('新增')
          }
        }

        if (item.type == 'edit') {
          if (!item.icon) {
            item.icon = 'md-create'
          }
          if (!item.name) {
            item.name = __('编辑')
          }
        }

        if (item.type == 'delete') {
          if (!item.icon) {
            item.icon = 'md-trash'
          }
          if (!item.name) {
            item.name = __('删除')
          }
        }

        if (item.type == 'detail') {
          if (!item.icon) {
            item.icon = 'md-eye'
          }
          if (!item.name) {
            item.name = __('查看')
          }
        }
      })
    },
    prepareTreeOption() {
      const defaultOption = {
        tree: false,
        parent_key: 'parent_id',
        row_key: 'id',
      }
      Object.assign(defaultOption, this.tree)
      this.treeOption = defaultOption
    },
    toggleShow() {
      this.computeSearchTableHeight()
    },
    computeSearchTableHeight() {
      if (!this.minDialog.minDialog) {
        return
      }
      const screenHeight = document.documentElement.clientHeight
      // var searchWrapHeight = document.querySelector(
      //   '.ivu-modal-half-fullscreen .search-wrap',
      // ).clientHeight
      // 搜索项固定高度
      let searchWrapHeight = 55
      this.searchTableHeight = screenHeight - searchWrapHeight - 115
    },
    searchPlanChange() {
      this.$nextTick(() => {
        this.computeSearchTableHeight()
      })
    },
    toLeftTabMenu(name) {
      this.$router.push({ name })
    },
  },
  computed: {
    actionsShow() {
      return this.actions.filter((item) => {
        return item.show !== false
      })
    },
    batchActionsShow() {
      return this.batchActions.filter((item) => {
        return utils.permission(item.permission)
      })
    },
    columnsShow() {
      return this.columns.filter((item) => {
        if (!Object.prototype.hasOwnProperty.call(item, 'show')) {
          item.show = true
        }
        if (!Object.prototype.hasOwnProperty.call(item, 'resizable')) {
          item.resizable = true
        }
        if (!Object.prototype.hasOwnProperty.call(item, 'width')) {
          item.width = 1
        }
        return item.show !== false
      })
    },
  },
  mounted: function () {
    if (this.enabledSearchColumn) {
      this.getSearchPlan()
    }
  },
  beforeMount: function () {
    this.prepareLeftLinks()
    this.prepareTreeOption()
    this.prepareActions()
  },
  mixins: [page, curd],
}
