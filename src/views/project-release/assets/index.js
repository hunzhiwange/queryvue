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
          title: this.__('名字'),
          key: 'name',
        },
        {
          title: this.__('排序'),
          width: 80,
          key: 'sort',
          render: (h, params) => {
            return <tag color="default">{params.row.sort}</tag>
          },
        },
        {
          title: this.__('所属项目'),
          width: 180,
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
          title: this.__('发布状态'),
          key: 'completed_enum',
          width: 120,
          render: (h, params) => {
            let status = this.getStatus(params.row.completed)
            return <Badge status={status} text={params.row.completed_enum} />
          },
        },
        {
          title: this.__('发布时间'),
          width: 170,
          key: 'completed_date',
          render: (h, params) => {
            return (
              <div>
                {4 == params.row.completed ? params.row.completed_date : ''}
              </div>
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
          title: this.__('进度'),
          key: 'progress',
          width: 150,
          render: (h, params) => {
            return (
              <Progress percent={params.row.progress / 100} stroke-width={10} />
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
                    onClick={() => this.edit(params.row)}
                    v-show={utils.permission('project_release_edit_button')}
                  >
                    {this.__('编辑')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.remove(params)}
                    v-show={utils.permission('project_release_delete_button')}
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
            message: this.__('请输入项目版本名字'),
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
      serviceApi: 'project-release',
      serviceName: this.__('项目版本'),
    }
  },
  methods: {
    getStatus(completed) {
      let status = ''
      switch (completed) {
        case 1:
          status = 'default'
          break
        case 2:
          status = 'blue'
          break
        case 3:
          status = 'red'
          break
        case 4:
          status = 'success'
          break
      }

      return status
    },
    editId(projectReleaseId) {
      this.apiGet('project-release/' + projectReleaseId).then((res) => {
        this.edit(res)
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
      if ('edit' === this.$route.query.action) {
        this.editId(this.$route.query.project_release_id)
      }
    }
  },
  mixins: [page, curd],
}
