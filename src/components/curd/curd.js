import CurdIndex from '@/components/curd/index'
import utils from '../../utils'

export default {
  components: {
    CurdIndex,
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
  },
  data() {
    return {
      searchPlanSourceType: 0,
      searchApi: '',
      searchApiParams: {},
      searchApiExtend: {},
      searchPrimaryKey: ['id'],
      mountedInitColumns: true,
      service: {
        app: '',
        base: '',
        entity: '',
        name: '',
      },
      leftLinks: [],
      leftTabMenus: [],
      actions: [
        {
          type: 'edit',
        },
        {
          type: 'delete',
        },
      ],
      extendActions: [],
      batchActions: [],
      statusBatchActions: false,
      tree: {
        tree: false,
      },
      base: {
        app: '',
        entity: '',
        name: '',
        path: '',
      },
    }
  },
  methods: {
    refreshPage(args) {
      this.utils.refreshPage(args)
    },
    refresh() {
      this.utils.refreshPage(this.$route)
    },
    initColumns() {
      this.$refs.curdIndex.initColumns(this.columns)
    },
    remove(params) {
      this.handleContextMenuAction('delete', params)
    },
    edit(params) {
      this.handleContextMenuAction('edit', params)
    },
    handleContextMenu(params) {},
    handleContextMenuAction(action, params) {
      const actionMethod = `handleContextMenu${utils.ucFirst(action)}`
      if (actionMethod in this) {
        this[actionMethod](params)
      } else {
        utils.error(__('操作方法（%s）不存在', actionMethod))
      }
    },
    handleContextMenuAdd(params) {
      this.$router.push({ path: `/${this.service.path}-add` })
    },
    handleContextMenuEdit(params) {
      this.$router.push({
        path: `/${this.service.path}-edit/${params.id}`,
      })
    },
    handleContextMenuDelete(params) {
      this.$refs.curdIndex.delete(params)
    },
    handleContextMenuDetail(params) {
      this.$router.push({
        path: `/${this.service.path}-detail/${params.id}`,
      })
    },
    handleBatchActions(action, selectedData) {
      const actionMethod = `handleBatchAction${utils.ucFirst(action)}`
      if (actionMethod in this) {
        this[actionMethod](selectedData)
      } else {
        utils.error(__('批量操作方法（%s）不存在', actionMethod))
      }
    },
    handleBatchActionStatusManyOn(selectedData) {
      this.$refs.curdIndex.statusMany(1, selectedData)
    },
    handleBatchActionStatusManyOff(selectedData) {
      this.$refs.curdIndex.statusMany(0, selectedData)
    },
    prepareStatusBatchActions(base) {
      this.batchActions = [
        {
          icon: 'md-eye',
          name: __('启用'),
          action: 'statusManyOn',
          permission: `${base}_status_on_button`,
        },
        {
          icon: 'md-eye-off',
          name: __('禁用'),
          action: 'statusManyOff',
          permission: `${base}_status_off_button`,
        },
      ]
    },
    prepareLeftLinks(base) {
      this.leftLinks.forEach((item) => {
        if (item.type === 'create' && !item.link) {
          item.link = `/${base}-create`
        }

        if (item.type === 'import' && !item.link) {
          item.link = `/${base}-batch-import-list`
        }

        if (!item.permission) {
          item.permission = `${base}_${item.type}_button`
        }
      })
    },
    prepareActions(base) {
      this.actions.forEach((item) => {
        if (!item.permission) {
          item.permission = `${base}_${item.type}_button`
        }
      })

      this.extendActions.forEach((item) => {
        this.actions.push(item)
      })
    },
    prepareService() {
      if (!this.base.entity) {
        return
      }

      if (this.base.path) {
        this.service.path = this.base.path
      } else {
        this.service.path = this.base.entity.replaceAll('_', '-')
      }
      this.service.app_api = `app:${this.base.app}/${this.base.entity}`
      this.service.entity = `${this.base.app}:${this.base.entity}`
      this.service.name = this.base.name

      if (!this.searchApi) {
        this.searchApi = this.service.entity
      }
    },
  },
  mounted() {
    if (this.mountedInitColumns) {
      this.initColumns()
    }
  },
  beforeMount() {
    this.prepareService()
    this.prepareActions(this.service.path)
    this.prepareLeftLinks(this.service.path)
    if (this.statusBatchActions) {
      this.prepareStatusBatchActions(this.service.path)
    }
  },
}
