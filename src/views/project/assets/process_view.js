import Flow from './../../../components/document/flow/index'

export default {
  components: {
    Flow,
  },
  props: {
    minContent: {
      type: Boolean,
      default: false,
    },
    docContent: {
      type: Object,
      default: {
        title: '',
        content: null,
      },
    },
    projectIssue: {
      type: Object,
      default: {
        num: '',
        title: '',
        project: {
          name: '',
          num: '',
        },
      },
    },
  },
  data() {
    return {
      flow: {},
    }
  },
  mounted: function () {
    this.flow = this.$refs.myFlow.contentWindow
    // console.log(this.docContent)
  },
}
