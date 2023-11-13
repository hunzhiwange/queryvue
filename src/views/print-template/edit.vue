<script>
import { cloneDeep } from 'lodash'
import baseForm from './base-form'
import columns from './create-column'

const newColumns = cloneDeep(columns)
newColumns.forEach((column) => {
  if (column.key === 'type') {
    column.displayOnly = true
  }
})

export default {
  extends: baseForm,
  data() {
    return {
      pageType: 'edit',
      columns: newColumns,
    }
  },
}
</script>
