import search from '../search/index'
import page from '@/utils/page'
import curd from '@/utils/curd'

const resetForm = {
  id: null,
  name: '',
  color: '',
  project_id: '',
  sort: 0,
  status: 1,
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
        },
        {
          title: this.__('排序'),
          key: 'sort',
          render: (h, params) => {
            return <tag color="default">{params.row.sort}</tag>
          },
        },
        {
          title: this.__('颜色'),
          key: 'color',
          render: (h, params) => {
            return <Badge color={params.row.color} text={params.row.color} />
          },
        },
        {
          title: this.__('所属项目'),
          key: 'project',
          render: (h, params) => {
            return <div>{params.row.project.name}</div>
          },
        },
        {
          title: this.__('创建时间'),
          width: 170,
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
          width: 135,
          fixed: 'right',
          align: 'left',
          render: (h, params) => {
            return (
              <div>
                <buttonGroup size="small" shape="circle">
                  <i-button
                    type="text"
                    onClick={() => this.edit(params)}
                    v-show={utils.permission('project_module_edit_button')}
                  >
                    {this.__('编辑')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.remove(params)}
                    v-show={utils.permission('project_module_delete_button')}
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
            message: this.__('请输入项目模块名字'),
          },
        ],
        color: [
          {
            required: true,
            message: this.__('请输入颜色'),
          },
        ],
        project_id: [
          {
            required: true,
            message: this.__('请选择所属项目'),
          },
        ],
      },
      selectedData: [],
      projects: [],
      resetForm: resetForm,
      serviceApi: 'project-module',
      serviceName: this.__('项目模块'),
    }
  },
  methods: {
    init: function () {
      this.searchList()
      this.apiGet('project', { status: 1 }).then((res) => {
        this.projects = res.data
      })
    },
  },
  computed: {},
  mounted: function () {
    this.init()
  },
  mixins: [page, curd],
}
