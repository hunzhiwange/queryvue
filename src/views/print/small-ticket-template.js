export default {
  panels: [
    {
      index: 0,
      name: 1,
      height: 400,
      width: 112,
      paperHeader: 0,
      paperFooter: 1133.8582677165355,
      printElements: [
        {
          options: {
            left: 96,
            top: 19.5,
            height: 17,
            width: 120,
            fontSize: 16.5,
            fontWeight: '700',
            textAlign: 'center',
            hideTitle: true,
            title: '订货单',
            right: 215.25,
            bottom: 35.75,
            vCenter: 155.25,
            hCenter: 27.25,
            coordinateSync: false,
            widthHeightSync: false,
            qrCodeLevel: 0,
          },
          printElementType: {
            title: '单据表头',
            type: 'text',
          },
        },
        {
          options: {
            left: 19.5,
            top: 51,
            height: 9,
            width: 274.5,
            right: 294,
            bottom: 60,
            vCenter: 156.75,
            hCenter: 55.5,
            coordinateSync: false,
            widthHeightSync: false,
            borderStyle: 'dashed',
          },
          printElementType: {
            title: '横线',
            type: 'hline',
          },
        },
        {
          options: {
            left: 19.5,
            top: 60,
            height: 16,
            width: 274.5,
            field: 'client_no',
            testData: '2002045',
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
            title: '客户编号',
            right: 141.75,
            bottom: 78.25,
            vCenter: 81.75,
            hCenter: 70.25,
          },
          printElementType: {
            title: '客户编号',
            type: 'text',
          },
        },
        {
          options: {
            left: 19.5,
            top: 84,
            height: 16,
            width: 274.5,
            field: 'user.contact',
            testData: '刘先生',
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
            title: '联系人',
            right: 138.75,
            bottom: 99.25,
            vCenter: 78.75,
            hCenter: 91.25,
          },
          printElementType: {
            title: '联系人',
            type: 'text',
          },
        },
        {
          options: {
            left: 19.5,
            top: 111,
            height: 16,
            width: 274.5,
            field: 'create_account_name',
            testData: '刘先生',
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
            title: '制单人',
            right: 138.75,
            bottom: 127,
            vCenter: 78.75,
            hCenter: 119,
          },
          printElementType: {
            title: '制单人',
            type: 'text',
          },
        },
        {
          options: {
            left: 19.5,
            top: 135,
            height: 16,
            width: 274.5,
            field: 'order_no',
            testData: 'QP2023051600006',
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
            title: '订单编号',
            right: 139.5,
            bottom: 157,
            vCenter: 79.5,
            hCenter: 149,
          },
          printElementType: {
            title: '订单编号',
            type: 'text',
          },
        },
        {
          options: {
            left: 18,
            top: 159,
            height: 16,
            width: 276,
            field: 'create_at',
            testData: '2023-05-15 22:05:19',
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
            title: '下单时间',
            right: 291,
            bottom: 174.25,
            vCenter: 153,
            hCenter: 166.25,
          },
          printElementType: {
            title: '下单时间',
            type: 'text',
          },
        },
        {
          options: {
            left: 18,
            top: 183,
            height: 9,
            width: 274.5,
            right: 289.5,
            bottom: 191.25,
            vCenter: 152.25,
            hCenter: 186.75,
            coordinateSync: false,
            widthHeightSync: false,
            borderStyle: 'dashed',
          },
          printElementType: {
            title: '横线',
            type: 'hline',
          },
        },
        {
          options: {
            left: 18,
            top: 192,
            height: 16,
            width: 273,
            field: 'user.contact',
            testData: '刘先生',
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
            title: '联系人',
            right: 138,
            bottom: 211,
            vCenter: 78,
            hCenter: 203,
          },
          printElementType: {
            title: '联系人',
            type: 'text',
          },
        },
        {
          options: {
            left: 18,
            top: 217.5,
            height: 16,
            width: 274.5,
            field: 'user.phone',
            testData: '',
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
            title: '联系电话',
            right: 289.5,
            bottom: 232.75,
            vCenter: 152.25,
            hCenter: 224.75,
          },
          printElementType: {
            title: '联系电话',
            type: 'text',
          },
        },
        {
          options: {
            left: 18,
            top: 244.5,
            height: 16.5,
            width: 273,
            field: 'user.address',
            testData: '四川省成都市青羊区全家',
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
            title: '收货地址',
            right: 138.75,
            bottom: 260.5,
            vCenter: 78.75,
            hCenter: 252.5,
          },
          printElementType: {
            title: '收货地址',
            type: 'text',
          },
        },
        {
          options: {
            left: 16.5,
            top: 268.5,
            height: 9,
            width: 274.5,
            right: 292.74609375,
            bottom: 277.74609375,
            vCenter: 155.49609375,
            hCenter: 273.24609375,
            coordinateSync: false,
            widthHeightSync: false,
            borderStyle: 'dashed',
          },
          printElementType: {
            title: '横线',
            type: 'hline',
          },
        },
        {
          options: {
            left: 16.5,
            top: 279,
            height: 52.5,
            width: 274.5,
            tableFooterRepeat: 'last',
            field: 'table',
            tableHeaderRepeat: 'first',
            fields: [
              {
                text: '商品',
                field: 'product_title',
              },
              {
                text: '商品编号',
                field: 'spu_no',
              },
              {
                text: '规格编号',
                field: 'sku_no',
              },
              {
                text: '规格',
                field: 'product.sku_title',
              },
              {
                text: '单位',
                field: 'order_unit_name',
              },
              {
                text: '数量',
                field: 'order_unit_number',
              },
              {
                text: '单价',
                field: 'order_unit_purchase_price',
              },
              {
                text: '金额',
                field: 'settlement_amount',
              },
              {
                text: '备注',
                field: 'remark',
              },
            ],
            coordinateSync: false,
            widthHeightSync: false,
            tableBodyRowBorder: 'noBorder',
            tableBorder: 'noBorder',
            tableHeaderBorder: 'noBorder',
            tableHeaderCellBorder: 'noBorder',
            tableHeaderBackground: '#ffffff',
            tableBodyCellBorder: 'noBorder',
            tableFooterBorder: 'noBorder',
            tableFooterCellBorder: 'noBorder',
            columns: [
              [
                {
                  width: 68.625,
                  title: '商品',
                  field: 'product_title',
                  checked: true,
                  columnId: 'product_title',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'left',
                  halign: 'left',
                  tableQRCodeLevel: 0,
                  tableSummaryTitle: true,
                  tableSummary: '',
                },
                {
                  width: 69.375,
                  title: '单价',
                  field: 'order_unit_purchase_price',
                  checked: true,
                  columnId: 'order_unit_purchase_price',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'right',
                  halign: 'right',
                  tableQRCodeLevel: 0,
                  tableSummaryTitle: true,
                  tableSummary: '',
                },
                {
                  width: 67.875,
                  title: '数量',
                  field: 'order_unit_number',
                  checked: true,
                  columnId: 'order_unit_number',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'right',
                  halign: 'right',
                  tableQRCodeLevel: 0,
                  tableSummaryTitle: true,
                  tableSummary: 'sum',
                },
                {
                  width: 68.625,
                  title: '金额',
                  field: 'settlement_amount',
                  checked: true,
                  columnId: 'settlement_amount',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'right',
                  halign: 'right',
                  tableQRCodeLevel: 0,
                  tableSummaryTitle: true,
                  tableSummary: 'sum',
                },
                {
                  width: 150,
                  title: '商品编号',
                  field: 'spu_no',
                  checked: false,
                  columnId: 'spu_no',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'center',
                },
                {
                  width: 150,
                  title: '规格编号',
                  field: 'sku_no',
                  checked: false,
                  columnId: 'sku_no',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'center',
                },
                {
                  width: 150,
                  title: '规格',
                  field: 'product.sku_title',
                  checked: false,
                  columnId: 'product.sku_title',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'center',
                },
                {
                  width: 150,
                  title: '单位',
                  field: 'order_unit_name',
                  checked: false,
                  columnId: 'order_unit_name',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'center',
                },
                {
                  width: 150,
                  title: '备注',
                  field: 'remark',
                  checked: false,
                  columnId: 'remark',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'center',
                },
              ],
            ],
          },
          printElementType: {
            title: '订单数据',
            type: 'table',
            editable: true,
            columnDisplayEditable: true,
            columnDisplayIndexEditable: true,
            columnTitleEditable: true,
            columnResizable: true,
            columnAlignEditable: true,
            isEnableEditField: true,
            isEnableContextMenu: true,
            isEnableInsertRow: true,
            isEnableDeleteRow: true,
            isEnableInsertColumn: true,
            isEnableDeleteColumn: true,
            isEnableMergeCell: true,
          },
        },
        {
          options: {
            left: 16.5,
            top: 352.5,
            height: 9,
            width: 274.5,
            right: 291.99609375,
            bottom: 361.74609375,
            vCenter: 154.74609375,
            hCenter: 357.24609375,
            coordinateSync: false,
            widthHeightSync: false,
            borderStyle: 'dashed',
          },
          printElementType: {
            title: '横线',
            type: 'hline',
          },
        },
        {
          options: {
            left: 88.5,
            top: 361.5,
            height: 9.75,
            width: 123,
            title: '****欢迎再次下单****',
            right: 211.5,
            bottom: 374.25,
            vCenter: 150,
            hCenter: 369.375,
            coordinateSync: false,
            widthHeightSync: false,
            fontSize: 12,
            fontWeight: 'bolder',
            qrCodeLevel: 0,
          },
          printElementType: {
            title: '文本',
            type: 'text',
          },
        },
      ],
      paperNumberLeft: 310,
      paperNumberTop: 819,
      watermarkOptions: {},
    },
  ],
}
