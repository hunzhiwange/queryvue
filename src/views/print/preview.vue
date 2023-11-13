<template>
  <Modal
    v-model="visible"
    :mask-closable="false"
    :styles="{ width: width + 6 + 'mm' }"
    :key="currentKey"
  >
    <div>
      <div id="preview_content_custom"></div>
      <Spin size="large" fix :show="spinning"></Spin>
    </div>
    <template #header>
      <Space>
        <div style="margin-right: 20px">打印预览</div>
        <Button
          :loading="waitShowPrinter"
          type="primary"
          icon="md-print"
          @click.stop="print"
        >
          打印
        </Button>
        <Button type="primary" icon="md-print" @click.stop="toPdf">PDF</Button>
      </Space>
    </template>
    <template #footer>
      <Button key="close" type="info" @click="hideModal">关闭</Button>
    </template>
  </Modal>
</template>

<script>
export default {
  name: 'printPreview',
  props: {},
  data() {
    return {
      visible: false,
      spinning: true,
      waitShowPrinter: false,
      // 纸张宽 mm
      width: 0,
      // 模板
      hiprintTemplate: {},
      // 数据
      printData: {},
      currentKey: '',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    hideModal() {
      this.visible = false
    },
    show(hiprintTemplate, printData, width = '210') {
      this.currentKey = Math.random()
      this.visible = true
      this.spinning = true
      this.width = hiprintTemplate.editingPanel
        ? hiprintTemplate.editingPanel.width
        : width
      this.hiprintTemplate = hiprintTemplate
      this.printData = printData
      setTimeout(() => {
        // eslint-disable-next-line no-undef
        $('#preview_content_custom').html(hiprintTemplate.getHtml(printData))
        this.spinning = false
      }, 500)
    },
    print() {
      this.waitShowPrinter = true
      this.hiprintTemplate.print(
        this.printData,
        {},
        {
          callback: () => {
            this.waitShowPrinter = false
          },
        },
      )
    },
    toPdf() {
      this.hiprintTemplate.toPdf(this.printData, '打印预览pdf')
    },
  },
}
</script>
<style lang="less" scoped>
::v-deep(.ant-modal-body) {
  padding: 0px;
}

::v-deep(.ant-modal-content) {
  margin-bottom: 24px;
}
</style>
