<script>
import baseForm from '../../components/curd/base-form'

const path = '/resource'

export default {
  extends: baseForm,
  data() {
    return {
      menuLeft: [
        {
          title: __('资源列表'),
          icon: 'md-list',
          path,
        },
      ],
      service: {
        entity: 'user:resource',
        path,
      },
    }
  },
}
</script>
