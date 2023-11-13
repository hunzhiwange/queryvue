export default {
  data() {
    return {
      columns: [
        {
          title: __('选项'),
          type: 'selection',
          key: 'framework_selection',
          width: 55,
          align: 'center',
          fixed: 'left',
        },
        {
          title: __('序号'),
          type: 'index',
          key: 'framework_index',
          width: 80,
          align: 'center',
          fixed: 'left',
          show: false,
        },
        {
          title: __('类型名称'),
          width: 200,
          key: 'name',
        },
        {
          title: __('编号'),
          width: 200,
          key: 'num',
          render: (h, params) => {
            return <tag color="default">{params.row.num}</tag>
          },
        },
        {
          title: __('内容类型'),
          width: 200,
          key: 'content_type_enum',
          db_column: 'content_type',
        },
        {
          title: __('颜色'),
          width: 200,
          key: 'color',
          render: (h, params) => {
            return <Badge color={params.row.color} text={params.row.color} />
          },
        },
        {
          title: __('排序'),
          width: 200,
          key: 'sort',
          render: (h, params) => {
            return <tag color="default">{params.row.sort}</tag>
          },
        },
        {
          title: __('类型图标'),
          width: 200,
          key: 'icon',
        },
        {
          title: __('状态'),
          width: 200,
          key: 'status_enum',
          db_column: 'status',
          render: (h, params) => {
            return (
              <Badge
                status={1 === params.row.status ? 'success' : 'default'}
                text={params.row.status_enum}
              />
            )
          },
        },
        {
          title: __('创建时间'),
          width: 200,
          key: 'create_at',
        },
        {
          title: __('操作'),
          key: 'framework_action',
          slot: 'action',
          width: 75,
          fixed: 'right',
          align: 'left',
        },
      ],
    }
  },
}
