import http from '@/utils/http'
import board_header from './../board_header'
import { mavonEditor } from "mavon-editor"
import "mavon-editor/dist/css/index.css"
import { Transformer } from 'markmap-lib'
import * as markmap from 'markmap-view'

export default {
    components: {
        board_header,
        mavonEditor,
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
                },
                {
                    value: 6,
                    label: '六级'
                },
            ],
            currentLevelMindMap: 0,
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
        editorChange: function() {
            if (this.projectIssue.project_type.content_type == 7) {
                utils.once(() => this.mindMap(), 2000)
            }
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
                // if (this.projectIssue.project_type.content_type == 7) {
                //     setTimeout(() => {
                //         this.mindMap()
                //     }, 500)
                // }
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
    },
    watch: {
        $route(to, from) {
            this.init(to.params.num)
        }
    },
    computed: {
    },
    created: function () {
        this.init(this.$route.params.num, this.$route.params.id)

    },
    mixins: [http],
}
