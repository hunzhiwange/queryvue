import http from '@/utils/http'
import search from '../search/index'
import {validateAlphaDash} from '@/utils/validate'

const resetForm = {
    id: null,
    name: '',
    num: '',
    color: '',
    icon: '',
    content_type: '',
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
                    title: this.__('名字'),
                    key: 'name',
                },
                {
                    title: this.__('编号'),
                    key: 'num',
                    render: (h, params) => {
                        return <tag color="default">{params.row.num}</tag>
                    },
                },
                {
                    title: this.__('内容类型'),
                    key: 'content_type_enum',
                },
                {
                    title: this.__('排序'),
                    key: 'sort',
                    render: (h, params) => {
                        return <tag color="default">{params.row.sort}</tag>
                    },
                },
                {
                    title: this.__('颜色'),
                    width: 130,
                    key: 'color',
                    render: (h, params) => {
                        return <Badge color={params.row.color} text={params.row.color} />
                    },
                },
                {
                    title: this.__('图标'),
                    key: 'icon',
                },
                {
                    title: this.__('创建时间'),
                    width: 170,
                    key: 'create_at',
                },
                {
                    title: this.__('状态'),
                    key: 'status_enum',
                    width: 120,
                    render: (h, params) => {
                        return <Badge status={1 === params.row.status ? 'success' : 'default'} text={params.row.status_enum} />
                    },
                },
                {
                    title: this.__('操作'),
                    key: 'action',
                    width: 135,
                    fixed: 'right',
                    align: 'left',
                    render: (h, params) => {
                        return (
                            <div>
                                <buttonGroup size="small" shape="circle">
                                    <i-button
                                        type="text"
                                        onClick={() => this.edit(params)}
                                        v-show={utils.permission('project_type_edit_button')}>
                                        {this.__('编辑')}
                                    </i-button>
                                    <i-button
                                        type="text"
                                        onClick={() => this.remove(params)}
                                        v-show={utils.permission('project_type_delete_button')}>
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
                        message: this.__('请输入项目类型名字'),
                    },
                ],
                num: [
                    {
                        required: true,
                        message: this.__('请输入项目编号'),
                    },
                    {
                        validator: validateAlphaDash,
                    },
                ],
                icon: [
                    {
                        required: true,
                        message: this.__('请输入项目图标'),
                    },
                    {
                        validator: validateAlphaDash,
                    },
                ],
                color: [
                    {
                        required: true,
                        message: this.__('请输入颜色'),
                    },
                ],
                content_type: [
                    {
                        required: true,
                        message: this.__('请选择内容类型'),
                    },
                ],
            },
            loading: false,
            selectedData: [],
            projects: [],
            projectTypeContentType: {},
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
        add: function() {
            this.minForm = true
            this.formItem.id = ''
            this.reset()
        },
        remove(params) {
            this.$Modal.confirm({
                title: this.__('提示'),
                content: this.__('确认删除该项目类型?'),
                onOk: () => {
                    this.loadingTable = !this.loadingTable
                    this.apiDelete('project-type', params.row.id).then(res => {
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

            this.apiPost('project-type/status', data).then(res => {
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

            this.apiGet('search', {
                'entity:enums':[
                    'Project:ProjectType:content_type',
                ],
            }).then(res => {
                this.projectTypeContentType = res['entity']['enums']['Project:ProjectType:content_type']
            })
        },
        handleSubmit(form) {
            this.$refs[form].validate(pass => {
                if (pass) {
                    this.loading = !this.loading
                    if (!this.formItem.id) {
                        this.saveProjectType(form)
                    } else {
                        this.updateProjectType(form)
                    }
                }
            })
        },
        saveProjectType(form) {
            var formData = this.formItem

            this.apiPost('project-type', formData).then(
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
        updateProjectType(form) {
            let formData = Object.assign({}, this.formItem)
            delete formData.project_id

            this.apiPut('project-type', this.formItem.id, formData).then(
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
    },
    mixins: [http],
}
