import { cloneDeep } from 'lodash'
import util from './index'
import { getCache, setCache } from '@/utils/cache'
import relation from './relation'

const resetSearchPlan = {
  id: 0,
  name: __('常用筛选'),
}
const search = {
  data() {
    return {
      searchForm: {},
      searchShow: false,
      searchPlanData: [],
      currentSearchPlan: resetSearchPlan,
      searchPlanModel: false,
      searchPlanName: '',
      searchPlanId: '',
    }
  },
  methods: {
    initSearchPlan(id) {
      const plan = this.searchPlanData.find((item) => item.id === id)

      if (id && !plan) {
        util.error(__('未找到筛选条件'))
        return
      }

      const query = {}
      if (id) {
        query['search-plan'] = id
      }

      this.$router.replace({ query })
      this.currentSearchPlan = plan
      const searchForm = id ? JSON.parse(plan.plan) : {}
      this.resetData()

      this.search(0, 0, searchForm, true)
      this.$emit('searchPlanChange')
    },
    async search(
      page = 0,
      pageSize = 0,
      searchForm = {},
      initCurrentSearchPlan = false,
    ) {
      if (
        !this.isDetailPage
        && this.enabledSearchPlan
        && Object.keys(searchForm).length > 0
        && Object.prototype.hasOwnProperty.call(searchForm, 'search-plan')
      ) {
        this.getSearchPlan(() => {
          this.searchPlanClick(searchForm['search-plan'])
        })
        return
      }

      this.searchShow = false

      this.searchBase(page, pageSize, searchForm)
      this.searchBaseExtend(page, pageSize, searchForm)
      const newSearchForm = this.getNewSearchForm()

      if (
        !initCurrentSearchPlan
        && (!Object.prototype.hasOwnProperty.call(this, 'minDialog')
          || !this.minDialog.minDialog)
      ) {
        this.replaceRouter(newSearchForm)
      }

      // 合并参数
      const params = this.searchApiParams !== undefined
        ? cloneDeep(this.searchApiParams)
        : {}
      Object.assign(params, this.prepareNewSearchForm(newSearchForm))

      const tableData = await relation(
        {
          api: this.searchApi,
          params,
        },
        this.searchApiExtend,
        this.searchTemplate(),
        [],
        true,
        true,
      )

      this.$store.dispatch('saveListPageParams', {
        path: this.$route.name,
        params: newSearchForm,
      })

      // tree
      if (this.treeOption.tree) {
        tableData.data.forEach((item) => {
          if (item[`children.${this.treeOption.parent_key}`]) {
            item.children = []
            item._loading = false
          }
        })
      }

      this.$emit('getDataFromSearch', tableData)
      this.searchExtend(tableData)
    },
    searchTemplate() {
      if (!this.columns) {
        return []
      }

      let dbColumns = []
      if (this.searchPrimaryKey.length > 0) {
        dbColumns = [...this.searchPrimaryKey]
      }
      if (this.mustColumn) {
        dbColumns = [...dbColumns, ...this.mustColumn.split(',')]
      }

      if (this.treeOption.tree) {
        dbColumns.push(`children.${this.treeOption.parent_key}`)
      }

      const specialColumns = [
        'framework_action',
        'framework_index',
        'framework_selection',
      ]

      this.columns.forEach((item) => {
        if (item.show !== false && !specialColumns.includes(item.key)) {
          if (Object.prototype.hasOwnProperty.call(item, 'db_column')) {
            if (
              item.db_column !== false
              && !dbColumns.includes(item.db_column)
            ) {
              dbColumns.push(item.db_column)
            }
          } else if (!dbColumns.includes(item.key)) {
            dbColumns.push(item.key)
          }
        }
      })

      return dbColumns
    },
    getNewSearchForm() {
      const newSearchForm = {}
      Object.keys(this.searchForm).forEach((item) => {
        if (
          this.searchForm[item] === null
          || this.searchForm[item] === ''
          || this.searchForm[item] === undefined
          || (Array.isArray(this.searchForm[item])
            && this.searchForm[item].length < 1)
        ) {
          return
        }
        newSearchForm[item] = this.searchForm[item]
      })

      return newSearchForm
    },
    searchExtend(res) {
      this.$emit('searchExtend', res)
    },
    prepareNewSearchForm(newSearchForm) {
      const newSearchFormNew = {}
      Object.keys(newSearchForm).forEach((item) => {
        if (item == 'search-plan') {
          return
        }

        const currentSearchColumn = this.searchColumn
          && this.searchColumn.length > 0
          && this.searchColumn.find((obj) => obj.key === item)

        if (
          currentSearchColumn
          && Object.prototype.hasOwnProperty.call(currentSearchColumn, 'search')
        ) {
          switch (currentSearchColumn.search) {
            case 'like':
              newSearchFormNew[`${item}[like]`] = `%${newSearchForm[item]}%`
              break
            case 'min':
              newSearchFormNew[
                `${item.substring(0, item.lastIndexOf('_min'))}[>=]`
              ] = newSearchForm[item]
              break
            case 'max':
              newSearchFormNew[
                `${item.substring(0, item.lastIndexOf('_max'))}[<=]`
              ] = newSearchForm[item]
              break
            case 'in':
              newSearchFormNew[`${item}[in]`] = Array.isArray(
                newSearchForm[item],
              )
                ? newSearchForm[item].join(',')
                : newSearchForm[item]
              break
            case 'in_end':
              newSearchFormNew[
                `${item.substring(0, item.lastIndexOf('_in'))}[in]`
              ] = Array.isArray(newSearchForm[item])
                ? newSearchForm[item].join(',')
                : newSearchForm[item]
              break
          }
        } else {
          newSearchFormNew[item] = newSearchForm[item]
        }
      })
      this.prepareNewSearchFormCustomer(newSearchFormNew)
      return newSearchFormNew
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
    searchBase(page = 0, pageSize = 0, searchForm = {}) {
      this.searchForm.page = this.resetForm.page
      this.searchForm.page_size = this.$store.state.app.pageSize

      if (page) {
        this.searchForm.page = page
      }

      if (pageSize) {
        this.searchForm.page_size = pageSize
      }

      if (Object.keys(searchForm).length <= 0) {
        return
      }

      Object.keys(searchForm).forEach((item) => {
        if (item === 'page') {
          this.searchForm.page = searchForm.page
        } else if (item === 'page_size') {
          this.searchForm.page_size = searchForm.page_size
        } else {
          this.searchForm[item] = searchForm[item]
        }
      })
    },
    reset() {
      this.initSearchPlan(0)
    },
    resetData() {
      Object.assign(this.searchForm, this.resetForm)
    },
    add() {
      this.$emit('add')
    },
    toggleShow() {
      this.searchShow = !this.searchShow
      setTimeout(() => {
        this.$emit('toggleShow', this.searchShow)
      }, 0)
    },
    replaceRouter(newSearchForm) {
      const query = {}
      Object.assign(query, newSearchForm)
      if (Object.prototype.hasOwnProperty.call(query, 'search-plan')) {
        delete query['search-plan']
      }
      if (Object.prototype.hasOwnProperty.call(query, 'column')) {
        delete query.column
      }
      if (Object.keys(query).length <= 2 && query.page === 1) {
        delete query.page
        delete query.page_size
      }

      this.$router.replace({ query })
    },
    saveSearchPlan() {
      const query = this.getNewSearchForm()
      if (Object.prototype.hasOwnProperty.call(query, 'column')) {
        delete query.column
      }

      if (Object.keys(query).length === 0) {
        util.error(__('没有可保存的搜索条件，请先搜索后保存'))
        return
      }
      if (!this.searchPlanName) {
        this.searchPlanName = 'no title'
      }

      if (this.searchPlanId) {
        this.apiPut('search_plan', this.searchPlanId, {
          type: 1,
          name: this.searchPlanName,
          plan: JSON.stringify(query),
          source_type: this.searchPlanSourceType,
        }).then((res) => {
          this.currentSearchPlan.name = this.searchPlanName
          const { searchPlanId } = this
          this.searchPlanId = ''
          this.searchPlanName = ''
          this.getSearchPlan(() => {
            this.initSearchPlan(searchPlanId)
          }, true)
        })
      } else {
        this.apiPost('search_plan', {
          type: 1,
          name: this.searchPlanName,
          plan: JSON.stringify(query),
          source_type: this.searchPlanSourceType,
        }).then((res) => {
          this.searchPlanName = ''
          this.getSearchPlan(() => {
            this.initSearchPlan(res.id)
          }, true)
        })
      }
    },
    getSearchPlan(callback, immediately) {
      if (this.isDetailPage || !this.enabledSearchPlan) {
        return
      }

      const cacheKey = `searchPlath${this.searchPlanSourceType}`

      if (!immediately) {
        const cacheData = getCache(cacheKey)
        if (cacheData !== null) {
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
            type: 1,
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
    searchPlanClick(id) {
      if (id == 'save') {
        this.searchPlanModel = true
        this.searchPlanName = ''
        this.searchPlanId = ''
        return
      }

      if (id == 'update') {
        let searchPlanId = null
        if (this.currentSearchPlan.id) {
          searchPlanId = this.currentSearchPlan.id
        } else {
          util.error(__('未选中当前的筛选条件，请先选择后保存'))
          return
        }
        this.searchPlanModel = true
        this.searchPlanName = this.currentSearchPlan.name
        this.searchPlanId = searchPlanId
        return
      }

      if (id == 'delete') {
        this.$Modal.confirm({
          content: __('确认删除该筛选?'),
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
  },
  mounted() {
    this.resetData()
    this.getSearchPlan()
  },
}

export default search
