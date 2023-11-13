<template>
  <!-- 预览/打印 -->
  <!--      <Button type="primary" icon="md-eye" @click="preView">-->
  <!--        预览-->
  <!--      </Button>-->
  <!--  <Button type="default" icon="md-remove" @click="changeScale(false)"></Button>-->
  <!--  <InputNumber-->
  <!--      v-model="scaleValue"-->
  <!--      :min="scaleMin"-->
  <!--      :max="scaleMax"-->
  <!--      :step="0.1"-->
  <!--      disabled-->
  <!--      style="width: 70px;"-->
  <!--      :formatter="value => `${(value * 100).toFixed(0)}%`"-->
  <!--      :parser="value => value.replace('%', '')"-->
  <!--  />-->
  <!--  <Button type="default" icon="md-add" @click="changeScale(true)"></Button>-->
  <!-- 预览 -->
  <print-preview ref="preView" />
</template>

<script>
import { disAutoConnect, hiprint } from 'vue-plugin-hiprint'
import moment from 'moment'
import printPreview from './preview'

disAutoConnect()
let hiprintTemplate
export default {
  name: 'printCustom',
  components: { printPreview },
  data() {
    return {
      scaleValue: 1,
      scaleMax: 5,
      scaleMin: 0.5,
    }
  },
  methods: {
    init(currentTemplate, printData) {
      this.changeMode(currentTemplate)
      this.preView(printData)
    },
    changeMode(currentTemplate) {
      const template = JSON.parse(currentTemplate)
      hiprintTemplate = new hiprint.PrintTemplate({
        template,
        dataMode: 1, // 1:getJson 其他：getJsonTid 默认1
        history: false, // 是否需要 撤销重做功能
        settingContainer: '#PrintElementOptionSetting',
        paginationContainer: '.hiprint-printPagination',
      })
      hiprintTemplate.design('#hiprint-printTemplate')
      // 获取当前放大比例, 当zoom时传true 才会有
      this.scaleValue = hiprintTemplate.editingPanel.scale || 1
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
    preView(printData) {
      printData.frameworkPrintDate = moment().format('YYYY-MM-DD HH:mm:ss')
      this.$refs.preView.show(
        hiprintTemplate,
        printData,
        hiprintTemplate.printPanels[0].width,
      )
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
