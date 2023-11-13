import MindMap from './../../../components/document/mind-map/index'

export default {
  components: {
    MindMap,
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
      mindMap: {},
    }
  },
  mounted: function () {
    this.mindMap = this.$refs.myMindMap.contentWindow
  },
}
