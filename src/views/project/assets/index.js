import { validateAlphaDash } from '@/utils/validate'
import search from '../search/index'
import page from '@/utils/page'
import projectTemplate from './template'
import curd from '@/utils/curd'

const resetForm = {
  name: '',
  num: '',
  status: 1,
  template: [],
}

const resetFormCommonUser = {
  selectUser: [],
}

const resetUserForm = {
  key: '',
  project_id: null,
  page: 1,
  page_size: 30,
}

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
          render: (h, params) => {
            return (
              <router-link to={'/board/' + params.row.num}>
                {params.row.name}
              </router-link>
            )
          },
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
          width: 170,
          key: 'create_at',
        },
        {
          title: this.__('进度'),
          key: 'progress',
          render: (h, params) => {
            return (
              <Progress percent={params.row.progress / 100} stroke-width={10} />
            )
          },
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
          width: 250,
          fixed: 'right',
          align: 'left',
          render: (h, params) => {
            return (
              <div>
                <buttonGroup size="small" shape="circle">
                  <i-button
                    type="text"
                    onClick={() => this.user(params)}
                    v-show={utils.permission('project_role_button')}
                  >
                    {this.__('成员')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.edit(params)}
                    v-show={utils.permission('project_edit_button')}
                  >
                    {this.__('设置')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.favor(params)}
                    v-show={
                      !this.favorProjectIds.includes(params.row.id) &&
                      utils.permission('project_edit_button')
                    }
                  >
                    {this.__('收藏')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.cancelFavor(params)}
                    v-show={
                      this.favorProjectIds.includes(params.row.id) &&
                      utils.permission('project_edit_button')
                    }
                  >
                    {this.__('取消收藏')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.remove(params)}
                    v-show={utils.permission('project_delete_button')}
                  >
                    {this.__('删除')}
                  </i-button>
                </buttonGroup>
              </div>
            )
          },
        },
      ],
      minUser: false,
      minUserProjectId: 0,
      searchUserForm: Object.assign({}, resetUserForm),
      loadingUserTable: true,
      rules: {
        name: [
          {
            required: true,
            message: this.__('请输入项目名字'),
          },
        ],
        num: [
          {
            required: true,
            message: this.__('请输入项目编号'),
          },
          {
            validator: validateAlphaDash,
          },
        ],
      },
      selectedData: [],
      roles: [],
      viewDetail: {},
      rightForm: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static',
      },
      formCommonUser: resetFormCommonUser,
      loadingCommonUser: false,
      commonUsers: [],
      userTotal: 0,
      userPage: 1,
      userPermissionId: 0,
      userSearchKey: '',
      userColumns: [
        {
          title: this.__('用户名'),
          key: 'user.name',
        },
        {
          title: this.__('用户编号'),
          key: 'user.num',
          render: (h, params) => {
            return <tag color="default">{params.row['user.num']}</tag>
          },
        },
        {
          title: this.__('成员类型'),
          key: 'extend_type_enum',
        },
        {
          title: this.__('加入时间'),
          key: 'create_at',
        },
        {
          title: this.__('操作'),
          key: 'action',
          width: 160,
          fixed: 'right',
          align: 'left',
          render: (h, params) => {
            return (
              <div>
                <buttonGroup size="small" shape="circle">
                  <i-button
                    type="text"
                    onClick={() => this.setMember(params)}
                    v-show={
                      2 === params.row.extend_type &&
                      utils.permission('project_role_button')
                    }
                  >
                    {this.__('设为成员')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.setAdministrator(params)}
                    v-show={
                      1 === params.row.extend_type &&
                      utils.permission('project_role_button')
                    }
                  >
                    {this.__('设为管理')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.deleteUser(params)}
                    v-show={utils.permission('project_delete_button')}
                  >
                    {this.__('删除')}
                  </i-button>
                </buttonGroup>
              </div>
            )
          },
        },
      ],
      userData: [],
      commonUserRules: {
        selectUser: [
          {
            required: true,
            message: this.__('请选择用户'),
          },
        ],
      },
      favorProjectIds: [],
      projectTemplate: projectTemplate,
      seletedProjectTemplate: 'soft',
      resetForm: resetForm,
      serviceApi: 'project',
      serviceName: this.__('项目'),
    }
  },
  methods: {
    getProjectFavorDataFromSearch(data) {
      let favorProjectIds = []
      data.data.forEach((item) => {
        favorProjectIds.push(item.id)
      })
      this.favorProjectIds = favorProjectIds
    },
    favor(params) {
      let data = {
        project_id: params.row.id,
      }
      this.loadingTable = !this.loadingTable
      this.apiPost('project/favor', data).then(
        (res) => {
          if (!this.favorProjectIds.includes(data.project_id)) {
            this.favorProjectIds.push(data.project_id)
          }
          this.loadingTable = !this.loadingTable
        },
        () => {
          this.loadingTable = !this.loadingTable
        },
      )
    },
    cancelFavor(params) {
      let data = {
        project_id: params.row.id,
      }
      this.loadingTable = !this.loadingTable
      this.apiPost('project/cancel-favor', data).then(
        (res) => {
          if (this.favorProjectIds.includes(data.project_id)) {
            let deleteProjectIndex = this.favorProjectIds.indexOf(
              data.project_id,
            )
            if (deleteProjectIndex > -1) {
              this.favorProjectIds.splice(deleteProjectIndex, 1)
            }
          }
          this.loadingTable = !this.loadingTable
        },
        () => {
          this.loadingTable = !this.loadingTable
        },
      )
    },
    init: function () {
      this.searchList()
      this.apiGet('role', { status: 1 }).then((res) => {
        this.roles = res.data
      })
    },
    beforeSaveData(formData) {
      formData.template = this.seletedProjectTemplateData
    },
    cancelMinUser: function () {
      this.minUser = false
    },
    user: function (params) {
      this.minUser = true
      this.viewDetail = params.row
      this.minUserProjectId = params.row.id
      this.searchUser()
    },
    searchUser: function () {
      this.loadingUserTable = false
      this.searchUserForm.project_id = this.minUserProjectId
      this.apiGet('project/user', this.searchUserForm).then((res) => {
        this.userData = res.data
        this.userTotal = res.page.total_record
        this.userPage = res.page.current_page
        this.userPageSize = res.page.per_page
        this.loadingUserTable = !this.loadingUserTable
      })
    },
    searchCommonUser(query) {
      query = query.replace(/(^\s*)|(\s*$)/g, '')
      this.userSearchKey = query

      utils.once(() => {
        if (query !== '') {
          this.loadingCommonUser = true
          this.apiGet('user', { key: query, page_size: 9999, status: 1 }).then(
            (res) => {
              this.loadingCommonUser = false
              this.commonUsers = res.data
            },
          )
        } else {
          this.commonUsers = []
        }
      }, 500)
    },
    changeCommonUser() {},
    resetUser() {
      Object.assign(this.searchUserForm, resetUserForm)
      this.searchUser()
    },
    setMember(params) {
      var formData = {
        project_id: this.minUserProjectId,
        user_id: params.row.user_id,
      }

      this.loadingUserTable = !this.loadingUserTable
      this.apiPost('project/set-member', formData).then(
        (res) => {
          this.userData.forEach((item, index) => {
            if (item.user_id === params.row.user_id) {
              item.extend_type = res.extend_type
              item.extend_type_enum = res.extend_type_enum
              this.userData[index] = item
            }
          })
          this.loadingUserTable = !this.loadingUserTable
        },
        () => {
          this.loadingUserTable = !this.loadingUserTable
        },
      )
    },
    setAdministrator(params) {
      var formData = {
        project_id: this.minUserProjectId,
        user_id: params.row.user_id,
      }

      this.loadingUserTable = !this.loadingUserTable
      this.apiPost('project/set-administrator', formData).then(
        (res) => {
          this.userData.forEach((item, index) => {
            if (item.user_id === params.row.user_id) {
              item.extend_type = res.extend_type
              item.extend_type_enum = res.extend_type_enum
              this.userData[index] = item
            }
          })
          this.loadingUserTable = !this.loadingUserTable
        },
        () => {
          this.loadingUserTable = !this.loadingUserTable
        },
      )
    },
    deleteUser(params) {
      this.$Modal.confirm({
        title: this.__('提示'),
        content: this.__('确认删除该成员?'),
        onOk: () => {
          var formData = {
            project_id: this.minUserProjectId,
            user_id: params.row.user_id,
          }
          this.loadingUserTable = !this.loadingUserTable
          this.apiPost('project/delete-user', formData).then(
            (res) => {
              this.userData.splice(params.index, 1)
              this.loadingUserTable = !this.loadingUserTable
            },
            () => {
              this.loadingUserTable = !this.loadingUserTable
            },
          )
        },
        onCancel: () => {},
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
    addUser() {
      this.rightForm = true
    },
    handleAddUserSubmit(form) {
      this.$refs[form].validate((pass) => {
        if (pass) {
          var formData = {
            project_id: this.minUserProjectId,
            user_ids: this.formCommonUser.selectUser,
          }

          this.loading = !this.loading
          this.loadingUserTable = !this.loadingUserTable
          this.apiPost('project/addUsers', formData).then(
            (res) => {
              this.loading = !this.loading
              this.rightForm = false
              this.commonUsers = []
              this.selectUser = []
              this.searchUser()
              this.loadingUserTable = !this.loadingUserTable
            },
            () => {
              this.loading = !this.loading
              this.loadingUserTable = !this.loadingUserTable
            },
          )
        }
      })
    },
  },
  computed: {
    seletedProjectTemplateData: function () {
      let selecedData = this.projectTemplate.find((item) => {
        return item.key === this.seletedProjectTemplate
      })
      selecedData = selecedData || {}
      return selecedData
    },
  },
  mounted: function () {
    this.init()
  },
  mixins: [page, curd],
}
