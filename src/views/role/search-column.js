export default [
  {
    key: 'key',
    name: `${__('角色名字')}/${__('编号')}`,
    type: 'input_search',
    width: 2,
  },
  {
    key: 'name',
    name: __('角色名字'),
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
    key: 'status',
    name: __('状态'),
    type: 'select',
    width: 2,
    search: 'in',
    meta: {
      url: 'user:role/enum/status',
      key: 'value',
      value: 'msg',
      expire: 604800,
    },
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
