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
          title: __('员工名字'),
          width: 200,
          key: 'name',
        },
        {
          title: __('编号'),
          width: 200,
          key: 'num',
          render: (h, params) => {
            return <tag color="default">{params.row.num}</tag>
          },
        },
        {
          title: __('角色'),
          key: 'num',
          width: 300,
          render: (h, params) => {
            return (
              <div>
                {params.row.role.map((item) => {
                  return <Tag color="green">{item.name}</Tag>
                })}
              </div>
            )
          },
        },
        {
          title: __('账号类型'),
          width: 200,
          key: 'sub_type_enum',
          db_column: 'sub_type',
        },
        {
          title: __('状态'),
          width: 200,
          key: 'status_enum',
          render: (h, params) => {
            return (
              <Badge
                status={1 === params.row.status ? 'success' : 'default'}
                text={params.row.status_enum}
              />
            )
          },
          db_column: 'status',
        },
        {
          title: __('手机'),
          width: 200,
          key: 'mobile',
          show: false,
        },
        {
          title: __('联系人'),
          width: 200,
          key: 'contact',
          show: false,
        },
        {
          title: __('电话'),
          width: 200,
          key: 'phone',
          show: false,
        },
        {
          title: __('Email'),
          width: 200,
          key: 'email',
          show: false,
        },
        {
          title: __('地址区域'),
          width: 200,
          key: 'city.merger_name',
        },
        {
          title: __('联系地址'),
          width: 200,
          key: 'address',
          show: false,
        },
        {
          title: __('创建时间'),
          width: 200,
          key: 'create_at',
        },
        {
          title: __('备注'),
          width: 200,
          key: 'remark',
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
