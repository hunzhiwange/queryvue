import search from '../search/index'
import page from '@/utils/page'
import { validateAlphaDash } from '@/utils/validate'
import curd from '@/utils/curd'

const resetForm = {
  id: null,
  name: '',
  num: '',
  color: '',
  icon: '',
  content_type: '',
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
          title: this.__('编号'),
          key: 'num',
          render: (h, params) => {
            return <tag color="default">{params.row.num}</tag>
          },
        },
        {
          title: this.__('内容类型'),
          key: 'content_type_enum',
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
          width: 130,
          key: 'color',
          render: (h, params) => {
            return <Badge color={params.row.color} text={params.row.color} />
          },
        },
        {
          title: this.__('图标'),
          key: 'icon',
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
                    v-show={utils.permission('project_type_edit_button')}
                  >
                    {this.__('编辑')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.remove(params)}
                    v-show={utils.permission('project_type_delete_button')}
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
            message: this.__('请输入项目类型名字'),
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
        icon: [
          {
            required: true,
            message: this.__('请输入项目图标'),
          },
          {
            validator: validateAlphaDash,
          },
        ],
        color: [
          {
            required: true,
            message: this.__('请输入颜色'),
          },
        ],
        content_type: [
          {
            required: true,
            message: this.__('请选择内容类型'),
          },
        ],
      },
      selectedData: [],
      projects: [],
      projectTypeContentType: {},
      resetForm: resetForm,
      serviceApi: 'project-type',
      serviceName: this.__('项目类型'),
    }
  },
  methods: {
    init: function () {
      this.searchList()
      this.apiGet('search', {
        'entity:enums': ['Project:ProjectType:content_type'],
      }).then((res) => {
        this.projectTypeContentType =
          res['entity']['enums']['Project:ProjectType:content_type']
      })
    },
  },
  computed: {},
  mounted: function () {
    this.init()
  },
  mixins: [page, curd],
}
