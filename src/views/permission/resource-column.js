export default [
  {
    key: 'resource_id',
    name: __('权限资源'),
    type: 'dialog',
    span: 12,
    meta: {
      component: 'resource/index',
      key: 'id',
      value: 'name',
    },
    help: __('资源可以不选，不选则表示没有任何资源'),
  },
]
