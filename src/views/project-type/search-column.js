export default [
  {
    key: 'key',
    name: `${__('类型名称')}/${__('编号')}`,
    type: 'input_search',
    width: 2,
  },
  {
    key: 'name',
    name: __('类型名称'),
    type: 'input',
    search: 'like',
  },
  {
    key: 'num',
    name: __('编号'),
    type: 'input',
    search: 'like',
  },
  {
    key: 'content_type',
    name: __('内容类型'),
    type: 'select_multiple',
    search: 'in',
    meta: {
      url: 'project:project_type/enum/content_type',
      key: 'value',
      value: 'msg',
      expire: 604800,
      params: {
        column: 'value,msg',
      },
    },
  },
  {
    key: 'status',
    name: __('状态'),
    type: 'select',
    meta: {
      url: 'project:project_type/enum/status',
      key: 'value',
      value: 'msg',
      expire: 604800,
      params: {
        column: 'value,msg',
      },
    },
  },
]
