<template>
  <Menu mode="horizontal" theme="light" active-name="1">
    <Row>
      <Col span="12">
        <MenuItem
          v-for="(menuList, index) in menuLeft"
          :key="index"
          :name="index"
          :to="menuList.path"
        >
          <Icon :type="menuList.icon" />
          {{ menuList.title }}
        </MenuItem>
      </Col>
      <Col span="12">
        <div class="pull-right">
          <!--          <MenuItem name="3" :to="'/project/process/'">-->
          <!--            <Icon type="md-create" />-->
          <!--            新增-->
          <!--          </MenuItem>-->
          <MenuItem name="5">
            <Icon type="md-share" />
            分享
          </MenuItem>
        </div>
      </Col>
    </Row>
  </Menu>

  <PageHeader class="m-b-15" :title="doc.order_no">
    <template #action>
      <ButtonGroup>
        <Button type="default" icon="md-cloud-download">
          {{ __('导出') }}
        </Button>
        <Dropdown style="margin-left: -1px" @mouseenter="handleMouseEnterPrint">
          <Button type="default" icon="ios-print-outline">
            {{ __('打印') }}
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <template #list>
            <DropdownMenu>
              <DropdownItem
                v-for="(printTemplate, index) in printTemplates"
                :key="index"
                @click="
                  print(
                    printTemplate.print_template_content.content,
                    doc.order_no,
                  )
                "
              >
                {{ printTemplate.name }}
              </DropdownItem>
            </DropdownMenu>
            <Spin fix :show="printTemplateSpinShow"></Spin>
          </template>
        </Dropdown>
      </ButtonGroup>

      <component
        ref="docPrint"
        :is="docPrintComponent"
        :doc-id="doc.id"
        :current-template="currentTemplate"
      />

      <ButtonGroup>
        <slot name="doc_button" :doc="doc"></slot>
      </ButtonGroup>

      <slot name="doc_button_primary" :doc="doc"></slot>
    </template>
    <template #content>
      <DescriptionList :col="2">
        <Description :term="__('创建时间') + '：'">
          {{ doc.create_at }}
        </Description>
        <Description :term="__('制单人') + '：'">
          {{ doc.create_account_name }}
        </Description>
        <Description :term="docDetail.name + __('仓库') + '：'">
          {{ doc.warehouse.warehouse_name }}
        </Description>
        <Description :term="__('经办人') + '：'">
          {{ doc.staff_no ? doc.staff_no : __('无') }}
        </Description>
        <Description :term="__('关联单据') + '：'" v-if="!!doc.relation_doc_no">
          <a @click="toDocDetail(doc.relation_doc_no)">
            {{ doc.relation_doc_no }}
          </a>
        </Description>
        <Description :term="__('客户') + '：'" v-if="!!doc.client_no">
          {{ doc.client_no }}
        </Description>
      </DescriptionList>
    </template>
    <template #extra>
      <Text type="secondary">{{ __('状态') }}</Text>
      <p class="text-2xl">
        <Text :type="getStatusType(doc.status)">
          <Icon :type="getStatusIcon(doc.status)" />
          {{ doc.status_enum }}
        </Text>
      </p>
    </template>
  </PageHeader>

  <slot name="doc_status" :doc="doc"></slot>

  <slot name="doc_tab" :doc="doc">
    <div class="p-t-4 rounded bg-white" v-if="tabMenus.length > 0">
      <Tabs
        :animated="false"
        :model-value="currentTabMenu"
        @on-click="tabMenuClick"
      >
        <TabPane
          v-for="(tabMenu, index) in tabMenus"
          :key="index"
          :name="tabMenu.name"
          :label="tabMenu.label"
        ></TabPane>
      </Tabs>
    </div>
  </slot>

  <slot name="doc_tab_content" :doc="doc"></slot>

  <CurdIndex
    v-if="!currentTabMenu"
    ref="curdIndex"
    :search-plan-source-type="searchPlanSourceType"
    :search-api="searchApi"
    :search-api-extend="searchApiExtend"
    :is-detail-page="true"
    :show-summary="true"
  />

  <Card shadow :bordered="false" class="m-t-15" v-if="!currentTabMenu">
    <template #title>
      <strong>{{ __('备注') }}</strong>
    </template>
    {{ doc.remark }}
  </Card>

  <Card shadow :bordered="false" class="m-t-15" v-if="!currentTabMenu">
    <template #title>
      <strong>{{ __('内部备注') }}</strong>
    </template>
    {{ doc.internal_remark }}
  </Card>

  <Card shadow :bordered="false" class="m-t-15" v-if="!currentTabMenu">
    <template #title>
      <strong>{{ __('操作日志') }}</strong>
    </template>

    <i-table
      :loading="loadingLogTrackTable"
      ref="table"
      :columns="logTrackColumns"
      :data="logTrackData"
    ></i-table>
  </Card>
</template>

<script lang="tsx">
import curd from '../curd/curd.js'
import Print from '../../views/print/print'
import relation from '../../utils/relation'

export default {
  components: {
    Print,
  },
  props: {
    menuLeft: {
      type: Array,
      default: [],
    },
    searchPlanSourceType: {
      type: Number,
      default: 0,
    },
    searchApiExtend: {
      type: Object,
      default: {
        product: {
          api: 'product:product/list-only',
          source_key: 'product_id',
          target_key: 'id',
        },
      },
    },
    docApiParams: {
      type: Object,
      default: {
        column:
          'id,status,create_account_name,order_no,create_at,warehouse_no,client_no,remark,internal_remark,relation_doc_no,staff_no,doc_sub_type',
        'relation[warehouse][setColumns]': 'warehouse_name,warehouse_no',
      },
    },
    statusType: {
      type: Object,
      default: {},
    },
    statusIcon: {
      type: Object,
      default: {},
    },
    docDetail: {
      type: Object,
      default: {},
    },
    tabMenus: {
      type: Array,
      default: [],
    },
    currentTabMenu: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      printTemplateSpinShow: false,
      mountedInitColumns: false,
      columns: [],
      searchApi: `doc:doc_item/list-only?order_no=${this.$route.params.id}`,
      doc: {
        order_no: __('加载中...'),
        warehouse: {},
      },
      loadingLogTrackTable: false,
      logTrackColumns: [
        {
          title: __('时间'),
          key: 'create_at',
        },
        {
          title: __('操作人'),
          key: 'create_account_name',
        },
        {
          title: __('操作类别'),
          key: 'operation_enum',
        },
        {
          title: __('操作日志'),
          key: 'remark',
          render: (h, params) => {
            const text = params.row.remark
            const regex = /([A-Z]{2}\d+)/g
            const matches = text.matchAll(regex)
            let lastIndex = 0
            const result = []
            for (const match of matches) {
              const textBefore = text.slice(lastIndex, match.index)
              const linkCode = match[1]
              result.push({ type: 'text', value: textBefore })
              result.push({ type: 'link', value: linkCode })
              lastIndex = match.index + match[0].length
            }
            const textAfter = text.slice(lastIndex)
            result.push({ type: 'text', value: textAfter })

            return (
              <>
                {result.map((item, index) => (
                  <span key={index}>
                    {item.type === 'text' ? (
                      <>{item.value}</>
                    ) : (
                      <a onClick={() => this.toDocDetail(item.value)}>
                        {item.value}
                      </a>
                    )}
                  </span>
                ))}
              </>
            )
          },
        },
      ],
      logTrackData: [],
      docPrintComponent: null,
      initPrintTemplates: false,
      printTemplates: [],
      currentTemplate: {},
      currentData: [],
    }
  },
  methods: {
    getStatusIcon(status) {
      return Object.prototype.hasOwnProperty.call(this.statusIcon, status)
        ? this.statusIcon[status]
        : 'ios-information-circle-outline'
    },
    getStatusType(status) {
      return Object.prototype.hasOwnProperty.call(this.statusType, status)
        ? this.statusType[status]
        : ''
    },
    tabMenuClick(name) {
      this.$emit('tabMenuClick', name)
    },
    logTrack() {
      this.loadingLogTrackTable = true
      this.apiGet('doc:doc_log_track/list-only', {
        order_no: this.$route.params.id,
        column: 'create_at,create_account_name,operation,remark',
      }).then((res) => {
        this.loadingLogTrackTable = false
        this.logTrackData = res.data
      })
    },
    getDoc() {
      let baseParams = {
        order_no: this.$route.params.id,
      }
      baseParams = Object.assign(baseParams, this.docApiParams)
      this.apiGet('doc:doc/list-only', baseParams).then((res) => {
        if (!res.data[0]) {
          utils.errorNotFound()
          return
        }

        this.doc = res.data[0]
        this.$emit('docResult', this.doc)
      })
    },
    refresh() {
      this.$emit('refresh')
      this.getDoc()
      if (!this.currentTabMenu) {
        setTimeout(this.logTrack(), 500)
      }
    },
    initDetailColumns(columns) {
      if (this.currentTabMenu) {
        return
      }

      this.columns = columns
      this.initColumns()
    },
    handleMouseEnterPrint() {
      if (this.initPrintTemplates) {
        return
      }

      this.printTemplateSpinShow = true

      this.apiGet('print:print_template/list-only', {
        type: 0,
        column: 'id,name',
        order_by: 'is_default DESC',
        'relation[print_template_content][setColumns]': 'template_id,content',
      }).then((res) => {
        this.docPrintComponent = 'Print'
        this.printTemplates = res.data
        this.initPrintTemplates = true
        this.printTemplateSpinShow = false
      })
    },
    async print(template, orderNo) {
      const { printElements } = JSON.parse(template).panels[0]
      const baseTemplate = []
      let tableTemplate = []
      printElements.forEach((item) => {
        if (!Object.prototype.hasOwnProperty.call(item.options, 'field')) {
          return
        }
        if (item.options.field === 'table') {
          tableTemplate = item.options.columns[0].filter(
            (item) =>
              Object.prototype.hasOwnProperty.call(item, 'checked') &&
              item.checked === true,
          )
        } else {
          baseTemplate.push(item.options)
        }
      })

      const baseData = await relation(
        {
          api: 'doc:doc/list-only',
          params: {
            order_no: orderNo,
          },
        },
        {
          user: {
            api: 'user:user/list-only',
            source_key: 'client_no',
            target_key: 'num',
            params: {
              type: 2,
            },
          },
        },
        baseTemplate,
        ['frameworkPrintDate', 'table'],
      )

      const tableData = await relation(
        {
          api: 'doc:doc_item/list-only',
          params: {
            order_no: orderNo,
          },
        },
        {
          product: {
            api: 'product:product/list-only',
            source_key: 'product_id',
            target_key: 'id',
          },
        },
        tableTemplate,
        [],
        true,
      )

      const printData = baseData.data[0]
      printData.table = tableData.data

      this.$refs.docPrint.init(template, printData)
    },
  },
  mounted() {
    this.refresh()
  },
  mixins: [curd],
}
</script>
