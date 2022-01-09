import http from '@/utils/http'
import board_header from './../board_header'

export default {
    components: {
        board_header,
    },
    data() {
        return {
            project: {},
        }
    },
    methods: {
        init: function(num) {
            this.apiGet('project/show', {num: num}).then(res => {
                this.project = res
                this.apiGet('project-label', {project_ids: [res.id]}).then(res => {
                    this.projectLabels = res.data
                    this.$refs.search.search()
                })
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
        this.init(this.$route.params.num)
    },
    mixins: [http],
}
