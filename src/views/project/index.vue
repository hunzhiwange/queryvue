<script lang="tsx">
import curd from '../../components/curd/curd-list'
import searchColumn from './search-column'
import tableColumn from './table-column.jsx'

const app = 'project'
const entity = 'project'
const name = __('项目管理')

export default {
  extends: curd,
  data() {
    return {
      base: {
        app,
        entity,
        name,
      },
      searchPlanSourceType: 20231102114403,
      searchColumn,
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
