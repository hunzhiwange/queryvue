export default [
  {
    key: 'name',
    name: __('项目名称'),
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
    help: __('undefined'),
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'status',
    name: __('状态'),
    type: 'select',
    span: 12,
    meta: {
      url: 'project:project/enum/status',
      key: 'value',
      value: 'msg',
      expire: 604800,
    },
    help: __('0=禁用;1=启用;'),
    default_value: 1,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'progress',
    name: __('进度条'),
    type: 'input_number',
    meta: {
      min: 0,
    },
    span: 12,
    help: __('最大值 10000，需要除以 100 表示实际进度'),
    default_value: 0,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'owner_user_id',
    name: __('项目所有者用户ID'),
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
    key: 'completed_number',
    name: __('已完成任务数量'),
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
    key: 'unfinished_number',
    name: __('未完成任务数量'),
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
]
