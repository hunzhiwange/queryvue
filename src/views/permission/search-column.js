export default [
  {
    key: 'key',
    name: `${__('权限编号')}/${__('权限名字')}`,
    type: 'input_search',
    width: 2,
  },
  {
    key: 'name',
    name: __('权限名字'),
    type: 'input',
    search: 'like',
  },
  {
    key: 'num',
    name: __('权限编号'),
    type: 'input',
    search: 'like',
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
