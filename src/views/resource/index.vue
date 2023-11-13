<script lang="tsx">
import curd from '../../components/curd/curd-list'
import searchColumn from './search-column'
import tableColumn from './table-column.jsx'

const app = 'user'
const entity = 'resource'
const name = __('资源')

export default {
  extends: curd,
  data() {
    return {
      base: {
        app,
        entity,
        name,
      },
      searchPlanSourceType: 20230523231140,
      searchColumn,
      statusBatchActions: true,
      leftLinks: [
        {
          type: 'create',
        },
      ],
    }
  },
  mixins: [tableColumn],
}
</script>
