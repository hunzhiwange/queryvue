export default [
  {
    key: 'name',
    name: __('模块名称'),
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
      url: 'project:project_module/enum/status',
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
    key: 'color',
    name: __('模块颜色'),
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
]
