export default [
  {
    key: 'name',
    name: __('类型名称'),
    type: 'input',
    span: 12,
    help: __('undefined'),
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'num',
    name: __('编号'),
    type: 'input',
    span: 12,
    help: __('undefined'),
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'content_type',
    name: __('内容类型'),
    type: 'select',
    span: 12,
    meta: {
      url: 'project:project_type/enum/content_type',
      key: 'value',
      value: 'msg',
      expire: 604800,
    },
    help: __(
      '1=BUG;2=任务;3=需求;4=故事;5=文档;6=流程图;7=思维导图;8=Swagger内容;9=Swagger网址;',
    ),
    default_value: 1,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'color',
    name: __('颜色'),
    type: 'input',
    span: 12,
    help: __('undefined'),
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'status',
    name: __('状态'),
    type: 'select',
    span: 12,
    meta: {
      url: 'project:project_type/enum/status',
      key: 'value',
      value: 'msg',
      expire: 604800,
    },
    help: __('0=禁用;1=启用;'),
    default_value: 1,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'sort',
    name: __('排序'),
    type: 'input_number',
    meta: {
      min: 0,
    },
    span: 12,
    help: __('DESC'),
    default_value: 0,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    key: 'icon',
    name: __('类型图标'),
    type: 'input',
    span: 12,
    help: __('undefined'),
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
]
