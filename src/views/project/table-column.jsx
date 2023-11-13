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
          title: __('项目名称'),
          width: 200,
          key: 'name',
          render: (h, params) => {
            return (
              <router-link to={'/board/' + params.row.num}>
                {params.row.name}
              </router-link>
            )
          },
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
          title: __('已完成任务'),
          width: 200,
          key: 'completed_number',
        },
        {
          title: __('未完成任务'),
          width: 200,
          key: 'unfinished_number',
        },
        {
          title: __('排序'),
          width: 200,
          key: 'sort',
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
