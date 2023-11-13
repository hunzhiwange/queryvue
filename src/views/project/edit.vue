<script>
import { cloneDeep } from 'lodash'
import baseForm from './base-form'
import columns from './create-column'

// 编辑员工时，可以不修改密码
const newColumns = cloneDeep(columns)
newColumns.forEach((column) => {
  if (column.key === 'password') {
    column.rules = []
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
