export default [
  {
    key: 'key',
    name: __('模块名称'),
    type: 'input_search',
    width: 2,
  },
  {
    key: 'status',
    name: __('状态'),
    type: 'select',
    meta: {
      url: 'project:project_module/enum/status',
      key: 'value',
      value: 'msg',
      expire: 604800,
    },
  },
]
