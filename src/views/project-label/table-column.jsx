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
          title: __('分类名称'),
          width: 200,
          key: 'name',
          fixed: 'left',
        },
        {
          title: __('所属项目'),
          width: 200,
          key: 'project.name',
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
