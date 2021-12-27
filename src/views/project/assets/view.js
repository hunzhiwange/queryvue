import http from '@/utils/http'
import {validateAlphaDash} from '@/utils/validate'
import search from '../../project-issue/search/index'
import projectTemplate from './template'
//see https://github.com/SortableJS/Vue.Draggable
import draggable from 'vuedraggable'

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

const resetIssueForm = {
    title: '',
    project_label_id: '',
    project_type_id: '',
    project_id: 0,
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
}

const resetFormUser = {}

export default {
    components: {
        search,
        draggable,
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
                    title: this.__('创建时间'),
                    key: 'create_at',
                },
                {
                    title: this.__('进度'),
                    key: 'progress',
                    render: (h, params) => {
                        return <Progress percent={params.row.progress/100} stroke-width={10} />
                    },
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
                    width: 250,
                    fixed: 'right',
                    align: 'left',
                    render: (h, params) => {
                        return (
                            <div>
                                <buttonGroup size="small" shape="circle">
                                    <i-button
                                        type="text"
                                        onClick={() => this.user(params)}
                                        v-show={utils.permission('project_role_button')}>
                                        {this.__('成员')}
                                    </i-button>
                                    <i-button
                                        type="text"
                                        onClick={() => this.edit(params)}
                                        v-show={utils.permission('project_edit_button')}>
                                        {this.__('设置')}
                                    </i-button>
                                    <i-button
                                        type="text"
                                        onClick={() => this.favor(params)}
                                        v-show={!this.favorProjectIds.includes(params.row.id) && utils.permission('project_edit_button')}>
                                        {this.__('收藏')}
                                    </i-button>
                                    <i-button
                                        type="text"
                                        onClick={() => this.cancelFavor(params)}
                                        v-show={this.favorProjectIds.includes(params.row.id) && utils.permission('project_edit_button')}>
                                        {this.__('取消收藏')}
                                    </i-button>
                                    <i-button
                                        type="text"
                                        onClick={() => this.remove(params)}
                                        v-show={utils.permission('project_delete_button')}>
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
            minUser: false,
            minUserProjectId: 0,
            searchUserForm: Object.assign({}, resetUserForm),
            userTotal: 0,
            userPage: 1,
            userPageSize: 10,
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
            loading: false,
            selectedData: [],
            roles: [],
            viewDetail: {},
            rightForm: false,
            styles: {
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static',
            },
            formCommonUser: resetFormCommonUser,
            loadingCommonUser: false,
            commonUsers: [],
            userTotal: 0,
            userPage: 1,
            userPageSize: 10,
            userPermissionId: 0,
            userSearchKey: '',
            userColumns: [
                {
                    title: this.__('用户名'),
                    key: 'user.name'
                },
                {
                    title: this.__('用户编号'),
                    key: 'user.num',
                    render: (h, params) => {
                        return <tag color="default">{params.row['user.num']}</tag>
                    },
                },
                {
                    title: this.__('成员类型'),
                    key: 'extend_type_enum'
                },
                {
                    title: this.__('加入时间'),
                    key: 'create_at'
                },
                {
                    title: this.__('操作'),
                    key: 'action',
                    width: 160,
                    fixed: 'right',
                    align: 'left',
                    render: (h, params) => {
                        return (
                            <div>
                                <buttonGroup size="small" shape="circle">
                                    <i-button
                                        type="text"
                                        onClick={() => this.setMember(params)}
                                        v-show={2 === params.row.extend_type && utils.permission('project_role_button')}>
                                        {this.__('设为成员')}
                                    </i-button>
                                    <i-button
                                        type="text"
                                        onClick={() => this.setAdministrator(params)}
                                        v-show={1 === params.row.extend_type && utils.permission('project_role_button')}>
                                        {this.__('设为管理')}
                                    </i-button>
                                    <i-button
                                        type="text"
                                        onClick={() => this.deleteUser(params)}
                                        v-show={utils.permission('project_delete_button')}>
                                        {this.__('删除')}
                                    </i-button>
                                </buttonGroup>
                            </div>
                        )
                    },
                }
            ],
            userData: [],
            commonUserRules: {
                selectUser: [
                    {
                        required: true,
                        message: this.__('请选择用户'),
                    },
                ],
            },
            favorProjectIds: [],
            projectTemplate: projectTemplate,
            seletedProjectTemplate: 'soft',
            dragList: [],
            editable: true,
            order: 1000,
            single: false,
            projectLabels: [],
            projects: [],
            project: {
                id: 0,
                num: '',
                name: this.__('请选择项目'),
            },
            beforeMove:[],
            projectLabelBeforeMove:[],
            loadingIssue: false,
            issueForm: Object.assign({}, resetIssueForm),
            issueFormRules: {
                project_type_id: [
                    {
                        required: true,
                        message: this.__('请选择任务类型'),
                    },
                ],
                title: [
                    {
                        required: true,
                        message: this.__('请输入任务标题'),
                    },
                ],
            },
            projectTypes: [],
            issueEditTags: [],
            projectTags: [],
            issueEditModules: [],
            projectModules: [],
            issueEditReleases: [],
            projectReleases: [],
        }
    },
    methods: {
        orderList() {
            this.list = this.list.sort((one, two) => {
                return one.order - two.order;
            });
        },
        change2(evt) {
            //console.log(evt , 'change...')
          },
          //start ,end ,add,update, sort, remove 得到的都差不多
          start2(event) {
            // this.drag = true
             //console.log(evt , 'start...')
             this.projectLabelBeforeMove = this.getProjectLabelId(event)
           },
           getProjectLabelId(event) {
                let toList = []
                for (let i = 0, len = event.to.children.length; i < len; i++) {
                    let id = event.to.children[i].getAttribute('id')
                    if(id) {
                        toList.push(id)
                    }
                }
                //console.log(event.to.children.length)
                return toList
           },
           end2(event) {
                let currentProjectLabel = this.getProjectLabelId(event)

               if (this.projectLabelBeforeMove.toString() === currentProjectLabel.toString()) {
                    return
               }
               let data = {
                    project_id: this.project.id,
                    project_label_ids:currentProjectLabel,
                }
               this.apiPost('project-label/sort', data).then(res => {
                // if (!this.favorProjectIds.includes(data.project_id)) {
                    //     this.favorProjectIds.push(data.project_id)
                    // }
                    // this.loadingTable = !this.loadingTable
                }, () => {
                    //this.loadingTable = !this.loadingTable
                })

               return
            },
           onMove2({
            relatedContext,
            draggedContext
        }) {
            return true
            const relatedElement = relatedContext.element;
            const draggedElement = draggedContext.element;
            // console.log(relatedContext.element)
            // console.log(draggedContext.element)
            return (
                (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
            );
        },
          change(evt) {
            //console.log(evt , 'change...')
          },
          //start ,end ,add,update, sort, remove 得到的都差不多
          start(event) {
           // this.drag = true
            //console.log(evt , 'start...')
            this.beforeMove = this.getPreAndNextCode(event)
          },
          change(event) {
            //console.log(event)
          },
          end(event) {
            //console.log(evt , 'end....')
            const list = this.getPreAndNextCode(event)

            if (this.beforeMove.toString() === list.toString()) {
                return
            }

            //console.log(list)
            let data = {
                prev_issue_id:list[0],
                next_issue_id:list[1],
                project_id: this.project.id,
                project_label_id:list[2],
            }
            //this.loadingTable = !this.loadingTable
            this.apiPost('project-issue/sort', data).then(res => {
                // if (!this.favorProjectIds.includes(data.project_id)) {
                //     this.favorProjectIds.push(data.project_id)
                // }
                // this.loadingTable = !this.loadingTable
            }, () => {
                //this.loadingTable = !this.loadingTable
            })
           // this.drag = true
            // evt.item //可以知道拖动的本身
            // evt.to    // 可以知道拖动的目标列表
            // evt.from  // 可以知道之前的列表
            // evt.oldIndex  // 可以知道拖动前的位置
            // evt.newIndex  // 可以知道拖动后的位置
          },
        onMove({
            relatedContext,
            draggedContext
        }) {
            return true
            const relatedElement = relatedContext.element;
            const draggedElement = draggedContext.element;
            // console.log(relatedContext.element)
            // console.log(draggedContext.element)
            return (
                (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
            );
        },
        getPreAndNextCode(event) {
            const preCode = event.clone.getAttribute('id')
            let toList = []
            let nextCode = ''
            // console.log(event)
            // console.log(event.to)
            // console.log(event.to.getAttribute('id'))
            for (let i = 0, len = event.to.children.length; i < len; i++) {
                toList.push(event.to.children[i].getAttribute('id'))
            }
            const preCodeIndex = toList.findIndex(item => item === preCode)
            if (preCodeIndex < toList.length) {
                nextCode = toList[preCodeIndex + 1]
            }

            return [preCode, nextCode, event.to.getAttribute('id')]
        },
        // 添加任务
        addTask(projectLabelId) {
            this.dragList.forEach((item, index) => {
                if (item.label_id === projectLabelId) {
                    this.$set(this.dragList[index], 'issueForm', true)
                }
            })

            // 记住问题类型
            if (localStorage.currentProjectTypeIdForCreateIssue) {
                this.issueForm.project_type_id = parseInt(localStorage.currentProjectTypeIdForCreateIssue)
            }
        },
        // 删除任务
        delTask(index, k, projectIssueId) {
            this.$Modal.confirm({
                title: this.__('提示'),
                content: this.__('确认删除该问题?'),
                onOk: () => {
                    this.apiDelete('project-issue', projectIssueId).then(res => {
                        this.dragList[index].list.splice(k, 1);
                    }, () => {
                    })
                },
                onCancel: () => {},
            })
        },
        // 查看任务
        viewTask(projectIssueNum) {
            this.$router.push({
                path: '/board/issue/'+projectIssueNum,
            })
        },
        editTask(index, k, projectIssueId) {
            this.$set(this.dragList[index].list[k], 'issueTitleEdit', true)
        },
        editTaskTags(index, k, projectIssueId) {
            this.$set(this.dragList[index].list[k], 'issueTagsEdit', true)
            this.issueEditTags = []
            this.dragList[index].list[k].project_tags.forEach (item => {
                this.issueEditTags.push(item.id)
            })
        },
        editTaskModules(index, k, projectIssueId) {
            this.$set(this.dragList[index].list[k], 'issueModulesEdit', true)
            this.issueEditModules = []
            this.dragList[index].list[k].project_modules.forEach (item => {
                this.issueEditModules.push(item.id)
            })
        },
        editTaskReleases(index, k, projectIssueId) {
            this.$set(this.dragList[index].list[k], 'issueReleasesEdit', true)
            this.issueEditReleases = []
            this.dragList[index].list[k].project_releases.forEach (item => {
                this.issueEditReleases.push(item.id)
            })
        },
        cancelIssueTitleForm(index, k) {
            this.$set(this.dragList[index].list[k], 'issueTitleEdit', false)
        },
        cancelIssueTagsForm(index, k) {
            this.$set(this.dragList[index].list[k], 'issueTagsEdit', false)
        },
        cancelIssueReleasesForm(index, k) {
            this.$set(this.dragList[index].list[k], 'issueReleasesEdit', false)
        },
        cancelIssueModulesForm(index, k) {
            this.$set(this.dragList[index].list[k], 'issueModulesEdit', false)
        },
        updateTask(index, k, projectIssueId) {
            var formData = {
                title : this.dragList[index].list[k].name,
            }
            this.apiPut('project-issue', projectIssueId, formData).then(
                res => {
                    this.$set(this.dragList[index].list[k], 'issueTitleEdit', false)
                },
                () => {
                }
            )
        },
        updateTaskTags (index, k, projectIssueId) {
            var formData = {
                tags : this.issueEditTags,
            }
            this.apiPut('project-issue', projectIssueId+'/tag', formData).then(
                res => {
                    this.$set(this.dragList[index].list[k], 'issueTagsEdit', false)
                    this.refreshIssue()
                },
                () => {
                }
            )
        },
        updateTaskModules (index, k, projectIssueId) {
            var formData = {
                modules : this.issueEditModules,
            }
            this.apiPut('project-issue', projectIssueId+'/module', formData).then(
                res => {
                    this.$set(this.dragList[index].list[k], 'issueModulesEdit', false)
                    this.refreshIssue()
                },
                () => {
                }
            )
        },
        updateTaskReleases (index, k, projectIssueId) {
            var formData = {
                releases : this.issueEditReleases,
            }

            this.apiPut('project-issue', projectIssueId+'/release', formData).then(
                res => {
                    this.$set(this.dragList[index].list[k], 'issueReleasesEdit', false)
                    this.refreshIssue()
                },
                () => {
                }
            )
        },
        // 完成或者取消任务
        completeTask(index, k, projectIssueId) {
            var completedStatus = this.dragList[index].list[k].completed_bool ? 2 : 1
            var formData = {
                completed : completedStatus,
            }
            this.apiPut('project-issue', projectIssueId+'/complete', formData).then(
                res => {
                    this.$set(this.dragList[index].list[k], 'completed', completedStatus)
                },
                () => {
                    this.$set(this.dragList[index].list[k], 'completed', this.dragList[index].list[k].completed_bool ? 1 : 2)
                    this.$set(this.dragList[index].list[k], 'completed_bool', !this.dragList[index].list[k].completed_bool)
                }
            )
        },
        // 添加任务阶段
        addStage() {
            this.$router.push({
                path: '/project/label',
                query: {
                    action: 'create',
                    project_id: this.project.id
                }
            })
        },
        setCurrentProjectTypeIdForCreateIssue(projectTypeId) {
            localStorage.currentProjectTypeIdForCreateIssue = projectTypeId
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
            var key2 = 1
            data.data.forEach ((item, key) => {
                if (!map.hasOwnProperty(item.project_label_id)) {
                    map[item.project_label_id] = []
                }
                map[item.project_label_id].push({
                    id: item.id,
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
                    //order: item.sort,
                    key: key2,
                    fixed: 2 === item.completed,
                    issueTitleEdit: false,
                    issueTagsEdit: false,
                    issueModulesEdit: false,
                    issueReleasesEdit: false,
                })
                key2++
            })

            let hello = []
            var key = 1;
            this.projectLabels.forEach((item, key) => {
                hello.push({
                    project_label_id: item.id,
                    label_id: item.id,
                    //order: item.sort,
                    key: key,
                    name: item.name,
                    fixed: false,
                    issueForm: false,
                    list: map.hasOwnProperty(item.id) ? map[item.id] : [],
                })
                key++
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
        init: function(num) {
            this.apiGet('project', {status: 1}).then(res => {
                this.projects = res.data
            })
            this.apiGet('project/show', {num: num}).then(res => {
                this.project = res
                this.apiGet('project-label', {project_ids: [res.id]}).then(res => {
                    this.projectLabels = res.data
                    this.refreshIssue()
                })
                this.apiGet('project-type', {project_ids: [res.id]}).then(res => {
                    this.projectTypes = res.data
                    if (res.data.length > 0) {
                        this.issueForm.project_type_id = res.data[0].id
                    }
                })
                this.apiGet('project-tag', {project_ids: [res.id]}).then(res => {
                    this.projectTags = res.data
                })
                this.apiGet('project-module', {project_ids: [res.id]}).then(res => {
                    this.projectModules = res.data
                })
                this.apiGet('project-release', {project_ids: [res.id]}).then(res => {
                    this.projectReleases = res.data
                })
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
        removeIssue(params) {
            this.$Modal.confirm({
                title: this.__('提示'),
                content: this.__('确认删除该任务?'),
                onOk: () => {
                    this.apiDelete('project-issue', params.row.id).then(res => {
                        this.data.splice(params.index, 1)
                    }, () => {
                        this.loadingTable = !this.loadingTable
                    })
                },
                onCancel: () => {},
            })
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
        handleIssueSubmit(form, projectLabelId) {
            this.$refs[form][0].validate(pass => {
                if (pass) {
                    this.loadingIssue = !this.loadingIssue

                    var formData = {
                        project_id: this.project.id,
                        project_label_id: projectLabelId,
                        project_type_id: this.issueForm.project_type_id,
                        title: this.issueForm.title,
                    }

                    this.apiPost('project-issue', formData).then(
                        res => {
                            this.cancelIssueForm(form, projectLabelId)
                            this.refreshIssue()
                            this.loadingIssue = !this.loadingIssue
                        },
                        () => {
                            this.loadingIssue = !this.loadingIssue
                        }
                    )
                }
            })
        },
        cancelIssueForm(form, projectLabelId) {
            this.handleResetIssue(form)
            this.dragList.forEach((item, index) => {
                if (item.label_id === projectLabelId) {
                    this.$set(this.dragList[index], 'issueForm', false)
                }
            })
        },
        refreshIssue() {
            this.$refs.search.search(1, 99999)
        },
        handleResetIssue(form) {
            this.$refs[form][0].resetFields()
        },
    },
    watch: {
        $route(to, from) {
            this.init(to.params.num)
        }
    },
    computed: {
        getProjectIds: function() {
            let projectIds = []
            projectIds.push(this.project.id)

            return projectIds
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
    mounted: function() {
        this.init(this.$route.params.num)
    },
    mixins: [http],
}
