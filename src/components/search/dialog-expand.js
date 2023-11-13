import { h } from 'vue'

export default {
  name: 'DialogExpand',
  props: {
    row: Object,
    render: Function,
    apiSource: {
      type: Object,
      default: {},
    },
    data: {
      type: Object,
      default: {},
    },
  },
  render() {
    if (!this.render) {
      return this.data[this.apiSource.value]
    }

    const params = {
      data: this.data,
      apiSource: this.apiSource,
    }

    return this.render(h, params)
  },
}
