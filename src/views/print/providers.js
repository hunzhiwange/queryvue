/* eslint-disable */
import { hiprint } from 'vue-plugin-hiprint'

// 默认模板
export const defaultProvider = function (ops) {
  var addElementTypes = function (context) {
    context.removePrintElementTypes('defaultProviderModule')
    context.addPrintElementTypes('defaultProviderModule', [
      new hiprint.PrintElementTypeGroup('默认', [
        {
          tid: 'defaultProviderModule.header',
          title: '单据表头',
          data: '单据表头',
          type: 'text',
          options: {
            testData: '单据表头',
            height: 17,
            fontSize: 16.5,
            fontWeight: '700',
            textAlign: 'center',
            hideTitle: true,
          },
        },
        {
          tid: 'defaultProviderModule.order_no',
          title: '订单编号',
          data: 'QP2023051600006',
          type: 'text',
          options: {
            field: 'order_no',
            testData: 'QP2023051600006',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'defaultProviderModule.client_no',
          title: '客户编号',
          data: '2002045',
          type: 'text',
          options: {
            field: 'client_no',
            testData: '2002045',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'defaultProviderModule.user.phone',
          title: '联系电话',
          data: '028-xxxx',
          type: 'text',
          options: {
            field: 'user.phone',
            testData: '',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'defaultProviderModule.user.contact',
          title: '联系人',
          data: '刘先生',
          type: 'text',
          options: {
            field: 'user.contact',
            testData: '刘先生',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'defaultProviderModule.user.address',
          title: '收货地址',
          data: '',
          type: 'text',
          options: {
            field: 'user.address',
            testData: '四川省成都市青羊区全家',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'defaultProviderModule.order_no_qrcode',
          title: '订单二维码',
          data: 'QP2023051600006',
          type: 'text',
          options: {
            field: 'order_no',
            testData: 'QP2023051600006',
            height: 32,
            fontSize: 12,
            lineHeight: 18,
            textType: 'qrcode',
          },
        },
        {
          tid: 'defaultProviderModule.create_at',
          title: '下单时间',
          data: '2023-05-15 22:05:19',
          type: 'text',
          options: {
            field: 'create_at',
            testData: '2023-05-15 22:05:19',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'defaultProviderModule.status_enum',
          title: '订单状态',
          data: '已提交',
          type: 'text',
          options: {
            field: 'status_enum',
            testData: '已提交',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'defaultProviderModule.pay_status_enum',
          title: '付款状态',
          data: '待支付',
          type: 'text',
          options: {
            field: 'pay_status_enum',
            testData: '待支付',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
      ]),
      new hiprint.PrintElementTypeGroup('其他', [
        {
          tid: 'defaultProviderModule.company.name',
          title: '公司名称',
          data: '公司名称',
          type: 'text',
          options: {
            testData: '公司名称',
            height: 17,
            fontSize: 16.5,
            fontWeight: '700',
            textAlign: 'center',
            hideTitle: true,
          },
        },
        {
          tid: 'defaultProviderModule.company.logo',
          title: '公司Logo',
          data: 'https://queryphp.gitee.io/hero.png',
          type: 'image',
        },
        {
          tid: 'defaultProviderModule.create_account_name',
          title: '制单人',
          data: '刘先生',
          type: 'text',
          options: {
            field: 'create_account_name',
            testData: '刘先生',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'defaultProviderModule.frameworkPrintDate',
          title: '打印时间',
          data: '2023-05-15 22:05:19',
          type: 'text',
          options: {
            field: 'frameworkPrintDate',
            testData: '2023-05-15 22:05:19',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
      ]),
      new hiprint.PrintElementTypeGroup('表格', [
        {
          tid: 'defaultProviderModule.frameworkTable',
          title: '订单数据',
          type: 'table',
          options: {
            field: 'table',
            tableHeaderRepeat: 'first',
            tableFooterRepeat: 'last',
            fields: [
              { text: '商品', field: 'product_title' },
              { text: '商品编号', field: 'spu_no' },
              { text: '规格编号', field: 'sku_no' },
              { text: '规格', field: 'product.sku_title' },
              { text: '单位', field: 'order_unit_name' },
              { text: '数量', field: 'order_unit_number' },
              { text: '单价', field: 'order_unit_purchase_price' },
              { text: '金额', field: 'settlement_amount' },
              { text: '备注', field: 'remark' },
            ],
          },
          editable: true,
          columnDisplayEditable: true, //列显示是否能编辑
          columnDisplayIndexEditable: true, //列顺序显示是否能编辑
          columnTitleEditable: true, //列标题是否能编辑
          columnResizable: true, //列宽是否能调整
          columnAlignEditable: true, //列对齐是否调整
          isEnableEditField: true, //编辑字段
          isEnableContextMenu: true, //开启右键菜单 默认true
          isEnableInsertRow: true, //插入行
          isEnableDeleteRow: true, //删除行
          isEnableInsertColumn: true, //插入列
          isEnableDeleteColumn: true, //删除列
          isEnableMergeCell: true, //合并单元格
          columns: [
            [
              {
                title: '商品',
                align: 'center',
                field: 'product_title',
                width: 150,
              },
              {
                title: '商品编号',
                align: 'center',
                field: 'spu_no',
                width: 150,
                checked: false,
              },
              {
                title: '规格编号',
                align: 'center',
                field: 'sku_no',
                width: 150,
              },
              {
                title: '规格',
                align: 'center',
                field: 'product.sku_title',
                width: 150,
              },
              {
                title: '单位',
                align: 'center',
                field: 'order_unit_name',
                width: 150,
              },
              {
                title: '数量',
                align: 'center',
                field: 'order_unit_number',
                width: 150,
                tableSummary: 'sum',
              },
              {
                title: '单价',
                align: 'center',
                field: 'order_unit_purchase_price',
                width: 150,
              },
              {
                title: '金额',
                align: 'center',
                field: 'settlement_amount',
                width: 150,
                tableSummary: 'sum',
              },
              {
                title: '备注',
                align: 'center',
                field: 'remark',
                width: 150,
                checked: false,
              },
            ],
          ],
          // rowsColumnsMerge: function (data, row, index) {
          //   // 返回一个数组,参数一为行（rowspan）合并数,参数二为列（colspan）合并数, 被合并的行或者列值设为0
          //   if (index == 0) {
          //     return [1, data.INDEX % 2 == 1 ? 2 : 1]
          //   } else if (index > 0 && index < 2) {
          //     return [data.INDEX % 2 == 1 ? 0 : 1, 1]
          //   } else {
          //     return [data.INDEX % 2 == 1 ? 2 : 0, 1]
          //   }
          // },
          footerFormatter: function (
            options,
            rows,
            data,
            currentPageGridRowsData,
          ) {
            if (data && data['totalCap']) {
              return `<td style="padding:0 10px" colspan="100">${
                '应收金额大写: ' + data['totalCap']
              }</td>`
            }
            return '<td style="padding:0 10px" colspan="100">应收金额大写: </td>'
          },
        },
      ]),
      new hiprint.PrintElementTypeGroup('辅助', [
        {
          tid: 'defaultProviderModule.frameworkCustomText',
          title: '文本',
          customText: '自定义文本',
          custom: true,
          type: 'text',
        },
        {
          tid: 'defaultProviderModule.frameworkLongText',
          title: '长文本',
          type: 'longText',
          options: {
            field: '',
            width: 200,
            testData: '长文本分页/不分页测试',
          },
        },
        {
          tid: 'defaultProviderModule.frameworkQrcode',
          title: '二维码',
          data: '',
          type: 'text',
          options: {
            field: '',
            testData: '',
            height: 32,
            fontSize: 12,
            lineHeight: 18,
            textType: 'qrcode',
          },
        },
        {
          tid: 'defaultProviderModule.frameworkImage',
          title: '图片',
          data: 'https://queryphp.gitee.io/hero.png',
          type: 'image',
        },
        {
          tid: 'defaultProviderModule.frameworkHline',
          title: '横线',
          type: 'hline',
        },
        {
          tid: 'defaultProviderModule.frameworkVline',
          title: '竖线',
          type: 'vline',
        },
        {
          tid: 'defaultProviderModule.frameworkRect',
          title: '矩形',
          type: 'rect',
        },
        {
          tid: 'defaultProviderModule.frameworkOval',
          title: '椭圆',
          type: 'oval',
        },
      ]),
    ])
  }
  return {
    addElementTypes: addElementTypes,
  }
}

// 订单模板
export const ordersProvider = function (ops) {
  var addElementTypes = function (context) {
    context.removePrintElementTypes('ordersProviderModule')
    context.addPrintElementTypes('ordersProviderModule', [
      new hiprint.PrintElementTypeGroup('订单', [
        {
          tid: 'ordersProviderModule.header',
          title: '单据表头',
          data: '单据表头',
          type: 'text',
          options: {
            testData: '单据表头',
            height: 17,
            fontSize: 16.5,
            fontWeight: '700',
            textAlign: 'center',
            hideTitle: true,
          },
        },
        {
          tid: 'ordersProviderModule.order_no',
          title: '订单编号',
          data: 'QP2023051600006',
          type: 'text',
          options: {
            field: 'order_no',
            testData: 'QP2023051600006',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'ordersProviderModule.client_no',
          title: '客户编号',
          data: '2002045',
          type: 'text',
          options: {
            field: 'client_no',
            testData: '2002045',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'ordersProviderModule.user.phone',
          title: '联系电话',
          data: '028-xxxx',
          type: 'text',
          options: {
            field: 'user.phone',
            testData: '',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'ordersProviderModule.user.contact',
          title: '联系人',
          data: '刘先生',
          type: 'text',
          options: {
            field: 'user.contact',
            testData: '刘先生',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'ordersProviderModule.user.address',
          title: '收货地址',
          data: '',
          type: 'text',
          options: {
            field: 'user.address',
            testData: '四川省成都市青羊区全家',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'ordersProviderModule.order_no_qrcode',
          title: '订单二维码',
          data: 'QP2023051600006',
          type: 'text',
          options: {
            field: 'order_no',
            testData: 'QP2023051600006',
            height: 32,
            fontSize: 12,
            lineHeight: 18,
            textType: 'qrcode',
          },
        },
        {
          tid: 'ordersProviderModule.create_at',
          title: '下单时间',
          data: '2023-05-15 22:05:19',
          type: 'text',
          options: {
            field: 'create_at',
            testData: '2023-05-15 22:05:19',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'ordersProviderModule.status_enum',
          title: '订单状态',
          data: '已提交',
          type: 'text',
          options: {
            field: 'status_enum',
            testData: '已提交',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'ordersProviderModule.pay_status_enum',
          title: '付款状态',
          data: '待支付',
          type: 'text',
          options: {
            field: 'pay_status_enum',
            testData: '待支付',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
      ]),
      new hiprint.PrintElementTypeGroup('其他', [
        {
          tid: 'ordersProviderModule.company.name',
          title: '公司名称',
          data: '公司名称',
          type: 'text',
          options: {
            testData: '公司名称',
            height: 17,
            fontSize: 16.5,
            fontWeight: '700',
            textAlign: 'center',
            hideTitle: true,
          },
        },
        {
          tid: 'ordersProviderModule.company.logo',
          title: '公司Logo',
          data: 'https://queryphp.gitee.io/hero.png',
          type: 'image',
        },
        {
          tid: 'ordersProviderModule.create_account_name',
          title: '制单人',
          data: '刘先生',
          type: 'text',
          options: {
            field: 'create_account_name',
            testData: '刘先生',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'ordersProviderModule.frameworkPrintDate',
          title: '打印时间',
          data: '2023-05-15 22:05:19',
          type: 'text',
          options: {
            field: 'frameworkPrintDate',
            testData: '2023-05-15 22:05:19',
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
      ]),
      new hiprint.PrintElementTypeGroup('表格', [
        {
          tid: 'ordersProviderModule.frameworkTable',
          title: '订单数据',
          type: 'table',
          options: {
            field: 'table',
            tableHeaderRepeat: 'first',
            tableFooterRepeat: 'last',
            fields: [
              { text: '商品', field: 'product_title' },
              { text: '商品编号', field: 'spu_no' },
              { text: '规格编号', field: 'sku_no' },
              { text: '规格', field: 'product.sku_title' },
              { text: '单位', field: 'order_unit_name' },
              { text: '数量', field: 'order_unit_number' },
              { text: '单价', field: 'order_unit_purchase_price' },
              { text: '金额', field: 'settlement_amount' },
              { text: '备注', field: 'remark' },
            ],
          },
          editable: true,
          columnDisplayEditable: true, //列显示是否能编辑
          columnDisplayIndexEditable: true, //列顺序显示是否能编辑
          columnTitleEditable: true, //列标题是否能编辑
          columnResizable: true, //列宽是否能调整
          columnAlignEditable: true, //列对齐是否调整
          isEnableEditField: true, //编辑字段
          isEnableContextMenu: true, //开启右键菜单 默认true
          isEnableInsertRow: true, //插入行
          isEnableDeleteRow: true, //删除行
          isEnableInsertColumn: true, //插入列
          isEnableDeleteColumn: true, //删除列
          isEnableMergeCell: true, //合并单元格
          columns: [
            [
              {
                title: '商品',
                align: 'center',
                field: 'product_title',
                width: 150,
              },
              {
                title: '商品编号',
                align: 'center',
                field: 'spu_no',
                width: 150,
                checked: false,
              },
              {
                title: '规格编号',
                align: 'center',
                field: 'sku_no',
                width: 150,
              },
              {
                title: '规格',
                align: 'center',
                field: 'product.sku_title',
                width: 150,
              },
              {
                title: '单位',
                align: 'center',
                field: 'order_unit_name',
                width: 150,
              },
              {
                title: '数量',
                align: 'center',
                field: 'order_unit_number',
                width: 150,
                tableSummary: 'sum',
              },
              {
                title: '单价',
                align: 'center',
                field: 'order_unit_purchase_price',
                width: 150,
              },
              {
                title: '金额',
                align: 'center',
                field: 'settlement_amount',
                width: 150,
                tableSummary: 'sum',
              },
              {
                title: '备注',
                align: 'center',
                field: 'remark',
                width: 150,
                checked: false,
              },
            ],
          ],
          // rowsColumnsMerge: function (data, row, index) {
          //   // 返回一个数组,参数一为行（rowspan）合并数,参数二为列（colspan）合并数, 被合并的行或者列值设为0
          //   if (index == 0) {
          //     return [1, data.INDEX % 2 == 1 ? 2 : 1]
          //   } else if (index > 0 && index < 2) {
          //     return [data.INDEX % 2 == 1 ? 0 : 1, 1]
          //   } else {
          //     return [data.INDEX % 2 == 1 ? 2 : 0, 1]
          //   }
          // },
          footerFormatter: function (
            options,
            rows,
            data,
            currentPageGridRowsData,
          ) {
            if (data && data['totalCap']) {
              return `<td style="padding:0 10px" colspan="100">${
                '应收金额大写: ' + data['totalCap']
              }</td>`
            }
            return '<td style="padding:0 10px" colspan="100">应收金额大写: </td>'
          },
        },
      ]),
      new hiprint.PrintElementTypeGroup('辅助', [
        {
          tid: 'ordersProviderModule.frameworkCustomText',
          title: '文本',
          customText: '自定义文本',
          custom: true,
          type: 'text',
        },
        {
          tid: 'ordersProviderModule.frameworkLongText',
          title: '长文本',
          type: 'longText',
          options: {
            field: '',
            width: 200,
            testData: '长文本分页/不分页测试',
          },
        },
        {
          tid: 'ordersProviderModule.frameworkQrcode',
          title: '二维码',
          data: '',
          type: 'text',
          options: {
            field: '',
            testData: '',
            height: 32,
            fontSize: 12,
            lineHeight: 18,
            textType: 'qrcode',
          },
        },
        {
          tid: 'ordersProviderModule.frameworkImage',
          title: '图片',
          data: 'https://queryphp.gitee.io/hero.png',
          type: 'image',
        },
        {
          tid: 'ordersProviderModule.frameworkHline',
          title: '横线',
          type: 'hline',
        },
        {
          tid: 'ordersProviderModule.frameworkVline',
          title: '竖线',
          type: 'vline',
        },
        {
          tid: 'ordersProviderModule.frameworkRect',
          title: '矩形',
          type: 'rect',
        },
        // {
        //   tid: 'ordersProviderModule.frameworkOval',
        //   title: '椭圆',
        //   type: 'oval',
        // },
      ]),
    ])
  }
  return {
    addElementTypes: addElementTypes,
  }
}

// type: 0=默认模板;
export default [
  {
    name: '默认模板',
    value: 'defaultProviderModule',
    type: 0,
    f: defaultProvider(),
  },
  // {
  //   name: '订单模板',
  //   value: 'ordersProviderModule',
  //   type: 1,
  //   f: ordersProvider(),
  // },
]
