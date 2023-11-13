<script>
import baseForm from '../../components/curd/base-form'

const path = '/role'

export default {
  extends: baseForm,
  data() {
    return {
      menuLeft: [
        {
          title: __('角色列表'),
          icon: 'md-list',
          path,
        },
      ],
      service: {
        entity: 'user:role',
        path,
      },
    }
  },
}
</script>
