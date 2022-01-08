import http from '@/utils/http'
import {validateAlphaDash} from '@/utils/validate'
import search from '../../project-issue/search/index'
import projectTemplate from './template'
//see https://github.com/SortableJS/Vue.Draggable
import draggable from 'vuedraggable'
import VeLine from 'v-charts/lib/line.common'

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
        search,
        draggable,
        VeLine,
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
            projectIssue: {},
            issueModulesEdit: false,
            projectModules: [],
            issueEditModules: [],
        }
    },
    methods: {
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
        getProjectReport() {
            let rows = [];
            overdata.date.forEach(v => {
                rows.push({'日期': v})
            })
            this.burnoutMap.loading = false
            this.burnoutMap.chartData.rows = rows
            this.burnoutMap.series[0].data = overdata.undoneTask
            this.burnoutMap.series[1].data = overdata.baseLineList
        },
        orderList() {
            this.list = this.list.sort((one, two) => {
                return one.order - two.order;
            });
        },
        onMove({
            relatedContext,
            draggedContext
        }) {
            const relatedElement = relatedContext.element;
            const draggedElement = draggedContext.element;
            return (
                (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
            );
        },
        // 添加任务
        addTask(index) {
            var order = this.order++;
            this.dragList[index].list.push({
                name: '新增任务' + order,
                order: order,
                fixed: false
            })
        },
        // 删除任务
        delTask(index, k) {
            this.dragList[index].list.splice(k, 1);
        },
        // 添加任务阶段
        addStage() {
            var order = this.order++;
            this.dragList.push({
                'list': [],
                'order': order,
                'name': "新增任务阶段" + order,
                'fixed': false
            });
        },
        // 删除任务阶段
        delStage(index) {
            this.dragList.splice(index, 1);
        },
        getDataFromSearch(data) {
            // this.data = data.data
            // this.total = data.page.total_record
            // this.page = data.page.current_page
            // this.pageSize = data.page.per_page
            // this.loadingTable = false

            let map = {}
            data.data.forEach ((item, key) => {
                if (!map.hasOwnProperty(item.project_label_id)) {
                    map[item.project_label_id] = []
                }
                map[item.project_label_id].push({
                    name: item.title,
                    num: item.num,
                    create_at: item.create_at,
                    completed: item.completed,
                    completed_bool: 2 === item.completed,
                    completed_date: item.completed_date,
                    project_releases: item.project_releases,
                    project_tags: item.project_tags,
                    project_modules: item.project_modules,
                    project_type: item.project_type,
                    project_type_icon: {
                        icon: projectTypeIcon[item.project_type.icon]['icon'],
                        color: projectTypeIcon[item.project_type.icon]['color'],
                    },
                    order: item.sort,
                    fixed: false,
                })
            })

            let hello = []
            this.projectLabels.forEach((item, key) => {
                hello.push({
                    label_id: item.id,
                    order: item.sort,
                    name: item.name,
                    fixed: false,
                    list: map.hasOwnProperty(item.id) ? map[item.id] : [],
                })
            })

            this.dragList = hello
        },
        getProjectFavorDataFromSearch(data) {
            let favorProjectIds = []
            data.data.forEach(item => {
                favorProjectIds.push(item.id)
            })
            this.favorProjectIds = favorProjectIds
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
                content: this.__('确认删除该项目?'),
                onOk: () => {
                    this.loadingTable = !this.loadingTable
                    this.apiDelete('project', params.row.id).then(res => {
                        this.loadingTable = !this.loadingTable
                        this.data.splice(params.index, 1)
                    }, () => {
                        this.loadingTable = !this.loadingTable
                    })
                },
                onCancel: () => {},
            })
        },
        favor(params) {
            let data = {
                project_id: params.row.id,
            }
            this.loadingTable = !this.loadingTable
            this.apiPost('project/favor', data).then(res => {
                if (!this.favorProjectIds.includes(data.project_id)) {
                    this.favorProjectIds.push(data.project_id)
                }
                this.loadingTable = !this.loadingTable
            }, () => {
                this.loadingTable = !this.loadingTable
            })
        },
        cancelFavor(params) {
            let data = {
                project_id: params.row.id,
            }
            this.loadingTable = !this.loadingTable
            this.apiPost('project/cancel-favor', data).then(res => {
                if (this.favorProjectIds.includes(data.project_id)) {
                    let deleteProjectIndex = this.favorProjectIds.indexOf(data.project_id)
                    if (deleteProjectIndex > -1) {
                        this.favorProjectIds.splice(deleteProjectIndex, 1)
                    }
                }
                this.loadingTable = !this.loadingTable
            }, () => {
                this.loadingTable = !this.loadingTable
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

            this.apiPost('project/status', data).then(res => {
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
        init: function(num, id) {
            this.apiGet('project', {status: 1}).then(res => {
                this.projects = res.data
            })
            this.apiGet('project/show', {num: num}).then(res => {
                this.project = res
                this.apiGet('project-label', {project_ids: [res.id]}).then(res => {
                    this.projectLabels = res.data
                    this.$refs.search.search()
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
    },
    watch: {
        $route(to, from) {
            this.init(to.params.num)
        }
    },
    computed: {
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
    mounted: function() {
        this.init(this.$route.params.num, this.$route.params.id)
    },
    mixins: [http],
}
