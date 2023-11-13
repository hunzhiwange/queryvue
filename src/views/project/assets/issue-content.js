import board_header from './../board_header'
import Swagger from './../../../components/document/swagger/index'
import ProcessView from './../process_view'
import MindMapView from './../mind-map-view'
import ContentView from './../content-view'

import { getCurrentInstance } from 'vue'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'

import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/npm'
import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css'

// highlightjs
import hljs from '../../../utils/highlight'
import VMdEditor from "_@kangc_v-md-editor@2.3.17@@kangc/v-md-editor/lib/codemirror-editor";

VMdPreview.use(githubTheme, {
  Hljs: hljs,
})

VMdPreview.use(createTodoListPlugin())
VMdPreview.use(createMermaidPlugin())

export default {
  components: {
    board_header,
    Swagger,
    ProcessView,
    MindMapView,
    ContentView,
  },
  props: {
    minContent: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    getCurrentInstance().appContext.app.use(VMdPreview)
  },
  data() {
    return {
      projectIssue: {
        name: '',
        num: '',
        project_content: {
          content: '',
        },
        project: {
          name: '',
          num: '',
        },
        project_type: {
          content_type: 1,
        },
      },
      project: {
        id: 0,
        num: '',
        name: this.__('请选择项目'),
      },
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
        if (res.project_type && res.project_type.content_type == 6) {
          //utils.error(this.__('非内容文档'))
          //return
        }

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
    refresh() {
      this.init(this.$route.params.num)
    },
    backIssue() {
      this.$router.push({
        path: '/issue/' + this.projectIssue.num,
      })
    },
  },
  created: function () {
    this.init(this.$route.params.num, this.$route.params.id)
  },
  mixins: [],
}
