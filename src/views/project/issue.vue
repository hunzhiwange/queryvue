<template>
    <div class="body">
        <div class="min-form" v-show="minForm">
            <Card :bordered="false">
                <p slot="title">
                    {{ __('新增项目') }}
                </p>
                <div class="min-form-inner">
                    <div class="min-form-body">
                        <i-form ref="form" :rules="rules" :model="formItem" :label-width="110" class="w-1000">
                            <Row :gutter="16">
                                <i-col span="12">
                                    <FormItem :label="__('名字')" :prop="formItem.id ? '' : 'name'">
                                        <i-input
                                            v-model.trim="formItem.name"
                                            placeholder=""
                                            :disabled="formItem.id ? true : false"
                                        ></i-input>
                                    </FormItem>
                                    <FormItem :label="__('项目模板')">
                                        <Select v-model="seletedProjectTemplate">
                                            <Option v-for="item in projectTemplate" :value="item.key" :key="item.key">{{ item.title }}</Option>
                                        </Select>
                                        <div class="m-t-20" style="height:200px;overflow:auto;">
                                            <Steps :current="0" direction="vertical">
                                                <Step v-for="item in seletedProjectTemplateData.data" :value="item.tag" :key="item.tag" :title="item.title" :content="item.description"></Step>
                                            </Steps>
                                        </div>
                                    </FormItem>
                                </i-col>
                                <i-col span="12">
                                    <FormItem :label="__('编号')" prop="num">
                                        <i-input v-model="formItem.num" placeholder=""></i-input>
                                    </FormItem>
                                    <FormItem :label="__('状态')">
                                        <i-switch
                                            v-model="formItem.status"
                                            size="large"
                                            :true-value=1
                                            :false-value=0
                                        >
                                            <span slot="open">{{ __('启用') }}</span>
                                            <span slot="close">{{ __('禁用') }}</span>
                                        </i-switch>
                                    </FormItem>
                                </i-col>
                            </Row>
                        </i-form>
                    </div>
                    <div class="min-form-footer">
                        <i-button type="primary" :loading="loading" @click.native.prevent="handleSubmit('form')">{{
                            __('确定')
                        }}</i-button>
                        <i-button style="margin-left: 8px;" @click="cancelMinForm('form')">{{ __('取消') }}</i-button>
                    </div>
                </div>
            </Card>
        </div>

        <div class="min-form" v-show="minUser">
            <Card :bordered="false">
                <p slot="title">
                    {{ __('项目用户') }}
                </p>
                <a slot="extra">
                    <i-button
                    size="small"
                    type="text"
                    @click="addUser"
                    class="add-extra"
                    v-if="utils.permission('resource_add_button')"
                    ><Icon type="md-add-circle"></Icon> {{ __('新增') }}</i-button>
                </a>
                <div class="min-form-inner__">
                    <div class="m-b-10">
                        <Row :gutter="16">
                            <i-col span="6">
                                <i-input @on-search="searchUser()" search v-model="searchUserForm.key" :placeholder="'ID,'+__('名字') + ',' + __('编号')" clearable>
                                </i-input>
                            </i-col>
                            <i-col span="6">
                                <i-button type="primary" icon="ios-search" @click.native.prevent="searchUser()" class="m-r-5">{{
                                    __('搜索')
                                }}</i-button>
                                <i-button type="text" icon="md-refresh" @click.native.prevent="resetUser()" class="m-r-5">{{
                                    __('重置')
                                }}</i-button>
                            </i-col>
                        </Row>
                    </div>
                    <div class="min-form-body__">
                        <Table :columns="userColumns" :data="userData" :loading="loadingUserTable"></Table>
                    </div>
                    <div class="m-t-20">
                        <Row>
                            <Col span="18">
                                <Page
                                    :total="userTotal"
                                    :current="userPage"
                                    :page-size="userPageSize"
                                />
                            </Col>
                            <Col span="6">
                                <i-button class="fr" style="margin-left: 8px;" @click="cancelMinUser()">{{ __('关闭') }}</i-button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Card>
        </div>

        <div class="wrap">
            <div class="fixed-footer-offset2">
                <div class="project-navigation">
                    <Menu mode="horizontal" theme2="light" active-name="issue">
                        <Row>
                            <Col span="18">
                                <Submenu name="project">
                                    <template slot="title">
                                        <Icon type="md-git-branch" />
                                        {{ project.name }}
                                    </template>
                                    <MenuItem :to="'/board/'+item.num" v-for="item in projects" :key="item.id" :name="'project-'+item.id">{{ item.name }}</MenuItem>
                                </Submenu>
                                <MenuItem name="issue" :to="'/board/issue/'+project.num+'-'+$route.params.id">
                                    <Icon type="ios-document" />
                                    {{ project.num+'-'+$route.params.id }}
                                </MenuItem>
                                <MenuItem name="index" :to="'/board/'+project.num">
                                    <Icon type="md-list-box" />
                                    任务
                                </MenuItem>
                                <MenuItem name="attachement" :to="'/board/'+project.num+'/attachement'">
                                    <Icon type="md-document" />
                                    文件
                                </MenuItem>
                                <MenuItem name="overview" :to="'/board/'+project.num+'/overview'">
                                    <Icon type="md-globe" />
                                    概览
                                </MenuItem>
                                <MenuItem name="release" :to="'/board/'+project.num+'/release'">
                                    <Icon type="ios-happy" />
                                    版本
                                </MenuItem>
                            </Col>
                            <Col span="6" >
                                <div class="pull-right">
                                    <MenuItem name="11">
                                        <Icon type="md-search" />
                                        筛选
                                    </MenuItem>
                                    <MenuItem name="22">
                                        <Icon type="ios-people" />
                                        用户
                                    </MenuItem>
                                    <MenuItem name="33">
                                        <Icon type="ios-construct" />
                                        菜单
                                    </MenuItem>
                                </div>
                            </Col>
                            </Row>
                    </Menu>
                </div>
            </div>
            <div style="display:none;" class="fixed-footer-offset2 ">
                <Row>
                    <i-col span="24">
                        <search ref="search" @getDataFromSearch="getDataFromSearch" @getProjectFavorDataFromSearch="getProjectFavorDataFromSearch" @add="add"></search>
                        <!-- <i-table
                            stripe
                            :loading="loadingTable"
                            ref="table"
                            :border="false"
                            :columns="columns"
                            :data="data"
                            class="search-table"
                            @on-selection-change="onSelectionChange"
                        >
                        </i-table> -->
                    </i-col>
                </Row>
            </div>
            <div class="project-navigation2 m-t-10">
                <Row :gutter="16">
                    <Col span="24">
                        <Card :bordered="false" class="version-item">
                            <p slot="title">
                                <strong>{{ projectIssue.title }}</strong>
                            </p>
                             <Row>
                                <Col span="18">
                                    <ButtonGroup class="m-r-15">
                                        <Button type="primary">
                                            <Icon type="md-create" />
                                            编辑
                                        </Button>
                                    </ButtonGroup>
                                    <ButtonGroup class="m-r-15">
                                        <Button type="primary">
                                            <Icon type="ios-text" />
                                            备注
                                        </Button>
                                    </ButtonGroup>
                                    <ButtonGroup class="m-r-15">
                                        <Button type="primary">
                                            分配
                                        </Button>
                                        <Button type="primary">
                                            <Dropdown>
                                                更多 <Icon type="ios-arrow-down"></Icon>
                                                <DropdownMenu slot="list">
                                                    <DropdownItem>工作日志</DropdownItem>
                                                    <DropdownItem divided>附加文件</DropdownItem>
                                                    <DropdownItem divided>移动</DropdownItem>
                                                    <DropdownItem>链接</DropdownItem>
                                                    <DropdownItem>复制</DropdownItem>
                                                    <DropdownItem>编辑标签</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </Button>
                                    </ButtonGroup>
                                    <ButtonGroup>
                                        <Button type="primary">
                                            完成
                                        </Button>
                                        <Button type="primary">
                                            进行中
                                        </Button>
                                        <Button type="primary">
                                            <Dropdown>
                                                更多工作流动作 <Icon type="ios-arrow-down"></Icon>
                                                <DropdownMenu slot="list">
                                                    <DropdownItem>关闭</DropdownItem>
                                                    <DropdownItem>分配任务</DropdownItem>
                                                    <DropdownItem>已转需求</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                                <Col span="6" style="text-align:right;">
                                    <ButtonGroup>
                                        <Button type="primary">
                                            <Icon type="md-share-alt" />
                                            分享
                                        </Button>
                                        <Button type="primary">
                                            <Dropdown>
                                                <Icon type="md-download" /> 导出 <Icon type="ios-arrow-down"></Icon>
                                                <DropdownMenu slot="list">
                                                    <DropdownItem>XML</DropdownItem>
                                                    <DropdownItem>JSON</DropdownItem>
                                                    <DropdownItem>Word</DropdownItem>
                                                    <DropdownItem>打印预览</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row :gutter="16" class="m-t-10">
                    <Col span="18">
                        <Row :gutter="16">
                            <Col span="24">
                                <Card :bordered="false" class="version-item">
                                    <p slot="title">
                                        <strong>问题详情</strong>
                                    </p>
                                    <Row>
                                        <Col span="4">
                                            类型:
                                        </Col>
                                        <Col span="8">
                                            y
                                        </Col>
                                        <Col span="4">
                                            状态:
                                        </Col>
                                        <Col span="8">
                                            y
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="4">
                                            优先级:
                                        </Col>
                                        <Col span="8">
                                            y
                                        </Col>
                                        <Col span="4">
                                            解决结果:
                                        </Col>
                                        <Col span="8">
                                            y
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="4">
                                            影响版本:
                                        </Col>
                                        <Col span="8">
                                            y
                                        </Col>
                                        <Col span="4">
                                            解决版本:
                                        </Col>
                                        <Col span="8">
                                            y
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="4">
                                            模块:
                                        </Col>
                                        <Col span="20">
                                            y
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="4">
                                            标签:
                                        </Col>
                                        <Col span="20">
                                            y
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <Row :gutter="16" class="m-t-10">
                            <Col span="24">
                                <Card :bordered="false" class="version-item">
                                    <p slot="title">
                                        <strong>描述</strong>
                                    </p>
                                    <p>
                                        <Button type="primary" @click="editProcess(projectIssue.num)">
                                            <Icon type="md-create" />
                                            编辑
                                        </Button>
                                    </p>
                                    <p v-html="projectIssue.project_content.content"></p>
                                </Card>
                            </Col>
                        </Row>
                        <Row :gutter="16" class="m-t-10">
                            <Col span="24">
                                <Card :bordered="false" class="version-item">
                                    <p slot="title">
                                        <strong>附件</strong>
                                    </p>
                                </Card>
                            </Col>
                        </Row>
                        <Row :gutter="16" class="m-t-10">
                            <Col span="24">
                                <Card :bordered="false" class="version-item">
                                    <p slot="title">
                                        <strong>问题链接</strong>
                                    </p>
                                </Card>
                            </Col>
                        </Row>
                        <Row :gutter="16" class="m-t-10">
                            <Col span="24">
                                <Card :bordered="false" class="version-item">
                                    <p slot="title">
                                        <strong>子任务</strong>
                                    </p>
                                </Card>
                            </Col>
                        </Row>
                        <Row :gutter="16" class="m-t-10">
                            <Col span="24">
                                <Card :bordered="false" class="version-item">
                                    <p slot="title">
                                        <strong>活动</strong>
                                    </p>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="6">
                        <Row :gutter="16">
                            <Col span="24">
                                <Card :bordered="false" class="version-item">
                                    <p slot="title">
                                        <strong>用户</strong>
                                    </p>
                                    <Row>
                                        <Col span="8">
                                            经办人:
                                        </Col>
                                        <Col span="16">
                                            y
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8">
                                            报告人:
                                        </Col>
                                        <Col span="16">
                                            y
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8">
                                            投票:
                                        </Col>
                                        <Col span="16">
                                            y
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8">
                                            关注人:
                                        </Col>
                                        <Col span="16">
                                            y
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <Row :gutter="16" class="m-t-10">
                            <Col span="24">
                                <Card :bordered="false" class="version-item">
                                    <p slot="title">
                                        <strong>日期</strong>
                                    </p>
                                    <Row>
                                        <Col span="8">
                                            创建:
                                        </Col>
                                        <Col span="16">
                                            {{ projectIssue.create_at }}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8">
                                            更新:
                                        </Col>
                                        <Col span="16">
                                            {{ projectIssue.update_at }}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8">
                                            解决:
                                        </Col>
                                        <Col span="16">
                                            {{ 2 == projectIssue.completed ? projectIssue.completed_date : ''}}
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
        <div style="display:none;" class="fixed-footer">
            <Row justify="end">
                <i-col span="8">
                    <ButtonGroup shape="circle">
                        <i-button
                            type="primary"
                            icon="md-eye"
                            @click="statusMany(1)"
                            v-if="utils.permission('project_status_button')"
                            >{{ __('启用') }}</i-button
                        >
                        <i-button
                            type="primary"
                            icon="md-eye-off"
                            @click="statusMany(0)"
                            v-if="utils.permission('project_status_button')"
                            >{{ __('禁用') }}</i-button
                        >
                    </ButtonGroup>
                </i-col>
                <i-col span="16" class-name="fr">
                    <Page
                        class="fr"
                        :total="total"
                        :current="page"
                        :page-size="pageSize"
                        show-sizer
                        @on-change="changePage"
                        @on-page-size-change="changePageSize"
                    ></Page>
                </i-col>
            </Row>
        </div>
        <Drawer
            :title="viewDetail.name + ' ' + __('添加用户')"
            v-model="rightForm"
            width="800"
            :mask-closable="false"
            :styles="styles"
        >
            <i-form ref="formCommonUser" :rules="commonUserRules" :model="formCommonUser">
                <Row :gutter="32">
                    <i-col span="24">
                        <FormItem :label="__('请输入用户关键字')" label-position="top" prop="selectUser">
                            <i-select
                                v-model="formCommonUser.selectUser"
                                multiple
                                filterable
                                remote
                                :remote-method="searchCommonUser"
                                @on-change="changeCommonUser"
                                :loading="loadingCommonUser"
                            >
                                <i-option
                                    v-for="r in commonUsers"
                                    :value="r.id"
                                    :key="r.id"
                                    :label="r.name"
                                >
                                    <span>{{ r.name }}</span>
                                </i-option>
                            </i-select>
                        </FormItem>
                    </i-col>
                    <i-col span="24"> </i-col>
                </Row>
            </i-form>
            <div class="demo-drawer-footer">
                <i-button style="margin-right: 8px" @click="rightForm = false">{{ __('取消') }}</i-button>
                <i-button
                    type="primary"
                    :loading="loading"
                    @click.native.prevent="handleAddUserSubmit('formCommonUser')"
                    >{{ __('确定') }}</i-button
                >
            </div>
        </Drawer>
    </div>
</template>

<script src="./assets/issue.js"></script>
<style lang="less" src="./assets/issue.less"></style>
