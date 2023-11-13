<template>
  <div class="mind-map-content">
    <iframe
      ref="currentMindMap"
      class="mind-map-iframe"
      :src="url"
      allow="clipboard-read; clipboard-write"
      :style="'height: calc(100% - '+(minContent ? 32 : 16)+'px)'"
    ></iframe>
    <div v-if="loading" class="mind-map-loading">
      <Button type="primary" loading>加载中...</Button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.mind-map-content {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  .mind-map-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: 0 0;
    border: 0;
    float: none;
    margin: -1px 0 0;
    max-width: none;
    outline: 0;
    padding: 0;
  }
  .mind-map-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

<script>
export default {
  name: 'MindMap',
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
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
      iframeInit: false,
      mindMap: null,
      // url: 'http://localhost:5000/?dev=1'+(this.readOnly ? '&lightbox=1' : ''),
      // url: window.location.origin + '/process/index.html' + (this.readOnly ? '?lightbox=1' : ''),
      url: `${window.location.origin}/mind-map/index.html${
        this.readOnly ? '?lightbox=1' : ''
      }`,
    }
  },
  watch: {
    content:{
      handler(newVal, oldVal){
        this.sendMessage()
      },
      immediate:true,
    },
  },
  mounted() {
    window.addEventListener('message', this.handleMessage)
    this.mindMap = this.$refs.currentMindMap.contentWindow
  },
  activated() {
    // window.addEventListener('message', this.handleMessage)
    // this.mindMap = this.$refs.currentMindMap.contentWindow;
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

        this.mindMap.postMessage(
        {
          act: 'setData',
          params: {
            title: this.title,
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
          if (this.loading || this.readOnly || !this.iframeInit) {
            return
          }

          this.$emit('saveData', data.params)
          break
      }
    },
  },
}
</script>
