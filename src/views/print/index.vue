<template>
  <Card shadow :bordered="false">
    <Row :gutter="16" class="m-b-15">
      <Col :span="4">
        <!-- 模板选择 -->
        <Select v-model="mode" @on-change="changeMode" style="width: 100%">
          <Option
            v-for="(opt, idx) in modeList"
            :value="opt.type.toString()"
            :key="idx"
          >
            {{ opt.name }}
          </Option>
        </Select>
      </Col>
      <Col :span="20">
        <Space>
          <!-- 纸张设置 -->
          <ButtonGroup>
            <Button
              v-for="(value, type) in paperTypes"
              :type="curPaperType === type ? 'primary' : 'default'"
              @click="setPaper(type, value)"
              :key="type"
            >
              {{ type }}
            </Button>
            <Poptip
              title="设置纸张宽高(mm)"
              content="content"
              placement="bottom"
              trigger="click"
              style="margin-left: -1px"
            >
              <template #content>
                <InputGroup style="margin: 10px 10px">
                  <InputNumber
                    v-model="paperWidth"
                    style="width: 100px; text-align: center"
                    placeholder="宽(mm)"
                  />
                  <Button type="text" style="width: 20px; margin-right: 8px">
                    ~
                  </Button>
                  <InputNumber
                    v-model="paperHeight"
                    style="width: 100px; text-align: center"
                    placeholder="高(mm)"
                  />
                </InputGroup>
                <Button type="primary" style="width: 80px" @click="otherPaper">
                  确定
                </Button>
              </template>
              <Button :type="'other' == curPaperType ? 'primary' : 'default'">
                自定义纸张
              </Button>
            </Poptip>
          </ButtonGroup>
          <Button
            type="default"
            icon="md-remove"
            @click="changeScale(false)"
          ></Button>
          <InputNumber
            v-model="scaleValue"
            :min="scaleMin"
            :max="scaleMax"
            :step="0.1"
            disabled
            style="width: 70px"
            :formatter="(value) => `${(value * 100).toFixed(0)}%`"
            :parser="(value) => value.replace('%', '')"
          />
          <Button
            type="default"
            icon="md-add"
            @click="changeScale(true)"
          ></Button>
          <!-- 预览/打印 -->
          <ButtonGroup>
            <Button type="default" icon="md-eye" @click="preView">预览</Button>
            <!--            <Button type="primary" icon="md-print" @click="print">-->
            <!--              直接打印-->
            <!--              <Icon type="printer" />-->
            <!--            </Button>-->
          </ButtonGroup>
          <Dropdown @on-click="initTemplate">
            <Button type="primary">
              预置模板
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <template #list>
              <DropdownMenu>
                <DropdownItem name="default">默认模板</DropdownItem>
                <DropdownItem name="small_ticket">小票模板</DropdownItem>
              </DropdownMenu>
            </template>
          </Dropdown>
          <json-view :template="template" />
          <!-- 保存/清空 -->
          <Poptip confirm title="是否确认清空" @on-ok="clearPaper">
            <Icon slot="icon" type="question-circle-o" style="color: red" />
            <Button type="danger" icon="md-close">
              清空
              <Icon type="close" />
            </Button>
          </Poptip>
          <Button type="primary" icon="md-bookmark" @click="save">
            暂存模板
          </Button>
        </Space>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col :span="4">
        <Card style="height: 100vh" shadow :bordered="false">
          <Row>
            <Col
              :span="24"
              class="rect-printElement-types hiprintEpContainer"
            ></Col>
          </Row>
        </Card>
      </Col>
      <Col :span="14">
        <Card class="card-design">
          <div id="hiprint-printTemplate" class="hiprint-printTemplate"></div>
        </Card>
      </Col>
      <Col :span="6" class="params_setting_container">
        <Card shadow :bordered="false">
          <Alert show-icon>
            <template #icon>
              <Icon type="ios-bulb-outline"></Icon>
            </template>
            {{ __('温馨提示') }}
            <template #desc>
              <p>
                1、{{
                  __(
                    '模板修改完后，必须点击《暂存模板》，然后《提交》才能够保存起来。',
                  )
                }}
              </p>
              <p>
                2、{{
                  __('你可以在预置模板的基础上修改，快速完成你想要的模板。')
                }}
              </p>
            </template>
          </Alert>
          <Row class="hinnn-layout-sider">
            <div id="PrintElementOptionSetting"></div>
          </Row>
        </Card>
      </Col>
    </Row>
    <!-- 预览 -->
    <print-preview ref="preView" />
  </Card>
</template>

<script>
// 从官方 demo 修改而来
// https://ccsimple.gitee.io/vue-plugin-hiprint/
import { disAutoConnect, hiprint } from 'vue-plugin-hiprint'
import printPreview from './preview'
import jsonView from './json-view.vue'
import providers from './providers'
import printData from './print-data'
import { getCache, setCache } from '@/utils/cache'
import defaultTemplate from './default-template'
import smallTicketTemplate from './small-ticket-template'

disAutoConnect()

let hiprintTemplate
export default {
  name: 'printCustom',
  components: { printPreview, jsonView },
  props: {
    currentValue: {
      type: String,
      default: null,
    },
    displayOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isInit: false,
      template: null,
      // 模板选择
      mode: '0',
      modeList: [],
      // 当前纸张
      curPaper: {
        type: 'other',
        width: 220,
        height: 80,
      },
      // 纸张类型
      paperTypes: {
        A3: {
          width: 420,
          height: 296.6,
        },
        A4: {
          width: 210,
          height: 296.6,
        },
        A5: {
          width: 210,
          height: 147.6,
        },
        B3: {
          width: 500,
          height: 352.6,
        },
        B4: {
          width: 250,
          height: 352.6,
        },
        B5: {
          width: 250,
          height: 175.6,
        },
      },
      scaleValue: 1,
      scaleMax: 5,
      scaleMin: 0.5,
      // 自定义纸张
      paperPopVisible: false,
      paperWidth: '220',
      paperHeight: '80',
      lastjson: '',
      initTemplates: {
        default: defaultTemplate,
        small_ticket: smallTicketTemplate,
      },
    }
  },
  computed: {
    curPaperType() {
      let type = 'other'
      const types = this.paperTypes
      for (const key in types) {
        const item = types[key]
        const { width, height } = this.curPaper
        if (item.width === width && item.height === height) {
          type = key
        }
      }
      return type
    },
  },
  mounted() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.init()
      this.otherPaper(true)
    },
    init() {
      this.modeList = providers.map((e) => ({
        type: e.type,
        name: e.name,
        value: e.value,
      }))
      this.changeMode()
    },
    changeMode(currentTemplate) {
      const { mode } = this
      const provider = providers.find((e) => e.type == mode)
      hiprint.init({
        providers: [provider.f],
      })
      $('.hiprintEpContainer').empty()
      hiprint.PrintElementTypeManager.build(
        '.hiprintEpContainer',
        provider.value,
      )
      $('#hiprint-printTemplate').empty()
      // const templates = getCache('PRINT_KEY_TEMPLATES', {})
      // const template = templates[provider.value]
      //   ? templates[provider.value]
      //   : {}

      const template = currentTemplate
        || (this.currentValue ? JSON.parse(this.currentValue) : {})
      let initPaper = false
      if (template.panels && template.panels[0]) {
        this.paperWidth = template.panels[0].width
        this.paperHeight = template.panels[0].height
        initPaper = true
      }

      this.template = hiprintTemplate = new hiprint.PrintTemplate({
        template,
        dataMode: 1, // 1:getJson 其他：getJsonTid 默认1
        history: false, // 是否需要 撤销重做功能
        onDataChanged: (type, json) => {
          // console.log(type) // 新增、移动、删除、修改(参数调整)、大小、旋转
          // console.log(json) // 返回 template
          // 更新模板
          // hiprintTemplate.update(json)
          // console.log(hiprintTemplate.historyList)
        },
        settingContainer: '#PrintElementOptionSetting',
        paginationContainer: '.hiprint-printPagination',
      })
      hiprintTemplate.design('#hiprint-printTemplate')
      // 获取当前放大比例, 当zoom时传true 才会有
      this.scaleValue = hiprintTemplate.editingPanel.scale || 1

      if (initPaper) {
        this.otherPaper()
      }
    },
    /**
     * 设置纸张大小
     * @param type [A3, A4, A5, B3, B4, B5, other]
     * @param value {width,height} mm
     */
    setPaper(type, value) {
      try {
        if (Object.keys(this.paperTypes).includes(type)) {
          this.curPaper = { type, width: value.width, height: value.height }
          hiprintTemplate.setPaper(value.width, value.height)
          setCache('PRINT_KEY_PAPER', this.curPaper)
        } else {
          this.curPaper = {
            type: 'other',
            width: value.width,
            height: value.height,
          }
          hiprintTemplate.setPaper(value.width, value.height)
          setCache('PRINT_KEY_PAPER', this.curPaper)
        }
      } catch (error) {
        utils.error(`操作失败: ${error}`)
      }
    },
    changeScale(big) {
      let { scaleValue } = this
      if (big) {
        scaleValue += 0.1
        if (scaleValue > this.scaleMax) scaleValue = 5
      } else {
        scaleValue -= 0.1
        if (scaleValue < this.scaleMin) scaleValue = 0.5
      }
      if (hiprintTemplate) {
        // scaleValue: 放大缩小值, false: 不保存(不传也一样), 如果传 true, 打印时也会放大
        hiprintTemplate.zoom(scaleValue, true)
        this.scaleValue = scaleValue
      }
    },
    otherPaper(init) {
      const value = {}
      value.width = this.paperWidth
      value.height = this.paperHeight
      this.paperPopVisible = false
      let paper = value
      if (init === true) {
        paper = getCache('PRINT_KEY_PAPER', value)
      }
      this.setPaper('other', paper)
    },
    preView() {
      const { width } = this.curPaper
      this.$refs.preView.show(hiprintTemplate, printData, width)
    },
    print() {
      if (window.hiwebSocket.opened) {
        const printerList = hiprintTemplate.getPrinterList()
        hiprintTemplate.print2(printData, {
          printer: '',
          title: 'hiprint测试打印',
        })
        return
      }
      utils.error('客户端未连接,无法直接打印')
    },
    save() {
      const { mode } = this
      const provider = providers[mode]
      this.setTemplate({
        name: provider.value,
        json: hiprintTemplate.getJson(),
      })
    },
    setTemplate(payload) {
      // const templates = getCache('PRINT_KEY_TEMPLATES', {})
      // templates[payload.name] = payload.json
      // setCache('PRINT_KEY_TEMPLATES', templates)
      this.updateData(JSON.stringify(payload.json))
      utils.multilineSuccess(
        __('模板已暂存，必须提交后才能够保存到云端。'),
        1.5,
      )
    },
    updateData(templateData) {
      this.$emit('updateData', templateData)
    },
    clearPaper() {
      try {
        hiprintTemplate.clear()
      } catch (error) {
        utils.error(`操作失败: ${error}`)
      }
    },
    initTemplate(template) {
      // 更新无法渲染纸张大小
      this.changeMode(this.initTemplates[template])
      // if (hiprintTemplate) {
      //   try {
      //     hiprintTemplate.update(this.initTemplates[template])
      //   } catch (e) {
      //     utils.error(`更新失败: ${e}`)
      //   }
      // }
    },
  },
  watch: {
    currentValue(newVal, oldVal) {
      if (newVal !== null && !this.isInit) {
        this.initPage()
        this.isInit = true
      }
    },
  },
}
</script>

<style lang="less" scoped>
// build 拖拽
::v-deep(.hiprint-printElement-type > li > ul > li > a) {
  padding: 4px 4px;
  color: #1296db;
  line-height: 1;
  height: auto;
  text-overflow: ellipsis;
}

// 默认图片
::v-deep(.hiprint-printElement-image-content) {
  img {
    content: url('@/assets/images/logo_box.png');
  }
}

// 设计容器
.card-design {
  overflow: hidden;
  overflow-x: auto;
  overflow-y: auto;
}
</style>
