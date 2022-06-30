import http from '@/utils/http'
import {validateAlphaDash} from '@/utils/validate'
import search from '../../project-issue/search/index'
import projectTemplate from './template'
//see https://github.com/SortableJS/Vue.Draggable
import draggable from 'vuedraggable'
import Flow from '../../../components/document/flow/index'

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
}

const resetFormUser = {}

export default {
    components: {
        search,
        draggable,
        Flow,
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
            releaseData: {
                total: 0,
                page: 1,
                pageSize: 10,
                data: [],
            },
            projectReleaseCompleted: {},
            docContent: {
                title: '',
                content: '',
            },
            projectIssue: {},
            flow: {},
            projectModules: [],
        }
    },
    methods: {
        createRelease() {
            this.$router.push({
                path: '/project/release',
                query: {
                    action: 'create',
                    project_id: this.project.id
                }
            })
        },
        editTaskReleases(projectReleaseId) {
            this.$router.push({
                path: '/project/release',
                query: {
                    action: 'edit',
                    project_release_id: projectReleaseId
                }
            })
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
        changePage(page) {
            this.releaseData.page = page
            this.searchRelease()
        },
        changePageSize(pageSize) {
            this.releaseData.pageSize = pageSize
            this.searchRelease()
        },
        init: function(id) {
            this.apiGet('project-issue/show', {num: id}).then(res => {
                if (res.project_type && res.project_type.content_type != 6) {
                    utils.error(this.__('非流程图文档'))
                    return
                }
                this.projectIssue = res
                this.docContent.title = res.title,
                this.docContent.content = res.project_content.content
            })
        },
        searchRelease() {
            this.apiGet('project-release', {
                status: 1,
                page: this.releaseData.page,
                size: this.releaseData.pageSize,
                project_ids: [this.project.id],
            }).then(data => {
                this.releaseData.data = data.data
                this.releaseData.total = data.page.total_record
                this.releaseData.page = data.page.current_page
                this.releaseData.pageSize = data.page.per_page
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
        updateCompleted(releaseId, completedStatus, currentStatus) {
            if (currentStatus) {
                return
            }

            let formData = {
                completed: completedStatus
            }

            this.apiPut('project-release', releaseId+'/completed', formData).then(
                res => {
                    this.refresh()
                },
                () => {
                }
            )
        },
        refresh() {
            this.init(this.$route.params.num)
        },
        getStatus(completed) {
            let status = ''
            switch (completed) {
                case 1:
                    status = 'default';
                    break;
                case 2:
                    status = 'blue';
                    break;
                case 3:
                    status = 'red';
                    break;
                case 4:
                    status ='success';
                    break;
            }

            return status
        },
        saveData(data) {
            var formData = {
                content: data.data,
                sub_title: data.title,
            }
            var projectIssueId = this.projectIssue.id
            this.apiPut('project-issue', projectIssueId+'/content', formData).then(
                res => {

                },
                () => {
                }
            )
        },
        handleClick(act) {
            switch (act) {
                case "back":
                    if (this.equalContent) {
                        this.goBackDirect();
                        return;
                    }
                    this.$Modal.confirm({
                        title: this.$L('温馨提示'),
                        content: this.$L('是否放弃修改的内容返回？'),
                        cancelText: this.$L('放弃保存'),
                        onCancel: () => {
                            this.goBackDirect();
                        },
                        okText: this.$L('保存并返回'),
                        onOk: () => {
                            this.handleClick('save');
                            this.goBackDirect();
                        }
                    });
                    break;

                case "saveBefore":
                    //if (!this.equalContent && this.loadIng == 0) {
                        this.handleClick('save');
                    // } else {
                    //     this.$Message.warning(this.$L('没有任何修改！'));
                    // }
                    return;

                case "save":
                    var formData = {
                        'content': this.docContent.content,
                        'sub_title': 333,
                    }
                    var projectIssueId = this.projectIssue.id
                    this.apiPut('project-issue', projectIssueId+'/content', formData).then(
                        res => {

                        },
                        () => {
                        }
                    )
                    break;

                case "menu":
                case "history":
                    this.docDrawerTab = act;
                    this.docDrawerShow = true
                    break;

                case "share":
                    this.$Modal.confirm({
                        render: (h) => {
                            return h('div', [
                                h('div', {
                                    style: {
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        marginBottom: '20px',
                                    }
                                }, this.$L('文档链接')),
                                h('Input', {
                                    props: {
                                        value: this.handleClick('view'),
                                        readonly: true,
                                    },
                                })
                            ])
                        },
                    });
                    break;

                case "lock":
                case "unlock":
                    $A.apiAjax({
                        url: 'docs/section/lock?id=' + this.getSid(),
                        data: {
                            act: act,
                        },
                        error: () => {
                            alert(this.$L('网络繁忙，请稍后再试！'));
                        },
                        success: (res) => {
                            if (res.ret === 1) {
                                if (this.docDetail.lockname != res.data.lockname) {
                                    this.$Message.success(res.msg);
                                }
                                this.$set(this.docDetail, 'lockname', res.data.lockname);
                                this.$set(this.docDetail, 'lockdate', res.data.lockdate);
                                this.continueLock(20000);
                            } else {
                                this.$Modal.error({title: this.$L('温馨提示'), content: res.msg});
                            }
                        }
                    });
                    break;

                case "view":
                    return $A.webUrl('docs/view/' + this.docDetail.id);

            }
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
        //this.refresh()
        this.init(this.$route.params.id)
        this.flow = this.$refs.myFlow.contentWindow
    },
    mixins: [http],
}
