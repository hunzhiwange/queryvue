<script>
import baseForm from './base-form'
import columns from './create-column'

export default {
  extends: baseForm,
  data() {
    return {
      pageType: 'edit',
      columns,
    }
  },
}
</script>
