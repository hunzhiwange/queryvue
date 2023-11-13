export default {
  data() {
    return {
      columns: [
        {
          title: __('序号'),
          type: 'index',
          key: 'framework_index',
          width: 80,
          align: 'center',
        },
        {
          title: __('名字'),
          width: 0,
          minWidth: 300,
          key: 'name',
          tree: true,
        },
        {
          title: __('编号'),
          width: 300,
          key: 'num',
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
          fixed: 'right',
          align: 'left',
        },
      ],
    }
  },
}
