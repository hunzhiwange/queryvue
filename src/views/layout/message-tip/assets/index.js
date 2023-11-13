export default {
  name: 'messageTip',
  props: {
    value: {
      type: Number,
      default: 3,
    },
  },
  methods: {
    showMessage() {
      utils.openNewPage(this, 'message')
      this.$router.push({
        name: 'message',
      })
    },
  },
}
