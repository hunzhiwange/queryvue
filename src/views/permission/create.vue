<script>
import baseForm from './base-form'
import columns from './create-column'

export default {
  extends: baseForm,
  data() {
    return {
      columns,
      data: {
        parent_id: this.$route.query.parent_id
          ? this.$route.query.parent_id
          : 0,
        status: 1,
      },
    }
  },
}
</script>
