export default [
  {
    key: 'name',
    name: __('分类名称'),
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
    key: 'status',
    name: __('状态'),
    type: 'select',
    span: 12,
    meta: {
      url: 'project:project_label/enum/status',
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
