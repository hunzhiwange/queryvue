<template>
  <Table
    fixed-shadow="false"
    :columns="columns"
    :data="data"
    :show-summary="true"
    :summary-method="handleSummary"
  />
</template>

<script lang="tsx">
import SearchDialog from '@/components/search/dialog'
import { multiply } from 'lodash'
import {
  renderCommon,
  renderImages,
  renderProductSkuTitle,
  renderProductTitle,
  renderSummary,
} from '../../../utils/render.jsx'

export default {
  components: {
    SearchDialog,
  },
  props: {
    currentValue: {},
    displayOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      productKey: {
        key: 'products',
        name: __('输入产品编号/规格编号/商品标题/副标题/规格标题'),
        type: 'dialog',
        meta: {
          component: 'product/index',
          key: 'id',
          value: 'sku_no',
          mustColumn: 'id,title,sku_no,spu_no,small_unit,sku_title,images',
          render: (h, params) => {
            let product = params.data

            return (
              <>
                <Space>
                  <Tooltip
                    placement="right-start"
                    theme="light"
                    transfer={true}
                    disabled={!product.images}
                    v-slots={{
                      content: () => (
                        <Image src={product.images} fit="contain" />
                      ),
                    }}
                  >
                    <Image
                      src={product.images}
                      fit="contain"
                      width="40px"
                      height="40px"
                      v-slots={{
                        error: () => (
                          <Icon type="md-images" size="40" color="#e5e6eb" />
                        ),
                      }}
                    />
                  </Tooltip>
                  <div>
                    <Tooltip
                      placement="top-start"
                      content={product.title}
                      max-width={500}
                      theme="light"
                      transfer={true}
                    >
                      <p
                        style={{ width: '300px' }}
                        className="overflow-ellipsis overflow-hidden"
                      >
                        {product.title}
                      </p>
                    </Tooltip>
                    <p>
                      <Text type="secondary">{product.spu_no}</Text>
                    </p>
                  </div>
                </Space>
                <div className="float-right text-right">
                  {product.sku_title ? (
                    <>
                      <Tooltip
                        placement="top-start"
                        content={product.sku_title}
                        max-width={500}
                        theme="light"
                        transfer={true}
                      >
                        <p
                          style={{ width: '200px' }}
                          className="overflow-ellipsis overflow-hidden"
                        >
                          {product.sku_title}
                        </p>
                      </Tooltip>
                    </>
                  ) : (
                    ''
                  )}
                  <p>
                    <Text type="secondary">{product.sku_no}</Text>
                  </p>
                </div>
              </>
            )
          },
        },
      },
      columns: [
        {
          title: __('序号'),
          key: 'framework_index_action',
          width: 90,
          align: 'center',
          className: 'i-curd-framework-index-action',
          render: (h, params) => {
            return (
              <div class={'rounded i-curd-table-status-' + params.row.status}>
                {params.index + 1}
                {params.row['sku_no'] ? (
                  <>
                    <ButtonGroup
                      class="i-curd-table-action-add-remove"
                      size="small"
                    >
                      <Button
                        type="default"
                        icon="md-add"
                        onClick={() => this.add(params.index)}
                      ></Button>
                      <Button
                        type="default"
                        icon="md-remove"
                        onClick={() => this.delete(params.index)}
                      ></Button>
                    </ButtonGroup>
                  </>
                ) : (
                  ''
                )}
              </div>
            )
          },
          renderHeaderHelper: () => (
            <>
              <p>
                1、现在，您可以通过鼠标悬停商品的序号单元格，在指定位置插入新商品或删除已有商品；
              </p>
              <p>
                2、已存在的商品状态显示为
                <Text type="danger">红色</Text>，而新增的商品状态则以
                <Text type="success">绿色</Text>展示；
              </p>
            </>
          ),
        },
        {
          title: __('图片'),
          width: 40,
          align: 'center',
          key: 'images',
          className: 'table-images',
          render: (h, params) => {
            if (!params.row['sku_no']) {
              return ''
            }

            return renderImages(h, params, { key: 'images' })
          },
        },
        {
          title: '商品',
          width: 0,
          minWidth: 500,
          key: 'title',
          render: (h, params) => {
            if (!params.row['sku_no']) {
              return (
                <>
                  <SearchDialog
                    placeholder={this.productKey.name}
                    onUpdateDataAll={(event) =>
                      this.updateDataAll(event, params.index)
                    }
                    onUpdateDataSingle={(event) =>
                      this.updateDataSingle(event, params.index)
                    }
                    onUpdateDataSingleList={this.updateDataSingleList}
                    currentValue={''}
                    cachedList={this.cachedList}
                    apiSource={this.productKey.meta}
                    currentField={this.productKey.key}
                    isMultiple={this.productKey.type === 'dialog'}
                    shouldUpdateDataAll={true}
                  />
                </>
              )
            }

            return renderProductTitle(h, params, { prefix: '' })
          },
        },
        {
          title: '规格',
          width: 0,
          minWidth: 200,
          key: 'sku_title',
          render: (h, params) => {
            if (!params.row['sku_no']) {
              return ''
            }

            return renderProductSkuTitle(h, params, { prefix: '' })
          },
        },
        {
          title: '单位',
          width: 0,
          minWidth: 70,
          key: 'small_unit',
        },
        {
          title: '数量',
          width: 0,
          minWidth: 100,
          key: 'unit_number',
          summary: true,
          render: (h, params) => {
            if (!params.row['sku_no']) {
              return ''
            }

            return (
              <InputNumber
                style="width:100%;"
                min="0"
                v-model={this.data[params.index]['unit_number']}
              />
            )
          },
        },
        {
          title: '单价',
          width: 0,
          minWidth: 100,
          key: 'price',
          render: (h, params) => {
            if (!params.row['sku_no']) {
              return ''
            }

            return (
              <InputNumber
                style="width:100%;"
                min="0"
                v-model={this.data[params.index]['price']}
              />
            )
          },
        },
        {
          title: '金额',
          width: 0,
          minWidth: 100,
          key: 'amount',
          summary: true,
          summary_unit: __('元'),
          render: (h, params) => {
            if (!params.row['sku_no']) {
              return ''
            }

            this.data[params.index]['amount'] = multiply(
              params.row['unit_number'],
              params.row['price'],
            )

            return this.data[params.index]['amount']
          },
        },
        {
          title: '备注',
          width: 70,
          key: 'remark',
          render: (h, params) => {
            if (!params.row['sku_no']) {
              return ''
            }

            return (
              <Tooltip
                theme="light"
                max-width="500"
                placement="top-end"
                transfer={true}
                v-slots={{
                  content: () => (
                    <div class="p-1">
                      <Title level={6}>{__('备注')}</Title>
                      <Input
                        type="textarea"
                        v-model={this.data[params.index]['remark']}
                        placeholder={__('请输入备注信息')}
                        style={{ width: '460px' }}
                        autosize={{ minRows: 3, maxRows: 6 }}
                        maxlength={100}
                        show-word-limit={true}
                      />
                    </div>
                  ),
                }}
              >
                <Icon
                  class="pointer"
                  size={18}
                  type="md-text"
                  color={params.row['remark'] ? '#19be6b' : ''}
                />
              </Tooltip>
            )
          },
        },
      ],
      data: [
        {
          // 记录状态（0=普通;1=新;2=已存在;）
          status: 0,
        },
      ],
      cachedList: null,
    }
  },
  methods: {
    add(index) {
      this.data.splice(index + 1, 0, {})
    },
    delete(index) {
      this.data.splice(index, 1)
    },
    updateSingleListDisabled() {
      if (null === this.cachedList) {
        return
      }

      let currentId = []
      this.data.forEach((item) => {
        currentId.push(item.id)
      })

      this.cachedList.forEach((item) => {
        if (currentId.includes(item.id)) {
          item.disabled = true
        } else {
          item.disabled = false
        }
      })
    },
    updateDataSingle(currentListAndList, index) {
      let currentList = currentListAndList[0]
      this.cachedList = currentListAndList[1]
      this.updateDataAll(currentList, index, true)
    },
    async updateDataAllAfter(currentList) {},
    updateLineDataAfter(lineData, item) {},
    updateDataAfter(lineItem, item) {},
    async updateDataAll(currentList, index, isSingle = false) {
      if (currentList.length === 0) {
        return
      }

      await this.updateDataAllAfter(currentList)

      let isLast = false
      if (index === this.data.length - 1) {
        isLast = true
      }

      let currentSkuNo = []
      this.data.forEach((item) => {
        item.status = 0
        currentSkuNo.push(item.sku_no)
      })

      let deleteCurrent = false
      currentList.forEach((item) => {
        let lineData = {
          id: item.id,
          title: item.title,
          sku_no: item.sku_no,
          spu_no: item.spu_no,
          images: item.images,
          small_unit: item.small_unit,
          sku_title: item.sku_title,
          unit_number: 1,
          price: 1.5,
          remark: '',
          status: 1,
        }
        this.updateLineDataAfter(lineData, item)

        if (currentSkuNo.includes(item.sku_no)) {
          let currentItem = this.data.find((tempItem) => {
            return tempItem.sku_no === item.sku_no
          })
          currentItem.status = 2

          this.$nextTick(() => {
            if (!deleteCurrent) {
              deleteCurrent = true
              this.data.splice(index, 1)
              if (isLast) {
                this.$nextTick(() => {
                  this.data.push({
                    status: 0,
                  })
                })
              }
            }
          })
        } else {
          this.$nextTick(() => {
            if (!deleteCurrent) {
              deleteCurrent = true
              this.data.splice(index, 1)
              if (isLast) {
                this.data.push({
                  status: 0,
                })
              }
            }
            this.data.splice(index, 0, lineData)
          })
        }
      })

      this.$nextTick(() => {
        this.updateSingleListDisabled()
      })
    },
    updateData() {
      let data = []
      this.data.forEach((item) => {
        if (!item.sku_no) {
          return
        }

        let lineItem = {
          sku_no: item.sku_no,
          unit_number: item.unit_number,
          price: item.price,
          unit: '小单位',
          remark: item.remark,
        }

        this.updateDataAfter(lineItem, item)

        data.push(lineItem)
      })

      this.$emit('updateData', JSON.stringify(data))
    },
    handleSummary({ columns, data }) {
      return renderSummary(columns, data)
    },
  },
  watch: {
    data: {
      handler: function () {
        utils.once(() => {
          this.updateData()
        }, 300)
      },
      deep: true,
    },
  },
  mounted() {
    this.updateData()
  },
  beforeMount() {
    renderCommon(this.columns)
  },
}
</script>
