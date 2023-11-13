import board_header from './../board_header'

export default {
  components: {
    board_header,
  },
  data() {
    return {
      project: {},
    }
  },
  methods: {
    init: function (num) {
      this.apiGet('app:project/project/show', { num: num }).then((res) => {
        this.project = res
        document.title =
          '[' +
          this.project.num +
          ']' +
          this.project.name +
          ' - ' +
          document.title
      })
    },
  },
  mounted: function () {
    this.init(this.$route.params.num)
  },
  mixins: [],
}
