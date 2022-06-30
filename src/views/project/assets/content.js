import http from '@/utils/http'
import board_header from './../board_header'

export default {
    components: {
        board_header,
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
        }
    },
    methods: {
        init: function(num, id) {
            this.apiGet('project/show', {num: num}).then(res => {
                this.project = res
            })
            this.apiGet('project-issue/show', {num: num+'-'+id}).then(res => {
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
                path: '/board/issue/'+this.projectIssue.num,
            })
        },
        saveData(data) {
            var formData = {
                content: data.data,
                //sub_title: data.title,
            }
            var projectIssueId = this.projectIssue.id
            this.apiPut('project-issue', projectIssueId+'/content', formData).then(
                res => {

                },
                () => {
                }
            )
        },
        saveContent() {
            this.saveData({
                data: this.projectIssue.project_content.content,
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
    created: function() {
        this.init(this.$route.params.num, this.$route.params.id)

    },
    mixins: [http],
}
