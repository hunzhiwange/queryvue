export default [
  {
    key: 'key',
    name: `${__('模板名称')}/${__('备注')}`,
    type: 'input_search',
    width: 2,
  },
  {
    key: 'name',
    name: __('模板名称'),
    type: 'input',
    search: 'like',
  },
  {
    key: 'type',
    name: __('模板类型'),
    type: 'select_multiple',
    search: 'in',
    meta: {
      url: 'print:print_template/enum/type',
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
