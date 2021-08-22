import http from '@/utils/http'

const resetForm = {
    key: '',
    status: '',
    type: '',
    page: 1,
    size: 10,
}

export default {
    data() {
        return {
            searchForm: Object.assign({}, resetForm),
            searchRule: {},
            searchItem: {
                status: [{status: '1', title: this.__('启用')}, {status: '0', title: this.__('禁用')}],
            },
            searchShow: false,
        }
    },
    methods: {
        search(page, pageSize) {
            this.searchForm.page = resetForm.page

            if (page) {
                this.searchForm.page = page
            }

            if (pageSize) {
                this.searchForm.size = pageSize
            }

            this.apiGet('project', this.searchForm).then(res => {
                this.$emit('getDataFromSearch', res)
            })
        },
        reset() {
            Object.assign(this.searchForm, resetForm)
            this.search()
        },
        add() {
            this.$emit('add')
        },
        toggleShow() {
            this.searchShow = !this.searchShow
        },
    },
    mixins: [http],
}