<script lang="tsx">
import curd from '../../components/curd/curd-list'
import searchColumn from './search-column'
import tableColumn from './table-column.jsx'

const app = 'project'
const entity = 'project_release'
const name = __('项目版本')

export default {
  extends: curd,
  data() {
    return {
      base: {
        app,
        entity,
        name,
      },
      searchPlanSourceType: 20231102122915,
      searchColumn,
      searchApiExtend: {
        project: {
          api: 'project:project/list-only',
          source_key: 'project_id',
          target_key: 'id',
        },
      },
      leftLinks: [
        {
          type: 'create',
        },
      ],
    }
  },
  methods: {},
  mixins: [tableColumn],
}
</script>
