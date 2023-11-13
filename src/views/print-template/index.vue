<script lang="tsx">
import curd from '../../components/curd/curd-list'
import searchColumn from './search-column'
import tableColumn from './table-column.jsx'

const app = 'print'
const entity = 'print_template'
const name = __('打印模板')

export default {
  extends: curd,
  data() {
    return {
      base: {
        app,
        entity,
        name,
      },
      searchPlanSourceType: 20230622103113,
      searchColumn,
      extendActions: [
        {
          type: 'design',
          icon: 'md-cog',
          name: __('设计'),
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
    handleContextMenuDesign(params) {
      this.$router.push({
        path: `/${this.service.path}-design/${params.id}`,
      })
    },
  },
  mixins: [tableColumn],
}
</script>
