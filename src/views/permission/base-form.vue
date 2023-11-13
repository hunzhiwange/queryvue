<script>
import baseForm from '../../components/curd/base-form'

const path = '/permission'

export default {
  extends: baseForm,
  data() {
    return {
      menuLeft: [
        {
          title: __('权限列表'),
          icon: 'md-list',
          path,
        },
      ],
      service: {
        entity: 'user:permission',
        path,
      },
    }
  },
}
</script>
