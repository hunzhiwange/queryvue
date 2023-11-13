<script>
import baseForm from './base-form'
import columns from './role-column'
import utils from '../../utils'

export default {
  extends: baseForm,
  data() {
    return {
      pageType: 'role',
      columns,
      data: {
        role_id: [],
      },
    }
  },
  methods: {
    handleSubmitRole(formData, toList) {
      formData.id = this.$route.params.id

      // 处理角色
      formData.role_id += ''
      formData.role_id = formData.role_id ? formData.role_id.split(',') : []

      this.apiPost('app:user/user/role', formData).then((res) => {
        if (toList) {
          this.$router.push(this.service.path)
        }
      })
    },
    getData() {
      this.apiGet(`${this.service.entity}/list-only`, {
        id: this.$route.params.id,
        column: 'id',
        'relation[role][setColumns]': 'id,name',
      }).then((res) => {
        if (!res.data[0]) {
          utils.errorNotFound()
          return
        }

        const roleIds = []
        res.data[0].role.forEach((item) => {
          roleIds.push(item.id)
        })
        this.data.role_id = roleIds
      })
    },
  },
  mounted() {
    this.getData()
  },
}
</script>
