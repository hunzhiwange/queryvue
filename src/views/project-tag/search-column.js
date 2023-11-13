export default [
  {
    key: 'key',
    name: __('标签名称'),
    type: 'input_search',
    width: 2,
  },
  {
    key: 'status',
    name: __('状态'),
    type: 'select',
    meta: {
      url: 'project:project_tag/enum/status',
      key: 'value',
      value: 'msg',
      expire: 604800,
      params: {
        column: 'value,msg',
      },
    },
  },
]
