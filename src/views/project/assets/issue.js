import http from '@/utils/http'
import {validateAlphaDash} from '@/utils/validate'
import board_header from './../board_header'
import projectTemplate from './template'
//see https://github.com/SortableJS/Vue.Draggable
import draggable from 'vuedraggable'
import VeLine from 'v-charts/lib/line.common'
import { mavonEditor } from "mavon-editor"
import "mavon-editor/dist/css/index.css"

const jsondata = '{"date":["08-24","08-25","08-26","08-27","08-28","08-29","08-30","08-31","09-01","09-02"],"task":[66,60,60,61,61,0,0,54,0,55],"undoneTask":[37,14,16,17,6,0,0,9,0,10],"baseLineList":[37,32.9,28.799999999999997,24.699999999999996,20.599999999999994,16.499999999999993,12.399999999999993,8.299999999999994,4.199999999999994,0]}'
const overdata = JSON.parse(jsondata)

const resetForm = {
    name: '',
    num: '',
    status: 1,
    template: [],
}

const resetFormCommonUser = {
    selectUser: [],
}

const resetUserForm = {
    key: '',
    project_id: null,
    page: 1,
    size: 10,
}

const projectTypeIcon = {
    'bug': {
        'icon': 'ios-bug',
        'color': 'red',
    },
    'task': {
        'icon': 'ios-list-box-outline',
        'color': 'blue',
    },
    'product': {
        'icon': 'md-map',
        'color': 'green',
    },
    'story': {
        'icon': 'md-mail-open',
        'color': 'purple',
    },
    'doc': {
        'icon': 'ios-document-outline',
        'color': 'red',
    },
    'process': {
        'icon': 'ios-document-outline',
        'color': 'red',
    },
}

const resetFormUser = {}

export default {
    components: {
        draggable,
        VeLine,
        board_header,
        mavonEditor,
    },
    data() {
        return {
            loadingUserTable: true,
            rules: {
                name: [
                    {
                        required: true,
                        message: this.__('请输入项目名字'),
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
            },
            projectLabels: [],
            projects: [],
            project: {
                id: 0,
                num: '',
                name: this.__('请选择项目'),
            },
            burnoutMap: {
                loading: true,
                chartData: {
                    columns: ['日期', '实际剩余任务', '理想剩余任务'],
                    rows: []
                },
                series: [
                    {
                        type: 'line',
                        name: '实际剩余任务',
                        smooth: false,
                        color: '#1890ff',
                        data: [],
                    },
                    {
                        type: 'line',
                        name: '理想剩余任务',
                        color: '#52C41A',
                        smooth: false,
                        lineStyle: {
                            type: 'dashed'
                        },
                        data: []
                    },
                ],
                chartSettings: {},
                chartExtend: {
                    grid: {
                        left: '5',
                        right: '20',
                        top: '10',
                        bottom: '0'
                    },
                    xAxis: {
                        show: true,
                        // boundaryGap: false,
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        show: true,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dashed',
                                color: ['#e4e4e4']
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#fff',
                        textStyle: {
                            color: '#333'
                        },
                        borderWidth: 1,
                        borderColor: '#e8e8e8',
                    },
                    axisPointer: {
                        lineStyle: {
                            width: 0
                        }
                    }
                }
            },
            chartData: {
                columns: ['日期', '任务'],
                rows: [],
            },
            chartSettings: {
                area: true,
                itemStyle: {
                    color: '#1890ff'
                },
                areaStyle: {
                    color: '#e6f7ff'
                }
            },
            chartExtend: {
                grid: {
                    left: '-20',
                    right: '0',
                    top: '10',
                    bottom: '0'
                },
                xAxis: {
                    show: false,
                },
                yAxis: {
                    show: false,
                },
                tooltip: {
                    backgroundColor: '#fff',
                    textStyle: {
                        color: '#333'
                    },
                    borderWidth: 1,
                    borderColor: '#e8e8e8',
                },
                axisPointer: {
                    lineStyle: {
                        width: 0
                    }
                }
            },
            projectIssue: {
                project_type: {
                    content_type: 1,
                },
                project_content: {
                    content: '',
                },
                project: {
                    name: '',
                    num: '',
                }
            },
            issueModulesEdit: false,
            projectModules: [],
            issueEditModules: [],
            processUrl: '',
        }
    },
    methods: {
        previewProcess() {
            this.$router.push({
                path: '/board/process/'+this.projectIssue.num,
            })
        },
        previewContent() {
            this.$router.push({
                path: '/board/content/'+this.projectIssue.num,
            })
        },
        editTaskModules() {
            this.issueModulesEdit = true
            this.issueEditModules = []
            this.projectIssue.project_modules.forEach (item => {
                this.issueEditModules.push(item.id)
            })
        },
        cancelIssueModulesForm() {
            this.issueModulesEdit = false
        },
        updateTaskModules () {
            var formData = {
                modules : this.issueEditModules,
            }
            this.apiPut('project-issue', this.projectIssue.id+'/module', formData).then(
                res => {
                    this.issueModulesEdit = false
                    this.refreshIssue()
                },
                () => {
                }
            )
        },
        refreshIssue() {
            this.apiGet('project-issue/show', {num: this.projectIssue.num}).then(res => {
                this.projectIssue = res
            })
        },
        init: function(num, id) {
            this.apiGet('project/show', {num: num}).then(res => {
                this.project = res
                this.apiGet('project-label', {project_ids: [res.id]}).then(res => {
                    this.projectLabels = res.data
                })
                this.apiGet('project-module', {project_ids: [res.id]}).then(res => {
                    this.projectModules = res.data
                })
            })
            this.apiGet('project-issue/show', {num: num+'-'+id}).then(res => {
                this.projectIssue = res
            })
        },
        handleSubmit(form) {
            this.$refs[form].validate(pass => {
                if (pass) {
                    this.loading = !this.loading
                    if (!this.formItem.id) {
                        this.saveProject(form)
                    } else {
                        this.updateProject(form)
                    }
                }
            })
        },
        saveProject(form) {
            var formData = this.formItem
            formData.template = this.seletedProjectTemplateData
            this.apiPost('project', formData).then(
                res => {
                    let addNode = Object.assign({}, this.formItem, res)
                    this.data.unshift(addNode)
                    this.loading = !this.loading
                    this.cancelMinForm(form)
                },
                () => {
                    this.loading = !this.loading
                }
            )
        },
        updateProject(form) {
            var formData = this.formItem
            this.apiPut('project', this.formItem.id, formData).then(
                res => {
                    this.data.forEach((item, index) => {
                        if (item.id === this.formItem.id) {
                            this.$set(this.data, index, res)
                        }
                    })
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
        cancelMinUser: function() {
            this.minUser = false
        },
        user: function(params) {
            this.minUser = true
            this.viewDetail = params.row
            this.minUserProjectId = params.row.id
            this.searchUser()
        },
        searchUser: function() {
            this.loadingUserTable = false
            this.searchUserForm.project_id = this.minUserProjectId
            this.apiGet('project/user', this.searchUserForm).then(res => {
                this.userData = res.data
                this.userTotal = res.page.total_record
                this.userPage = res.page.current_page
                this.userPageSize = res.page.per_page
                this.loadingUserTable = !this.loadingUserTable
            })
        },
        searchCommonUser(query) {
            query = query.replace(/(^\s*)|(\s*$)/g, '')
            this.userSearchKey = query

            utils.once(() => {
                if (query !== '') {
                    this.loadingCommonUser = true
                    this.apiGet('user', {key: query, size: 9999, status: 1}).then(res => {
                        this.loadingCommonUser = false
                        this.commonUsers = res.data
                    })
                } else {
                    this.commonUsers = []
                }
            }, 500)
        },
        changeCommonUser() {},
        resetUser() {
            Object.assign(this.searchUserForm, resetUserForm)
            this.searchUser()
        },
        setMember(params) {
            var formData = {
                project_id: this.minUserProjectId,
                user_id: params.row.user_id,
            }

            this.loadingUserTable = !this.loadingUserTable
            this.apiPost('project/set-member', formData).then(
                res => {
                    this.userData.forEach((item, index) => {
                        if (item.user_id === params.row.user_id) {
                            item.extend_type = res.extend_type
                            item.extend_type_enum = res.extend_type_enum
                            this.$set(this.userData, index, item)
                        }
                    })
                    this.loadingUserTable = !this.loadingUserTable
                },
                () => {
                    this.loadingUserTable = !this.loadingUserTable
                }
            )
        },
        setAdministrator(params) {
            var formData = {
                project_id: this.minUserProjectId,
                user_id: params.row.user_id,
            }

            this.loadingUserTable = !this.loadingUserTable
            this.apiPost('project/set-administrator', formData).then(
                res => {
                    this.userData.forEach((item, index) => {
                        if (item.user_id === params.row.user_id) {
                            item.extend_type = res.extend_type
                            item.extend_type_enum = res.extend_type_enum
                            this.$set(this.userData, index, item)
                        }
                    })
                    this.loadingUserTable = !this.loadingUserTable
                },
                () => {
                    this.loadingUserTable = !this.loadingUserTable
                }
            )
        },
        deleteUser(params) {
            this.$Modal.confirm({
                title: this.__('提示'),
                content: this.__('确认删除该成员?'),
                onOk: () => {
                    var formData = {
                        project_id: this.minUserProjectId,
                        user_id: params.row.user_id,
                    }
                    this.loadingUserTable = !this.loadingUserTable
                    this.apiPost('project/delete-user', formData).then(
                        res => {
                            this.userData.splice(params.index, 1)
                            this.loadingUserTable = !this.loadingUserTable
                        },
                        () => {
                            this.loadingUserTable = !this.loadingUserTable
                        }
                    )
                },
                onCancel: () => {},
            })
        },
        reset() {
            this.formItem = resetForm
        },
        passwordValidate(id) {
            if (id) {
                this.liveNode = false
                if (this.formItem.password) {
                    this.rules.password = this.rules.passwordBackup
                } else {
                    this.rules.password = []
                }
                this.liveNode = true
            }
        },
        addUser() {
            this.rightForm = true
        },
        handleAddUserSubmit(form) {
            this.$refs[form].validate(pass => {
                if (pass) {
                    var formData = {
                        project_id: this.minUserProjectId,
                        user_ids: this.formCommonUser.selectUser,
                    }

                    this.loading = !this.loading
                    this.loadingUserTable = !this.loadingUserTable
                    this.apiPost('project/addUsers', formData).then(
                        res => {
                            this.loading = !this.loading
                            this.rightForm = false
                            this.commonUsers = []
                            this.selectUser = []
                            this.searchUser()
                            this.loadingUserTable = !this.loadingUserTable
                        },
                        () => {
                            this.loading = !this.loading
                            this.loadingUserTable = !this.loadingUserTable
                        }
                    )
                }
            })
        },
        editProcess(num) {
            this.$router.push({
                path: '/project/process/'+num,
            })
        },
        editContent(num) {
            this.$router.push({
                path: '/project/content/'+num,
            })
        },
    },
    watch: {
        $route(to, from) {
            this.init(to.params.num)
        }
    },
    computed: {
        editProp () {
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
        seletedProjectTemplateData: function () {
            let selecedData = this.projectTemplate.find(item => {
                return item.key === this.seletedProjectTemplate;
            })
            selecedData = selecedData || {}
            return selecedData
        },
        dragOptions() {
            return {
                animation: 1,
                group: "description",
                disabled: !this.editable,
                ghostClass: "ghost"
            };
        },
        listString() {
            return JSON.stringify(this.dragList, null, 2);
        },
    },
    created: function() {
        this.init(this.$route.params.num, this.$route.params.id)
    },
    mixins: [http],
}
