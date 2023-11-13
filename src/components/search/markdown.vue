<template>
  <template v-if="!currentField">{{ currentField }}</template>
  <Markdown
    @updateData="updateData"
    :apiSource="apiSource"
    :content="currentValue"
    v-if="!this.displayOnly"
  ></Markdown>
  <MarkdownPreview
    :apiSource="apiSource"
    :content="currentValue"
    v-else
  ></MarkdownPreview>
</template>

<script>
import Markdown from '../editor/markdown'
import MarkdownPreview from '../editor/markdown-preview'

export default {
  components: {
    Markdown,
    MarkdownPreview,
  },
  name: 'SearchMarkdown',
  methods: {
    updateData(value) {
      this.$emit('updateData', value, this.currentField)
    },
  },
  props: {
    currentField: {
      type: String,
    },
    currentValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: __('请选择项目'),
    },
    apiSource: {
      type: Object,
      default: {},
    },
    displayOnly: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
