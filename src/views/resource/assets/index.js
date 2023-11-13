import search from './../search/index'
import page from '@/utils/page'
import curd from '@/utils/curd'

const resetForm = {
  id: null,
  name: '',
  num: '',
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
                    v-show={utils.permission('resource_edit_button')}
                  >
                    {this.__('编辑')}
                  </i-button>
                  <i-button
                    type="text"
                    onClick={() => this.remove(params)}
                    v-show={utils.permission('resource_delete_button')}
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
            message: this.__('请输入资源名字'),
          },
        ],
        num: [
          {
            required: true,
            message: this.__('请输入资源编号'),
          },
        ],
      },
      selectedData: [],
      resetForm: resetForm,
      serviceApi: 'resource',
      serviceName: this.__('资源'),
    }
  },
  methods: {},
  computed: {},
  mounted: function () {
    this.searchList()
  },
  mixins: [page, curd],
}
