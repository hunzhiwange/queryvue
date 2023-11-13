import page from '@/utils/page'
import MindMap from '../../../components/document/mind-map/index'

export default {
  components: {
    MindMap,
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
      mindMap: {},
    }
  },
  methods: {
    init: function (num, id) {
      this.apiGet('app:project/project/show', { num: num }).then((res) => {
        this.project = res
      })

      this.apiGet('app:project/project-issue/show', {
        num: num + '-' + id,
      }).then((res) => {
        if (res.project_type && res.project_type.content_type != 10) {
          utils.error(this.__('非思维导图高级版文档'))
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
      this.apiPut(
        'app:project/project-issue',
        projectIssueId + '/content',
        formData,
      ).then(
        (res) => {},
        () => {},
      )
    },
  },
  mounted: function () {
    this.init(this.$route.params.num, this.$route.params.id)
    this.mindMap = this.$refs.myMindMap.contentWindow
  },
  mixins: [page],
}
