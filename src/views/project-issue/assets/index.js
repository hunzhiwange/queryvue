import http from '@/utils/http'
import search from '../search/index'

const resetForm = {
    id: null,
    name: '',
    project_id: '',
    sort: 0,
    status: 1,
}

export default {
    components: {
        search,
    },
    data() {
        return {
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    className: 'table-selection',
                },
                {
                    type: 'index',
                    width: 55,
                    align: 'center',
                    className: 'table-index',
                },
                {
                    title: this.__('标题'),
                    key: 'title',
                    width: 400,
                    render: (h, params) => {
                        return <router-link to={'/board/issue/' + params.row.num}>
                                    {params.row.title}
                                </router-link>
                    },
                },
                {
                    title: this.__('编号'),
                    key: 'sort',
                    width: 170,
                    render: (h, params) => {
                        return <tag color="default">{params.row.num}</tag>
                    },
                },
                {
                    title: this.__('所属项目'),
                    key: 'project',
                    width: 180,
                    render: (h, params) => {
                        return <div>{params.row.project.name}</div>
                    },
                },
                {
                    title: this.__('创建时间'),
                    width: 170,
                    key: 'create_at',
                },
                {
                    title: this.__('更新时间'),
                    width: 170,
                    key: 'update_at',
                },
                {
                    title: this.__('项目分类'),
                    key: 'project_label',
                    width: 120,
                    render: (h, params) => {
                        return <Badge status={'default'} text={params.row.project_label.name} />
                    },
                },
                {
                    title: this.__('操作'),
                    key: 'action',
                    width: 185,
                    fixed: 'right',
                    align: 'left',
                    render: (h, params) => {
                        return (
                            <div>
                                <buttonGroup size="small" shape="circle">
                                    <i-button
                                        type="text"
                                        onClick={() => this.view(params)}
                                        v-show={utils.permission('project_issue_view_button')}>
                                        {this.__('查看')}
                                    </i-button>
                                    <i-button
                                        type="text"
                                        onClick={() => this.edit(params)}
                                        v-show={utils.permission('project_issue_edit_button')}>
                                        {this.__('编辑')}
                                    </i-button>
                                    <i-button
                                        type="text"
                                        onClick={() => this.remove(params)}
                                        v-show={utils.permission('project_issue_delete_button')}>
                                        {this.__('删除')}
                                    </i-button>
                                </buttonGroup>
                            </div>
                        )
                    },
                },
            ],
            total: 0,
            page: 1,
            pageSize: 10,
            data: [],
            loadingTable: true,
            formItem: Object.assign({}, resetForm),
            minForm: false,
            rules: {
                name: [
                    {
                        required: true,
                        message: this.__('请输入项目问题名字'),
                    },
                ],
                project_id: [
                    {
                        required: true,
                        message: this.__('请选择所属项目'),
                    },
                ],
            },
            loading: false,
            selectedData: [],
            projects: [],
        }
    },
    methods: {
        getDataFromSearch(data) {
            this.data = data.data
            this.total = data.page.total_record
            this.page = data.page.current_page
            this.pageSize = data.page.per_page
            this.loadingTable = false
        },
        view(params) {
            this.$router.push({
                path: '/board/issue/'+params.row.num,
            })
        },
        edit(params) {
            let row = params.row
            this.minForm = true
            this.formItem.id = row.id
            Object.keys(this.formItem).forEach(key => {
                if (row.hasOwnProperty(key)) {
                    this.formItem[key] = row[key]
                }
            })
        },
        add: function(currentProjectId) {
            this.minForm = true
            this.formItem.id = ''
            this.reset()
            if (currentProjectId) {
                this.formItem.project_id = parseInt(currentProjectId)
            }
        },
        remove(params) {
            this.$Modal.confirm({
                title: this.__('提示'),
                content: this.__('确认删除该项目问题?'),
                onOk: () => {
                    this.loadingTable = !this.loadingTable
                    this.apiDelete('project-issue', params.row.id).then(res => {
                        this.data.splice(params.index, 1)
                        this.loadingTable = !this.loadingTable
                    }, () => {
                        this.loadingTable = !this.loadingTable
                    })
                },
                onCancel: () => {},
            })
        },
        statusMany(type) {
            let selected = this.selectedData

            if (!selected.length) {
                utils.warning(this.__('请勾选数据'))
                return
            }

            let data = {
                ids: selected,
                status: type,
            }

            this.apiPost('project-issue/status', data).then(res => {
                this.data.forEach((item, index) => {
                    if (selected.includes(item.id)) {
                        this.$set(this.data[index], 'status', type)
                        this.$set(this.data[index], 'status_enum', 1 === type ? this.__('启用') : this.__('禁用'))
                    }
                })
            })
        },
        onSelectionChange(data) {
            let ids = []

            data.forEach(item => ids.push(item.id))

            this.selectedData = ids
        },
        init: function() {
            this.$refs.search.search()
            this.apiGet('project', {status: 1}).then(res => {
                this.projects = res.data
            })
        },
        handleSubmit(form) {
            this.$refs[form].validate(pass => {
                if (pass) {
                    this.loading = !this.loading
                    if (!this.formItem.id) {
                        this.saveProjectLabel(form)
                    } else {
                        this.updateProjectLabel(form)
                    }
                }
            })
        },
        saveProjectLabel(form) {
            var formData = this.formItem

            this.apiPost('project-issue', formData).then(
                res => {
                    this.refresh()
                    this.loading = !this.loading
                    this.cancelMinForm(form)
                },
                () => {
                    this.loading = !this.loading
                }
            )
        },
        updateProjectLabel(form) {
            let formData = Object.assign({}, this.formItem)
            delete formData.project_id

            this.apiPut('project-issue', this.formItem.id, formData).then(
                res => {
                    this.refresh()
                    this.loading = !this.loading
                    this.cancelMinForm(form)
                },
                () => {
                    this.loading = !this.loading
                }
            )
        },
        handleReset(form) {
            this.$refs[form].resetFields()
        },
        changePage(page) {
            this.page = page
            this.$refs.search.search(page, this.pageSize)
        },
        changePageSize(pageSize) {
            this.pageSize = pageSize
            this.$refs.search.search(this.page, pageSize)
        },
        cancelMinForm: function(form) {
            this.minForm = false
            this.handleReset(form)
        },
        reset() {
            this.formItem = resetForm
        },
        refresh() {
            this.$refs.search.search()
        },
    },
    computed: {},
    mounted: function() {
        this.init()
        if (this.$route.query.action) {
            if ('create' === this.$route.query.action) {
                this.add(this.$route.query.project_id)
            }
        }
    },
    mixins: [http],
}
