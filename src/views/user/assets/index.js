import { validateAlphaDash } from '@/utils/validate'
import search from './../search/index'
import page from '@/utils/page'
import curd from '@/utils/curd'

const resetForm = {
  id: null,
  name: '',
  num: '',
  status: 1,
  password: '',
}

const resetFormRole = {
  id: 0,
  role: [],
}

export default {
  components: {
    search,
  },
  data() {
    let passwordRule = [
      {
        required: true,
        message: this.__('请输入密码'),
        trigger: 'blur',
      },
      {
        min: 6,
        max: 30,
        message: this.__('长度在 %d 到 %d 个字符', 6, 30),
        trigger: 'blur',
      },
      {
        validator: validateAlphaDash,
      },
    ]

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
          title: this.__('角色'),
          key: 'num',
          render: (h, params) => {
            return (
              <div>
                {params.row.role.map((item) => {
                  return <Tag color="green">{item.name}</Tag>
                })}
              </div>
            )
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
                    v-show={utils.permission('user_edit_button')}
                  >
                    {this.__('编辑')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.role(params)}
                    v-show={utils.permission('user_role_button')}
                  >
                    {this.__('授权')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.remove(params)}
                    v-show={utils.permission('user_delete_button')}
                  >
                    {this.__('删除')}
                  </i-button>
                </buttonGroup>
              </div>
            )
          },
        },
      ],
      rules: {
        name: [
          {
            required: true,
            message: this.__('请输入用户名字'),
          },
        ],
        num: [
          {
            required: true,
            message: this.__('请输入用户编号'),
          },
          {
            validator: validateAlphaDash,
          },
        ],
        password: passwordRule,
        passwordBackup: passwordRule,
      },
      roles: [],
      viewDetail: {},
      rightForm: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static',
      },
      formRole: resetFormRole,
      selectRole: [],
      resetForm: resetForm,
      serviceApi: 'user',
      serviceName: this.__('用户'),
    }
  },
  methods: {
    init: function () {
      this.searchList()
      this.apiGet('role', { status: 1 }).then((res) => {
        this.roles = res.data
      })
    },
    passwordValidate(id) {
      if (id) {
        this.liveNode = false
        if (this.formItem.password) {
          this.rules.password = this.rules.passwordBackup
        } else {
          this.rules.password = []
        }
        this.liveNode = true
      }
    },
    role(params) {
      this.viewDetail = params.row
      this.formRole.id = params.row.id
      let role = []
      params.row.role.forEach((item) => {
        role.push(item.id)
      })
      this.formRole.role = role

      this.rightForm = true
    },
    handleRoleSubmit(form) {
      this.loading = !this.loading

      let formData = {
        id: this.formRole.id,
        role_id: this.formRole.role,
      }

      this.apiPost('user/role', formData).then(
        (res) => {
          this.loading = !this.loading
          this.rightForm = false

          this.data.forEach((item, index) => {
            if (item.id === this.formRole.id) {
              this.data[index] = res
            }
          })
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
