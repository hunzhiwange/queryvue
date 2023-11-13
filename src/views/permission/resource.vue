<script>
import baseForm from './base-form'
import columns from './resource-column'
import utils from '../../utils'

export default {
  extends: baseForm,
  data() {
    return {
      pageType: 'resource',
      columns,
      data: {
        resource_id: [],
      },
    }
  },
  methods: {
    handleSubmitResource(formData, toList) {
      formData.id = this.$route.params.id

      // 处理资源
      formData.resource_id += ''
      formData.resource_id = formData.resource_id
        ? formData.resource_id.split(',')
        : []

      this.apiPost('app:user/permission/resource', formData).then((res) => {
        if (toList) {
          this.$router.push(this.service.path)
        }
      })
    },
    getData() {
      this.apiGet(`${this.service.entity}/list-only`, {
        id: this.$route.params.id,
        column: 'id',
        'relation[resource][setColumns]': 'id',
      }).then((res) => {
        if (!res.data[0]) {
          utils.errorNotFound()
          return
        }

        const resourceIds = []
        res.data[0].resource.forEach((item) => {
          resourceIds.push(item.id)
        })
        this.data.resource_id = resourceIds.join(',')
      })
    },
  },
  mounted() {
    this.getData()
  },
}
</script>
