<script lang="tsx">
import curd from '../../components/curd/curd-list'
import searchColumn from './search-column'
import tableColumn from './table-column.jsx'

const app = 'user'
const entity = 'role'
const name = __('角色')

export default {
  extends: curd,
  data() {
    return {
      searchPlanSourceType: 20230523231126,
      base: {
        app,
        entity,
        name,
      },
      searchColumn,
      statusBatchActions: true,
      extendActions: [
        {
          type: 'permission',
          icon: 'md-checkbox',
          name: __('授权'),
        },
      ],
      leftLinks: [
        {
          type: 'create',
        },
      ],
    }
  },
  methods: {
    handleContextMenuPermission(params) {
      this.$router.push({
        path: `/${entity}-permission/${params.id}`,
      })
    },
  },
  mixins: [tableColumn],
}
</script>
