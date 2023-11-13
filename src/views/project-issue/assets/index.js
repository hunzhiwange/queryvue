import search from '../search/index'
import page from '@/utils/page'
import curd from '@/utils/curd'

const resetForm = {
  id: null,
  name: '',
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
          title: this.__('标题'),
          key: 'title',
          render: (h, params) => {
            return (
              <router-link to={'/issue/' + params.row.num}>
                {params.row.title}
              </router-link>
            )
          },
        },
        {
          title: this.__('编号'),
          key: 'sort',
          width: 170,
          render: (h, params) => {
            return <tag color="default">{params.row.num}</tag>
          },
        },
        {
          title: this.__('所属项目'),
          key: 'project',
          width: 180,
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
          title: this.__('更新时间'),
          width: 170,
          key: 'update_at',
        },
        {
          title: this.__('项目分类'),
          key: 'project_label',
          width: 120,
          render: (h, params) => {
            return (
              <Badge status={'default'} text={params.row.project_label.name} />
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
                    onClick={() => this.view(params)}
                    v-show={utils.permission('project_issue_view_button')}
                  >
                    {this.__('查看')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.remove(params)}
                    v-show={utils.permission('project_issue_delete_button')}
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
            message: this.__('请输入项目问题名字'),
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
      serviceApi: 'project-issue',
      serviceName: this.__('项目问题'),
    }
  },
  methods: {
    view(params) {
      this.$router.push({
        path: '/issue/' + params.row.num,
      })
    },
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
    if (this.$route.query.action) {
      if ('create' === this.$route.query.action) {
        this.add(this.$route.query.project_id)
      }
    }
  },
  mixins: [page, curd],
}
