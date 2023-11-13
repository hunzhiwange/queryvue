export default [
  {
    key: 'name',
    name: __('发行名称'),
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
    key: 'status',
    name: __('状态'),
    type: 'select',
    span: 12,
    meta: {
      url: 'project:project_release/enum/status',
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
    key: 'completed',
    name: __('是否完成'),
    type: 'select',
    span: 12,
    meta: {
      url: 'project:project_release/enum/completed',
      key: 'value',
      value: 'msg',
      expire: 604800,
    },
    help: __('1=未开始;2=进行中;3=延期发布;4=已发布;'),
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
]
