export default [
  {
    key: 'permission_id',
    name: __('角色权限'),
    type: 'tree_multiple',
    span: 12,
    meta: {
      url: 'user:permission/list-only',
      key: 'id',
      value: 'name',
      parent_key: 'parent_id',
      expire: 0,
    },
    help: __('权限可以不选，不选则表示没有任何权限'),
  },
]
