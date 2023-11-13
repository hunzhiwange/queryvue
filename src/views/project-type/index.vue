<script lang="tsx">
import curd from '../../components/curd/curd-list'
import searchColumn from './search-column'
import tableColumn from './table-column.jsx'

const app = 'project'
const entity = 'project_type'
const name = __('项目类型')

export default {
  extends: curd,
  data() {
    return {
      base: {
        app,
        entity,
        name,
      },
      searchPlanSourceType: 20231102112124,
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
