<script lang="tsx">
import curd from '../../components/curd/curd-list'
import searchColumn from './search-column'
import tableColumn from './table-column.jsx'

const app = 'user'
const entity = 'user'
const name = __('员工')

export default {
  extends: curd,
  data() {
    return {
      base: {
        app,
        entity,
        name,
      },
      searchPlanSourceType: 20230523231115,
      searchApiParams: {
        type: 1,
        'relation[role][setColumns]': 'id,name',
      },
      searchColumn,
      searchApiExtend: {
        city: {
          api: 'base:city/list-only',
          source_key: 'city_id',
          target_key: 'city_id',
        },
      },
      extendActions: [
        {
          type: 'role',
          icon: 'md-checkbox',
          name: __('授权'),
        },
      ],
      leftLinks: [
        {
          type: 'create',
        },
      ],
      statusBatchActions: true,
    }
  },
  methods: {
    handleContextMenuRole(params) {
      this.$router.push({
        path: `/${entity}-role/${params.id}`,
      })
    },
  },
  mixins: [tableColumn],
}
</script>
