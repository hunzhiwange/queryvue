import http from '@/utils/http'
import board_header from './../board_header'
import { mavonEditor } from "mavon-editor"
import "mavon-editor/dist/css/index.css"
import Swagger from '../../../components/document/swagger/index'
import { Transformer } from 'markmap-lib'
import * as markmap from 'markmap-view'
import moment from 'moment'

export default {
    components: {
        board_header,
        mavonEditor,
        Swagger,
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
                }
            },
            project: {
                id: 0,
                num: '',
                name: this.__('请选择项目'),
            },
            saveLoading: false,
            instanceMarkmap:null,
            optionsMindMap: {
                color: null,
            },
            levelMindMap: [
                {
                    value: 0,
                    label: '节点'
                },
                {
                    value: 1,
                    label: '一级'
                },
                {
                    value: 2,
                    label: '二级'
                },
                {
                    value: 3,
                    label: '三级'
                },
                {
                    value: 4,
                    label: '四级'
                },
                {
                    value: 5,
                    label: '五级'
                }
            ],
            currentLevelMindMap: 0,
            currentHeightMindMap: 1000,
            tempHeightMindMap: 1000,
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
            aLink.setAttribute('download', this.projectIssue.title+moment().format('YYYY-MM-DD')+'.svg' )
            document.body.appendChild(aLink)
            aLink.click()
            document.body.removeChild(aLink)
        },
        downloadAsPng() {
            let svg = document.querySelector('#markmap')
            let title = this.projectIssue.title+moment().format('YYYY-MM-DD')+'.png'

            let svgContent = new XMLSerializer().serializeToString(svg);
            svgContent = btoa(unescape(encodeURIComponent(svgContent)));
            svgContent = 'data:image/svg+xml;base64,' + svgContent;

            let image = new Image()
            image.src = svgContent
            image.onload = function() {
                const canvas = document.createElement('canvas')
                canvas.width = svg.clientWidth
                canvas.height = svg.clientHeight
                const context = canvas.getContext("2d")
                context.drawImage(image, 0, 0)

                const a = document.createElement("a")
                a.download = title
                a.href = canvas.toDataURL("image/png")
                document.body.appendChild(a)
                a.click()
            }
        },
        changeCurrentHeightMindMap(value) {
            utils.once(() => {
                this.currentHeightMindMap = value
                setTimeout(() => {
                    this.fit()
                }, 0)
            }, 500)
        },
        mindMap() {
            const transformer = new Transformer()

            // 1. transform markdown
            const { root, features } = transformer.transform(this.projectIssue.project_content.content)

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
        init: function (num, id) {
            this.apiGet('project/show', { num: num }).then(res => {
                this.project = res
            })
            this.apiGet('project-issue/show', { num: num + '-' + id }).then(res => {
                if (res.project_type && res.project_type.content_type == 6) {
                    utils.error(this.__('非内容文档'))
                    return
                }
                this.projectIssue = res
                document.title = '[' + this.projectIssue.num + ']' +  this.projectIssue.title + ' - ' + document.title
                if (this.projectIssue.project_type.content_type == 7) {
                    let docContent = this.projectIssue.project_content.content
                    let docContentHeight = docContent.split('\n').length*35
                    let tempHeight = docContentHeight%500
                    if (tempHeight > 0) {
                        docContentHeight += 500-tempHeight
                    }

                    this.tempHeightMindMap = this.currentHeightMindMap = docContentHeight
                    setTimeout(() => {
                        this.mindMap()
                    }, 500)
                }
            })
        },
        refresh() {
            this.init(this.$route.params.num)
        },
        backIssue() {
            this.$router.push({
                path: '/board/issue/' + this.projectIssue.num,
            })
        },
        saveData(data) {
            var formData = {
                content: data.data,
                //sub_title: data.title,
            }
            this.saveLoading = true
            var projectIssueId = this.projectIssue.id
            this.apiPut('project-issue', projectIssueId + '/content', formData).then(
                res => {
                    this.saveLoading = !this.saveLoading
                },
                () => {
                    this.saveLoading = !this.saveLoading
                }
            )
        },
        saveContent() {
            this.saveData({
                data: this.projectIssue.project_content.content,
            })
        },
        imageUpload(pos, $file) {
            var formdata = new FormData()
            formdata.append("file", $file)
            this
                .apiPost('attachment/upload', formdata, {}, { "Content-Type": "multipart/form-data" })
                .then(url => {
                    this.$refs.projectContent.$img2Url(pos, url.file_url)
                })
        },
        onAddUrl() {
            // https://blog.csdn.net/qq_38667939/article/details/123908281
            this.$nextTick(function () {
                let _aList = document.querySelectorAll(".v-note-navigation-content a");
                for (let i = 0; i < _aList.length; i++) {
                    let _aParent = _aList[i].parentNode;
                    let _a = _aParent.firstChild;
                    if (!_a.id) continue; // 把不属于导航中的a标签去掉，否则会报错
                    let _text = _aParent.lastChild;
                    let text = _text.textContent;
                    _a.href = "#" + _a.id;
                    _a.innerText = text;
                    _aParent.removeChild(_text);
                    // _a.style.color = "red";
                }
            });
        },
    },
    watch: {
        $route(to, from) {
            this.init(to.params.num)
        }
    },
    computed: {
        editProp() {
            let data = {
                subfield: false,// 单双栏模式
                defaultOpen: 'preview',//edit： 默认展示编辑区域 ， preview： 默认展示预览区域
                editable: false,
                toolbarsFlag: false,
                scrollStyle: true,
                boxShadow: false,
            }
            return data
        },
    },
    created: function () {
        this.init(this.$route.params.num, this.$route.params.id)

    },
    mixins: [http],
}
