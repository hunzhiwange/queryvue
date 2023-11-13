export default [
  {
    key: 'name',
    name: __('员工名称'),
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
    key: 'password',
    name: __('密码'),
    type: 'input_password',
    span: 12,
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
    type: 'select',
    span: 12,
    meta: {
      url: 'user:user/enum/status',
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
