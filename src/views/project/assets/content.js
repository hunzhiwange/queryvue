import board_header from './../board_header'
import { Transformer } from 'markmap-lib'
import * as markmap from 'markmap-view'
import * as d3 from 'd3'

import { getCurrentInstance } from 'vue'

import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor'
import '@kangc/v-md-editor/lib/style/codemirror-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// highlightjs
//import hljs from 'highlight.js'
import hljs from '../../../utils/highlight'

// codemirror 编辑器的相关资源
import Codemirror from 'codemirror'
// mode
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/vue/vue'
// edit
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchbrackets'
// placeholder
import 'codemirror/addon/display/placeholder'
// active-line
import 'codemirror/addon/selection/active-line'
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
// style
import 'codemirror/lib/codemirror.css'
import VMdPreview from '_@kangc_v-md-editor@2.3.15@@kangc/v-md-editor/lib/preview'

import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'

import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/npm'
import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css'

VMdEditor.Codemirror = Codemirror
VMdEditor.use(githubTheme, {
  Hljs: hljs,
})

VMdEditor.use(createTodoListPlugin())
VMdEditor.use(createMermaidPlugin())

export default {
  setup() {
    getCurrentInstance().appContext.app.use(VMdEditor)
  },
  components: {
    board_header,
  },
  data() {
    return {
      projectIssue: {
        name: '',
        num: '',
        project_content: {
          content: undefined,
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
      saveLoading: false,
      instanceMarkmap: null,
      optionsMindMap: {
        color: null,
      },
      levelMindMap: [
        {
          value: 0,
          label: '节点',
        },
        {
          value: 1,
          label: '一级',
        },
        {
          value: 2,
          label: '二级',
        },
        {
          value: 3,
          label: '三级',
        },
        {
          value: 4,
          label: '四级',
        },
        {
          value: 5,
          label: '五级',
        },
        {
          value: 6,
          label: '六级',
        },
      ],
      currentLevelMindMap: 2,
      mindMapView: false,
    }
  },
  methods: {
    zoomIn() {
      this.instanceMarkmap.rescale(1.25)
    },
    zoomOut() {
      this.instanceMarkmap.rescale(0.8)
    },
    fit() {
      this.instanceMarkmap.fit()
    },
    mindMap() {
      const transformer = new Transformer()

      // 1. transform markdown
      const { root, features } = transformer.transform(
        this.projectIssue.project_content.content,
      )

      //const { markmap } = window;
      const { Markmap, loadCSS, loadJS } = markmap

      let options = {
        embedAssets: true,
        maxWidth: 300,
      }

      if (this.currentLevelMindMap) {
        options['initialExpandLevel'] = this.currentLevelMindMap
      }

      if (this.optionsMindMap.color) {
        options['color'] = () => this.optionsMindMap.color
      }

      const mindMapContainer = document.querySelector('#markmap')
      mindMapContainer.innerHTML = ''
      let instanceMarkmap = Markmap.create(mindMapContainer, options, root)
      this.instanceMarkmap = instanceMarkmap
    },
    editorChange: function () {
      if (this.projectIssue.project_type.content_type == 7) {
        utils.once(() => this.mindMap(), 2000)
      }
    },
    init: function (num, id) {
      this.apiGet('app:project/project/show', { num: num }).then((res) => {
        this.project = res
      })
      this.apiGet('app:project/project-issue/show', {
        num: num + '-' + id,
      }).then((res) => {
        if (res.project_type && res.project_type.content_type == 6) {
          utils.error(this.__('非内容文档'))
          return
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
    mindMapPreview() {
      if (this.projectIssue.project_type.content_type == 7) {
        this.mindMapView = true
        setTimeout(() => {
          this.mindMap()
        }, 200)
      }
    },
    refresh() {
      this.init(this.$route.params.num)
    },
    backIssue() {
      this.$router.push({
        path: '/issue/' + this.projectIssue.num,
      })
    },
    saveData(data) {
      var formData = {
        content: data.data,
        //sub_title: data.title,
      }
      this.saveLoading = true
      var projectIssueId = this.projectIssue.id
      this.apiPut(
        'app:project/project-issue',
        projectIssueId + '/content',
        formData,
      ).then(
        (res) => {
          this.saveLoading = !this.saveLoading
        },
        () => {
          this.saveLoading = !this.saveLoading
        },
      )
    },
    saveContent() {
      this.saveData({
        data: this.projectIssue.project_content.content,
      })
    },
    // imageUpload(pos, $file) {
    //     var formdata = new FormData()
    //     formdata.append("file", $file)
    //     this
    //         .apiPost('attachment/upload', formdata, {}, { "Content-Type": "multipart/form-data" })
    //         .then(url => {
    //             this.$refs.projectContent.$img2Url(pos, url.file_url)
    //         })
    // },
    handleUploadImage(event, insertImage, files) {
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
      files.forEach((file) => {
        let formdata = new FormData()
        formdata.append('file', file)
        this.apiPost(
          'app:attachment/attachment/upload',
          formdata,
          {},
          { 'Content-Type': 'multipart/form-data' },
        ).then((url) => {
          insertImage({
            url: url.file_url,
            desc: file.name,
          })
        })
      })
    },
  },
  created: function () {
    this.init(this.$route.params.num, this.$route.params.id)
  },
  mixins: [],
}
