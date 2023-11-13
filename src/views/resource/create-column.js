export default [
  {
    key: 'name',
    name: __('资源名字'),
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
    type: 'select',
    span: 12,
    meta: {
      url: 'user:resource/enum/status',
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
