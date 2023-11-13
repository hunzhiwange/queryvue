export default [
  {
    key: 'name',
    name: __('模板名称'),
    type: 'input',
    span: 12,
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'type',
    name: __('模板类型'),
    type: 'select',
    span: 12,
    meta: {
      url: 'print:print_template/enum/type',
      key: 'value',
      value: 'msg',
      expire: 0,
    },
    default_value: 0,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'remark',
    name: __('备注'),
    type: 'input',
    span: 24,
  },
]
