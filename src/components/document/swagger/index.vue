<template>
  <div class="swagger-content h-100p">
    <iframe ref="currentSwgger" class="swagger-iframe" :src="url" :style="'height: calc(100% - '+(minContent ? 0 : 16)+'px)'"></iframe>
    <div v-if="loading" class="swagger-loading">
      <Button type="primary" loading>加载中...</Button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.swagger-content {
  left: 0;
  .swagger-iframe {
    width: 100%;
    background: 0 0;
    border: 0;
    float: none;
    max-width: none;
    outline: 0;
  }
  .swagger-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

<script>
export default {
  name: 'Swagger',
  props: {
    minContent: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: null,
    },
    title: {
      type: String,
    },
    isUrl: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
      iframeInit: false,
      swgger: null,
      // url: 'http://localhost:5000/?dev=1'+(this.readOnly ? '&lightbox=1' : ''),
      url: `${window.location.origin}/swagger/index.html`,
    }
  },
  mounted() {
    window.addEventListener('message', this.handleMessage)
    this.swgger = this.$refs.currentSwgger.contentWindow
  },
  activated() {
    // window.addEventListener('message', this.handleMessage)
    // this.swgger = this.$refs.currentSwgger.contentWindow;
  },
  watch: {
    content:{
      handler(newVal, oldVal){
        this.sendMessage()
      },
      immediate:true,
    },
  },
  methods: {
    sendMessage() {
      if (!this.loading) {
        return
      }

      if (!this.iframeInit || this.content === null) {
        setTimeout(() => {
          this.sendMessage()
        }, 100)
      } else {
        this.loading = false

        this.swgger.postMessage(
          {
            act: 'setData',
            params: {
              type: this.isUrl ? 'url' : 'content',
              data: this.content,
            },
          },
          '*',
        )
      }
    },
    handleMessage(event) {
      const { data } = event
      switch (data.act) {
        case 'ready':
          this.iframeInit = true
          this.sendMessage()
          break

        case 'change':
          if (this.loading|| this.readOnly || !this.iframeInit) {
            return
          }

          this.$emit('saveData', data.params)
          break
      }
    },
  },
}
</script>
