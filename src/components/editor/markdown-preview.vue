<template>
  <div
    :style="
      'width: 100%; height: ' +
      (apiSource.height ? apiSource.height : '350') +
      'px'
    "
  >
    <v-md-preview :text="content"></v-md-preview>
  </div>
</template>

<script lang="jsx">
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'
import { getCurrentInstance } from 'vue'

VMdPreview.use(githubTheme)
VMdPreview.use(createTodoListPlugin())

export default {
  setup() {
    getCurrentInstance().appContext.app.use(VMdPreview)
  },
  props: {
    content: {
      type: String,
      default: '',
    },
    apiSource: {
      type: Object,
      default: {},
    },
  },
}
</script>
