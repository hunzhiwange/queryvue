<template>
  <div
    :style="
      'width: 100%; height: ' +
      (apiSource.height ? apiSource.height : '350') +
      'px'
    "
  >
    <v-md-editor
      ref="editor"
      v-model="editorContent"
      @save="saveContent"
      height="100%"
      :default-show-toc="defaultShowToc"
      toc-nav-position-right="true"
      @upload-image="handleUploadImage"
      :mode="mode"
    ></v-md-editor>
  </div>
</template>

<script lang="jsx">
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor'
import '@kangc/v-md-editor/lib/style/codemirror-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// codemirror 编辑器的相关资源
import Codemirror from 'codemirror'
// mode
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/vue/vue'
// edit
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchbrackets'
// placeholder
import 'codemirror/addon/display/placeholder'
// active-line
import 'codemirror/addon/selection/active-line'
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
// style
import 'codemirror/lib/codemirror.css'

import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'

import { getCurrentInstance, watch } from 'vue'

VMdEditor.Codemirror = Codemirror
VMdEditor.use(githubTheme)

VMdEditor.use(createTodoListPlugin())

export default {
  setup() {
    getCurrentInstance().appContext.app.use(VMdEditor)
  },
  props: {
    content: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: 'edit',
    },
    defaultShowToc: {
      type: Boolean,
      default: false,
    },
    apiSource: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      editorContent: '',
    }
  },
  mounted() {
    watch(
      () => this.editorContent,
      (newVal, oldVal) => {
        utils.once(() => {
          this.saveContent()
        }, 500)
      },
    )

    watch(
      () => this.content,
      (newVal, oldVal) => {
        this.editorContent = newVal
      },
    )
  },
  methods: {
    saveContent() {
      this.$emit('updateData', this.editorContent)
    },
    handleUploadImage(event, insertImage, files) {
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
      files.forEach((file) => {
        const formdata = new FormData()
        formdata.append('file', file)
        this.apiPost(
          'app::attachment/attachment/upload',
          formdata,
          {},
          { 'Content-Type': 'multipart/form-data' },
        ).then((url) => {
          insertImage({
            url: url.file_url,
            desc: file.name,
          })
        })
      })
    },
  },
}
</script>
