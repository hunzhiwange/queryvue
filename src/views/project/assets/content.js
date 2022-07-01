import http from '@/utils/http'
import board_header from './../board_header'
import { mavonEditor } from "mavon-editor"
import "mavon-editor/dist/css/index.css"

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
                }
            },
            project: {
                id: 0,
                num: '',
                name: this.__('请选择项目'),
            },
            saveLoading: false,
        }
    },
    methods: {
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
