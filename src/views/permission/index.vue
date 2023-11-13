<script lang="tsx">
import curd from '../../components/curd/curd-list'
import searchColumn from './search-column'
import tableColumn from './table-column.jsx'

const app = 'user'
const entity = 'permission'
const name = __('权限')

export default {
  extends: curd,
  data() {
    return {
      base: {
        app,
        entity,
        name,
      },
      searchPlanSourceType: 20230524121949,
      searchApiParams: {
        parent_id: 0,
      },
      searchColumn,
      searchApiExtend: {
        children: {
          api: 'user:permission/list-only',
          source_key: 'id',
          target_key: 'parent_id',
        },
      },
      leftLinks: [
        {
          type: 'create',
        },
      ],
      actions: [
        {
          type: 'create',
        },
        {
          type: 'edit',
        },
        {
          type: 'delete',
        },
      ],
      extendActions: [
        {
          type: 'resource',
          icon: 'md-checkbox',
          name: __('授权'),
        },
      ],
      tree: {
        tree: true,
      },
    }
  },
  methods: {
    handleContextMenuCreate(params) {
      this.$router.push({
        path: `/${entity}-create`,
        query: { parent_id: params.id },
      })
    },
    handleContextMenuResource(params) {
      this.$router.push({
        path: `/${entity}-resource/${params.id}`,
      })
    },
  },
  mixins: [tableColumn],
}
</script>
