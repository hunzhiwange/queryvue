import { Input, Space } from 'view-ui-plus'
import PageDetail from '@/components/doc/detail'

const detail = {
  components: {
    PageDetail,
  },
  data() {
    return {
      actionLoading: false,
      menuLeft: [],
      searchPlanSourceType: 0,
      searchApi: '',
      searchApiExtend: {},
      confirmActionRemark: '',
    }
  },
  methods: {
    refresh() {
      this.$refs.pageDetail.refresh()
    },
    confirmAction(content, docId, method, formData = {}) {
      this.$Modal.confirm({
        title: __('提示'),
        width: 500,
        render: () => {
          return (
            <div>
              <Space direction="vertical" style={'width:100%;'}>
                <p>{content}</p>
                <Input
                  v-model={this.confirmActionRemark}
                  type="textarea"
                  autosize={{ minRows: 3, maxRows: 5 }}
                  placeholder={__('请填写备注（选填）')}
                ></Input>
              </Space>
            </div>
          )
        },
        onOk: () => {
          this.actionLoading = !this.actionLoading
          if (typeof formData === 'function') {
            formData = formData()
          }
          formData.remark = this.confirmActionRemark
          this.apiPatch('apiQL/doc:doc', docId, method, formData).then(
            () => {
              this.actionLoading = !this.actionLoading
              this.confirmActionRemark = ''
              this.refresh()
            },
            () => {
              this.actionLoading = !this.actionLoading
            },
          )
        },
      })
    },
  },
  mounted() {
    this.$refs.pageDetail.initDetailColumns(this.columns)
  },
}

export default detail
