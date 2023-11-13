export default [
  {
    key: 'title',
    name: __('标题'),
    type: 'input',
    span: 12,
    help: __('undefined'),
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'sub_title',
    name: __('子标题'),
    type: 'input',
    span: 12,
    help: __('undefined'),
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'num',
    name: __('编号'),
    type: 'input',
    span: 12,
    help: __('例如 ISSUE-1101'),
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'project_id',
    name: __('项目ID'),
    type: 'input_number',
    meta: {
      min: 0,
    },
    span: 12,
    help: __('undefined'),
    default_value: 0,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'project_label_id',
    name: __('项目分类ID'),
    type: 'input_number',
    meta: {
      min: 0,
    },
    span: 12,
    help: __('undefined'),
    default_value: 0,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'project_type_id',
    name: __('项目问题类型ID'),
    type: 'input_number',
    meta: {
      min: 0,
    },
    span: 12,
    help: __('undefined'),
    default_value: 0,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'owner_user_id',
    name: __('负责人用户ID'),
    type: 'input_number',
    meta: {
      min: 0,
    },
    span: 12,
    help: __('undefined'),
    default_value: 0,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'project_log_id',
    name: __('项目日志ID'),
    type: 'input_number',
    meta: {
      min: 0,
    },
    span: 12,
    help: __('undefined'),
    default_value: 0,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'desc',
    name: __('描述'),
    type: 'input',
    span: 12,
    help: __('undefined'),
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'level',
    name: __('优先级别'),
    type: 'select',
    span: 12,
    meta: {
      url: 'project:project_issue/enum/level',
      key: 'value',
      value: 'msg',
      expire: 604800,
    },
    help: __('1~5'),
    default_value: 1,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'completed',
    name: __('是否完成'),
    type: 'select',
    span: 12,
    meta: {
      url: 'project:project_issue/enum/completed',
      key: 'value',
      value: 'msg',
      expire: 604800,
    },
    help: __('1=未完成;2=已完成;'),
    default_value: 1,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'completed_date',
    name: __('完成时间'),
    type: 'datetime_range',
    span: 12,
    help: __('undefined'),
    default_value: '1000-01-01 00:00:00',
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'sub_task',
    name: __('子任务列表'),
    type: 'input',
    span: 12,
    help: __('undefined'),
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'follower',
    name: __('关注人列表'),
    type: 'input',
    span: 12,
    help: __('undefined'),
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'file_number',
    name: __('附件数量'),
    type: 'input_number',
    meta: {
      min: 0,
    },
    span: 12,
    help: __('undefined'),
    default_value: 0,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'start_date',
    name: __('计划开始时间'),
    type: 'datetime_range',
    span: 12,
    help: __('undefined'),
    default_value: '1000-01-01 00:00:00',
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'end_date',
    name: __('计划结束时间'),
    type: 'datetime_range',
    span: 12,
    help: __('undefined'),
    default_value: '1000-01-01 00:00:00',
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'archived',
    name: __('是否归档'),
    type: 'input_number',
    meta: {
      min: 0,
    },
    span: 12,
    help: __('1=未归档;2=已归档;'),
    default_value: 1,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'archived_date',
    name: __('归档时间'),
    type: 'datetime_range',
    span: 12,
    help: __('undefined'),
    default_value: '1000-01-01 00:00:00',
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'sort',
    name: __('排序'),
    type: 'input_number',
    meta: {
      min: 0,
    },
    span: 12,
    help: __('DESC'),
    default_value: 0,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'user_sort',
    name: __('会员自己的排序'),
    type: 'input_number',
    meta: {
      min: 0,
    },
    span: 12,
    help: __('DESC'),
    default_value: 0,
    rules: [
      {
        required: true,
      },
    ],
  },
]
