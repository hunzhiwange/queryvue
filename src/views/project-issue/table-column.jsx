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
          title: __('标题'),
          width: 400,
          key: 'title',
          db_column: 'title,num',
          renderEllipsis: true,
          render: (h, params) => {
            return (
              <router-link to={'/issue/' + params.row.num}>
                {params.row.title}
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
          title: __('所属项目'),
          width: 200,
          key: 'project.name',
        },
        {
          title: __('项目分类'),
          width: 200,
          key: 'project_label.name',
        },
        {
          title: __('项目类型'),
          width: 200,
          key: 'project_type.name',
        },
        {
          title: __('优先级别'),
          width: 200,
          key: 'level_enum',
          db_column: 'level',
        },
        {
          title: __('是否完成'),
          width: 200,
          key: 'completed_enum',
          db_column: 'completed',
          show: false,
        },
        {
          title: __('完成时间'),
          width: 200,
          key: 'completed_date',
          show: false,
        },
        {
          title: __('附件数量'),
          width: 200,
          key: 'file_number',
          show: false,
        },
        {
          title: __('计划开始时间'),
          width: 200,
          key: 'start_date',
          show: false,
        },
        {
          title: __('计划结束时间'),
          width: 200,
          key: 'end_date',
          show: false,
        },
        {
          title: __('是否归档'),
          width: 200,
          key: 'archived',
          show: false,
        },
        {
          title: __('归档时间'),
          width: 200,
          key: 'archived_date',
          show: false,
        },
        {
          title: __('排序'),
          width: 200,
          key: 'sort',
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
