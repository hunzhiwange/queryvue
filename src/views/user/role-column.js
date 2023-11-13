export default [
  {
    key: 'role_id',
    name: __('员工角色'),
    type: 'dialog',
    span: 12,
    meta: {
      component: 'role/index',
      key: 'id',
      value: 'name',
    },
    help: __('角色可以不选，不选则表示没有任何角色'),
  },
]
