import { Transformer } from 'markmap-lib'
import * as markmap from 'markmap-view'
//import * as d3 from 'd3'
import moment from 'moment'

export default {
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
      currentLevelMindMap: 0,
      currentHeightMindMap: 1000,
      tempHeightMindMap: 1000,
      currentWidthMindMap: 100,
      tempWidthMindMap: 100,
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
    downloadAsSvg() {
      let svg = document.querySelector('#markmap')
      let svgContent = new XMLSerializer().serializeToString(svg)
      svgContent = btoa(unescape(encodeURIComponent(svgContent)))
      svgContent = 'data:application/octet-stream;base64,' + svgContent

      const aLink = document.createElement('a')
      aLink.href = svgContent
      aLink.setAttribute(
        'download',
        this.projectIssue.title + '-' + moment().format('YYYY-MM-DD') + '.svg',
      )
      document.body.appendChild(aLink)
      aLink.click()
      document.body.removeChild(aLink)
    },
    downloadAsPng() {
      let svg = document.querySelector('#markmap')
      let title =
        this.projectIssue.title + '-' + moment().format('YYYY-MM-DD') + '.png'

      let svgContent = new XMLSerializer().serializeToString(svg)
      svgContent = btoa(unescape(encodeURIComponent(svgContent)))
      svgContent = 'data:image/svg+xml;base64,' + svgContent

      let image = new Image()
      image.src = svgContent
      image.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = svg.clientWidth
        canvas.height = svg.clientHeight
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0)

        const a = document.createElement('a')
        a.download = title
        a.href = canvas.toDataURL('image/png')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    },
    changeCurrentHeightMindMap(value) {
      utils.once(() => {
        this.currentHeightMindMap = value
        setTimeout(() => {
          this.fit()
        }, 0)
      }, 200)
    },
    changeCurrentWidthMindMap(value) {
      utils.once(() => {
        this.currentWidthMindMap = value
        setTimeout(() => {
          this.fit()
        }, 0)
      }, 200)
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
    init() {
      if (this.projectIssue.project_type.content_type == 7) {
        let docContent = this.projectIssue.project_content.content
        let docContentHeight = docContent.split('\n').length * 35
        let tempHeight = docContentHeight % 500
        if (tempHeight > 0) {
          docContentHeight += 500 - tempHeight
        }

        this.tempHeightMindMap = this.currentHeightMindMap = docContentHeight
        setTimeout(() => {
          this.mindMap()
        }, 200)
      }
    },
  },
  watch: {
    'docContent.content': {
      handler(newVal, oldVal) {
        this.init()
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    editProp() {
      let data = {
        subfield: false, // 单双栏模式
        defaultOpen: 'preview', //edit： 默认展示编辑区域 ， preview： 默认展示预览区域
        editable: false,
        toolbarsFlag: false,
        scrollStyle: true,
        boxShadow: false,
      }
      return data
    },
  },
}
