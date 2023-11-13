export default [
  {
    key: 'key',
    name: __('发行名称'),
    type: 'input_search',
    width: 2,
  },
  {
    key: 'status',
    name: __('状态'),
    type: 'select',
    meta: {
      url: 'project:project_release/enum/status',
      key: 'value',
      value: 'msg',
      expire: 604800,
      params: {
        column: 'value,msg',
      },
    },
  },
  {
    key: 'completed',
    name: __('是否完成'),
    type: 'select_multiple',
    search: 'in',
    meta: {
      url: 'project:project_release/enum/completed',
      key: 'value',
      value: 'msg',
      expire: 604800,
      params: {
        column: 'value,msg',
      },
    },
  },
]
