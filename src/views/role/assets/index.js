import { validateAlphaDash } from '@/utils/validate'
import search from './../search/index'
import page from '@/utils/page'
import curd from '@/utils/curd'

const resetForm = {
  id: null,
  name: '',
  num: '',
  status: 1,
}

const resetFormPermission = {}

export default {
  components: {
    search,
  },
  data() {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          className: 'table-selection',
        },
        {
          type: 'index',
          width: 55,
          align: 'center',
          className: 'table-index',
        },
        {
          title: this.__('名字'),
          key: 'name',
        },
        {
          title: this.__('编号'),
          key: 'num',
          render: (h, params) => {
            return <tag color="default">{params.row.num}</tag>
          },
        },
        {
          title: this.__('创建时间'),
          key: 'create_at',
        },
        {
          title: this.__('状态'),
          key: 'status_enum',
          width: 120,
          render: (h, params) => {
            return (
              <Badge
                status={1 === params.row.status ? 'success' : 'default'}
                text={params.row.status_enum}
              />
            )
          },
        },
        {
          title: this.__('操作'),
          key: 'action',
          width: 185,
          fixed: 'right',
          align: 'left',
          render: (h, params) => {
            return (
              <div>
                <buttonGroup size="small" shape="circle">
                  <i-button
                    type="text"
                    onClick={() => this.edit(params)}
                    v-show={utils.permission('role_edit_button')}
                  >
                    {this.__('编辑')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.permission(params)}
                    v-show={utils.permission('role_permission_button')}
                  >
                    {this.__('授权')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.remove(params)}
                    v-show={utils.permission('role_delete_button')}
                  >
                    {this.__('删除')}
                  </i-button>
                </buttonGroup>
              </div>
            )
          },
        },
      ],
      tableHeight: 'auto',
      dataBackup: null,
      rules: {
        name: [
          {
            required: true,
            message: this.__('请输入角色名字'),
          },
        ],
        num: [
          {
            required: true,
            message: this.__('请输入角色编号'),
          },
          {
            validator: validateAlphaDash,
          },
        ],
      },
      selectedData: [],
      rightForm: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static',
      },
      formPermission: resetFormPermission,
      viewDetail: {},
      dataTree: [],
      dataTreeInit: false,
      permissionRoleId: '',
      selectPermissionId: [],
      resetForm: resetForm,
      serviceApi: 'role',
      serviceName: this.__('角色'),
    }
  },
  methods: {
    init: function () {
      this.searchList()
    },
    permission(params) {
      if (!this.dataTreeInit) {
        this.apiGet('permission', { status: 1 }).then((res) => {
          this.dataTree = res
          this.dataTreeInit = true
        })
      }
      this.permissionRoleId = params.row.id
      this.viewDetail = params.row

      this.apiGet('role/' + params.row.id).then((res) => {
        let selectPermissionId = []
        res.permission.forEach((item) => {
          selectPermissionId.push(item.id)
        })

        this.selectPermissionId = selectPermissionId

        this.travelTree(this.dataTree)
      })

      this.rightForm = true
    },
    travelTree(data) {
      data.forEach((item) => {
        if (this.selectPermissionId.includes(item.id)) {
          item['checked'] = true
        } else {
          item['checked'] = false
        }

        if (item.children) {
          this.travelTree(item.children)
        }
      })
    },
    renderContent(h, { root, node, data }) {
      return (
        <span class="tree-item" style="display: inline-block; width: 100%;">
          <span
            class="tree-item-title"
            style={{
              textDecoration: data.status ? 'none' : 'line-through',
              color: data.status ? '' : '#c5c8ce',
            }}
          >
            {data.name}
          </span>
          <span class="tree-item-text">{data.num}</span>
        </span>
      )
    },
    handlePermissionSubmit(form) {
      this.loading = !this.loading

      let selected = this.$refs.tree.getCheckedNodes()

      let selectedIds = []
      selected.forEach(({ id }) => selectedIds.push(id))

      let formData = {
        id: this.permissionRoleId,
        permission_id: selectedIds,
      }

      this.apiPost('role/permission', formData).then(
        (res) => {
          this.loading = !this.loading
          this.rightForm = false
        },
        () => {
          this.loading = !this.loading
        },
      )
    },
  },
  computed: {},
  mounted: function () {
    this.init()
  },
  mixins: [page, curd],
}
