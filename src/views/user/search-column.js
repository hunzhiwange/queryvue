export default [
  {
    key: 'key',
    name: `${__('员工名字')}/${__('编号')}/${__('手机')}/${__('联系人')}/${__(
      '电话',
    )}`,
    type: 'input_search',
    width: 2,
  },
  {
    key: 'name',
    name: __('员工名字'),
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
    key: 'contact',
    name: __('联系人'),
    type: 'input',
    search: 'like',
  },
  {
    key: 'mobile',
    name: __('手机'),
    type: 'input',
    search: 'like',
  },
  {
    key: 'sub_type',
    name: __('账号类型'),
    type: 'select_multiple',
    search: 'in',
    meta: {
      url: 'user:user/enum/sub_type',
      key: 'value',
      value: 'msg',
      expire: 604800,
    },
  },
  {
    key: 'status',
    name: __('状态'),
    type: 'select_multiple',
    search: 'in',
    meta: {
      url: 'user:user/enum/status',
      key: 'value',
      value: 'msg',
      expire: 604800,
    },
  },
  {
    key: 'email',
    name: __('Email'),
    type: 'input',
    search: 'like',
  },
  {
    key: 'phone',
    name: __('电话'),
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
