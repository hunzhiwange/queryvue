export default [
  {
    key: 'name',
    name: __('权限名字'),
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
    key: 'parent_id',
    name: __('父级'),
    type: 'tree_select',
    span: 12,
    meta: {
      url: 'user:permission/list-only',
      key: 'id',
      value: 'name',
      parent_key: 'parent_id',
      expire: 0,
    },
    help: __('不选择父级则为顶级权限'),
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
      url: 'user:permission/enum/status',
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
