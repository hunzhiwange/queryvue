<script>
import baseForm from '../../components/curd/base-form'

const path = '/print-template'

export default {
  extends: baseForm,
  data() {
    return {
      menuLeft: [
        {
          title: __('打印模板列表'),
          icon: 'md-list',
          path,
        },
      ],
      service: {
        entity: 'print:print_template',
        path,
      },
    }
  },
}
</script>
