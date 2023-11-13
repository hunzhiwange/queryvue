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
          title: __('发行名称'),
          width: 200,
          key: 'name',
          fixed: 'left',
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
          title: __('进度条'),
          width: 200,
          key: 'progress',
          render: (h, params) => {
            return (
              <Progress percent={params.row.progress / 100} stroke-width={10} />
            )
          },
        },
        {
          title: __('所属项目'),
          width: 200,
          key: 'project.name',
        },
        {
          title: this.__('发布状态'),
          key: 'completed_enum',
          width: 120,
          db_column: 'completed',
        },
        {
          title: this.__('发布时间'),
          width: 170,
          key: 'completed_date',
          render: (h, params) => {
            return (
              <div>
                {4 == params.row.completed ? params.row.completed_date : ''}
              </div>
            )
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
