import board_header from './../board_header'
import IssueContent from './../issue-content'

export default {
  mounted() {},
  components: {
    board_header,
    IssueContent,
  },
  data() {
    return {
      projectLabels: [],
      projects: [],
      project: {
        id: 0,
        num: '',
        name: this.__('请选择项目'),
      },
      projectIssue: {
        id: 0,
        num: '',
        project_type: {
          content_type: 1,
        },
        project_content: {
          content: '',
        },
        project: {
          name: '',
          num: '',
        },
        project_label: {
          name: '',
        },
      },
      issueModulesEdit: false,
      projectModules: [],
      issueEditModules: [],
    }
  },
  methods: {
    previewContent() {
      this.$router.push({
        path: '/content/' + this.projectIssue.num,
      })
    },
    editTaskModules() {
      this.issueModulesEdit = true
      this.issueEditModules = []
      this.projectIssue.project_modules.forEach((item) => {
        this.issueEditModules.push(item.id)
      })
    },
    cancelIssueModulesForm() {
      this.issueModulesEdit = false
    },
    updateTaskModules() {
      var formData = {
        modules: this.issueEditModules,
      }
      this.apiPut(
        'app:project/project-issue',
        this.projectIssue.id + '/module',
        formData,
      ).then(
        (res) => {
          this.issueModulesEdit = false
          this.refreshIssue()
        },
        () => {},
      )
    },
    refreshIssue() {
      this.apiGet('app:project/project-issue/show', {
        num: this.projectIssue.num,
      }).then((res) => {
        this.projectIssue = res
      })
    },
    updateIssueTitle(title) {
      utils.once(() => {
        let formData = {
          title: title,
        }
        this.apiPut(
          'app:project/project-issue',
          this.projectIssue.id,
          formData,
        ).then(
          (res) => {},
          () => {},
        )
      })
    },
    init: function (num, id) {
      this.apiGet('app:project/project/show', { num: num }).then((res) => {
        this.project = res
        this.apiGet('app:project/project-label', {
          project_ids: [res.id],
        }).then((res) => {
          this.projectLabels = res.data
        })
        this.apiGet('app:project/project-module', {
          project_ids: [res.id],
        }).then((res) => {
          this.projectModules = res.data
        })
      })
      this.apiGet('app:project/project-issue/show', {
        num: num + '-' + id,
      }).then((res) => {
        this.projectIssue = res
        document.title =
          '[' +
          this.projectIssue.num +
          ']' +
          this.projectIssue.title +
          ' - ' +
          document.title
      })
    },
    editContent(num) {
      this.$router.push({
        path: '/content/' + num + '/edit',
      })
    },
  },
  created: function () {
    this.init(this.$route.params.num, this.$route.params.id)
  },
}
