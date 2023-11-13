export default [
  {
    key: 'key',
    name: `${__('标题')}/${__('编号')}`,
    type: 'input_search',
    width: 2,
  },
  {
    key: 'title',
    name: __('标题'),
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
    key: 'level',
    name: __('优先级别'),
    type: 'select_multiple',
    search: 'in',
    meta: {
      url: 'project:project_issue/enum/level',
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
    type: 'select',
    meta: {
      url: 'project:project_issue/enum/completed',
      key: 'value',
      value: 'msg',
      expire: 604800,
      params: {
        column: 'value,msg',
      },
    },
  },
  {
    key: 'end_date_max',
    width: 0,
    search: 'max',
  },
  {
    key: 'create_at_min',
    name: __('创建时间'),
    type: 'datetime_range',
    width: 2,
    search: 'min',
  },
  {
    key: 'create_at_max',
    width: 0,
    search: 'max',
  },
]
