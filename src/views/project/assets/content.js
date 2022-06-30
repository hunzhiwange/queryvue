import http from '@/utils/http'

export default {
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
        }
    },
    methods: {
        init: function(id) {
            this.apiGet('project-issue/show', {num: id}).then(res => {
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
    mounted: function() {
        this.init(this.$route.params.id)

    },
    mixins: [http],
}
