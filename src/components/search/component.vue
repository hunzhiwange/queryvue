<template>
  <template v-if="!currentField">{{ currentField }}</template>
  <component
    ref="component"
    :is="currentComponent"
    :currentValue="currentValue"
    :apiSource="apiSource"
    :displayOnly="displayOnly"
    @updateData="updateData"
  />
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  name: 'SearchComponent',
  props: {
    currentField: {
      type: String,
    },
    currentValue: {},
    placeholder: {
      type: String,
      default: __('请选择项目'),
    },
    apiSource: {
      type: Object,
      default: {
        component: '',
      },
    },
    displayOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentComponent: null,
    }
  },
  methods: {
    updateData(valueSelected) {
      if (this.currentField != undefined) {
        this.$emit('updateData', valueSelected, this.currentField)
      }
    },
  },
  beforeMount() {
    this.currentComponent = defineAsyncComponent({
      loader: utils.importComponent(this.apiSource.component),
      delay: 0,
    })
  },
}
</script>
