<template>
    <div class="body">
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
                                            <div v-if="!issueModulesEdit">
                                                <Tag v-for="(item, index) in projectIssue.project_modules" :key="index" :label="item.name" :color="item.color">{{ item.name }}</Tag>
                                                <Icon type="ios-create-outline"  @click.native="editTaskModules()" />
                                            </div>
                                            <div v-if="issueModulesEdit">
                                            <Form>
                                                <FormItem>
                                                    <Select v-model="issueEditModules" multiple :max-tag-count="4">
                                                        <Option v-for="item in projectModules" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                                    </Select>
                                                </FormItem>
                                                <FormItem>
                                                    <Button style="margin-left: 8px" @click="cancelIssueModulesForm()">{{ __('取消') }}</Button>
                                                    <Button type="primary" @click.native.prevent="updateTaskModules()">{{ __('确定') }}</Button>
                                                </FormItem>
                                            </Form>
                                        </div>
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
    </div>
</template>

<script src="./assets/issue.js"></script>
<style lang="less" src="./assets/issue.less"></style>
