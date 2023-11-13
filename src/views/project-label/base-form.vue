<script>
import baseForm from '../../components/curd/base-form'

const path = '/user'

export default {
  extends: baseForm,
  data() {
    return {
      menuLeft: [
        {
          title: __('员工列表'),
          icon: 'md-list',
          path,
        },
      ],
      service: {
        entity: 'user:user',
        path,
      },
    }
  },
}
</script>
