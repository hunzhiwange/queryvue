<template>
  <div>
    <Button type="default" icon="md-eye" @click="show">查看模板</Button>
    <Modal v-model="visible" :mask-closable="false" @on-cancel="hideModal">
      <div>
        <Input
          v-model="jsonOut"
          type="textarea"
          style="width: 100%"
          :autosize="{ minRows: 2, maxRows: 25 }"
          :readonly="true"
        />
        <Spin size="large" fix :show="spinning"></Spin>
      </div>
      <template #header>
        <Space>
          <div style="margin-right: 20px">模板结构</div>
          <Switch @on-change="onModeChange" v-model="tidMode">
            <template #open>
              <span>tid模式</span>
            </template>
            <template #close>
              <span>默认</span>
            </template>
          </Switch>
          <Switch @on-change="onModeChange" v-model="beautify">
            <template #open>
              <span>美化</span>
            </template>
            <template #close>
              <span>压缩</span>
            </template>
          </Switch>
        </Space>
      </template>
      <template #footer>
        <Button key="close" type="info" @click="hideModal">关闭</Button>
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'JSONView',
  props: {
    template: {
      type: Object,
    },
  },
  data() {
    return {
      visible: false,
      spinning: true,
      jsonOut: '',
      tidMode: false,
      beautify: false,
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
    show() {
      this.visible = true
      this.spinning = true
      setTimeout(() => {
        const json = this.tidMode
          ? this.template.getJsonTid()
          : this.template.getJson()
        const beautify = this.beautify ? 2 : 0
        this.jsonOut = JSON.stringify(json, null, beautify)
        this.spinning = false
      }, 500)
    },
    onModeChange() {
      this.show()
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
