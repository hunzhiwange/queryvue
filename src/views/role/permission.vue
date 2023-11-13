<script>
import baseForm from './base-form'
import columns from './permission-column'
import utils from '../../utils'

export default {
  extends: baseForm,
  data() {
    return {
      pageType: 'permission',
      columns,
      data: {
        permission_id: [],
      },
    }
  },
  methods: {
    handleSubmitPermission(formData, toList) {
      formData.id = this.$route.params.id

      // 处理权限
      formData.permission_id += ''
      formData.permission_id = formData.permission_id
        ? formData.permission_id.split(',')
        : []

      this.apiPost('app:user/role/permission', formData).then((res) => {
        if (toList) {
          this.$router.push(this.service.path)
        }
      })
    },
    getData() {
      this.apiGet(`${this.service.entity}/list-only`, {
        id: this.$route.params.id,
        column: 'id',
        'relation[permission][setColumns]': 'id',
      }).then((res) => {
        if (!res.data[0]) {
          utils.errorNotFound()
          return
        }

        const permissionId = []
        res.data[0].permission.forEach((item) => {
          permissionId.push(item.id)
        })
        this.data.permission_id = permissionId
      })
    },
  },
  mounted() {
    this.getData()
  },
}
</script>
