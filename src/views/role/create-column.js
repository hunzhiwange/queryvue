export default [
  {
    key: 'name',
    name: __('角色名字'),
    type: 'input',
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
    type: 'switch',
    span: 12,
    meta: {
      url: 'user:role/enum/status',
      key: 'value',
      value: 'msg',
      expire: 604800,
    },
    rules: [
      {
        required: true,
      },
    ],
  },
]
