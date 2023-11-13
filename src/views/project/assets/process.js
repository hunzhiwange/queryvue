import page from '@/utils/page'
import Flow from '../../../components/document/flow/index'

export default {
  components: {
    Flow,
  },
  data() {
    return {
      docContent: {
        title: '',
        content: undefined,
      },
      projectIssue: {
        num: '',
        title: '',
        project: {
          name: '',
          num: '',
        },
      },
      flow: {},
    }
  },
  methods: {
    init: function (num, id) {
      this.apiGet('app:project/project/show', { num: num }).then((res) => {
        this.project = res
      })

      this.apiGet('app:project/project-issue/show', { num: num + '-' + id }).then((res) => {
        if (res.project_type && res.project_type.content_type != 6) {
          utils.error(this.__('非流程图文档'))
          return
        }
        this.projectIssue = res
        ;(this.docContent.title = res.title),
          (this.docContent.content = res.project_content.content)
        document.title =
          '[' +
          this.projectIssue.num +
          ']' +
          this.projectIssue.title +
          ' - ' +
          document.title
      })
    },
    saveData(data) {
      var formData = {
        content: data.data,
        sub_title: data.title,
      }
      var projectIssueId = this.projectIssue.id
      this.apiPut('app:project/project-issue', projectIssueId + '/content', formData).then(
        (res) => {},
        () => {},
      )
    },
  },
  mounted: function () {
    this.init(this.$route.params.num, this.$route.params.id)
    this.flow = this.$refs.myFlow.contentWindow
  },
  mixins: [page],
}
