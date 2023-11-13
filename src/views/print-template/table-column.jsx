export default {
  data() {
    return {
      columns: [
        {
          title: __('选项'),
          type: 'selection',
          key: 'framework_selection',
          width: 55,
          align: 'center',
          fixed: 'left',
        },
        {
          title: __('序号'),
          type: 'index',
          key: 'framework_index',
          width: 80,
          align: 'center',
          fixed: 'left',
          show: false,
        },
        {
          title: __('模板名称'),
          minWidth: 200,
          width: 0,
          key: 'name',
        },
        {
          title: __('默认模板'),
          width: 200,
          key: 'is_default_enum',
          db_column: 'is_default',
        },
        {
          title: __('模板类型'),
          width: 200,
          key: 'type_enum',
          db_column: 'type',
        },
        {
          title: __('备注'),
          width: 200,
          key: 'remark',
          show: false,
        },
        {
          title: __('创建时间'),
          width: 200,
          key: 'create_at',
          show: false,
        },
        {
          title: __('操作'),
          key: 'framework_action',
          slot: 'action',
          width: 75,
          align: 'left',
          fixed: 'right',
        },
      ],
    }
  },
}
