<template>
    <div class="body">
        <div class="wrap">
            <board_header
                ref="board_header"
                :project="project"
                active-name="issue"
                :issueNum="projectIssue.num"
            ></board_header>
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
                                        <Button
                                            type="primary"
                                        >
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
                                        <Button type="primary"> 分配 </Button>
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
                                        <Button type="primary"> 完成 </Button>
                                        <Button type="primary"> 进行中 </Button>
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
                                <Col span="6" style="text-align: right">
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
                                        <Col span="4"> 类型: </Col>
                                        <Col span="8"> y </Col>
                                        <Col span="4"> 状态: </Col>
                                        <Col span="8"> y </Col>
                                    </Row>
                                    <Row>
                                        <Col span="4"> 优先级: </Col>
                                        <Col span="8"> y </Col>
                                        <Col span="4"> 解决结果: </Col>
                                        <Col span="8"> y </Col>
                                    </Row>
                                    <Row>
                                        <Col span="4"> 影响版本: </Col>
                                        <Col span="8"> y </Col>
                                        <Col span="4"> 解决版本: </Col>
                                        <Col span="8"> y </Col>
                                    </Row>
                                    <Row>
                                        <Col span="4"> 模块: </Col>
                                        <Col span="20">
                                            <div v-if="!issueModulesEdit">
                                                <Tag
                                                    v-for="(item, index) in projectIssue.project_modules"
                                                    :key="index"
                                                    :label="item.name"
                                                    :color="item.color"
                                                    >{{ item.name }}</Tag
                                                >
                                                <Icon type="ios-create-outline" @click.native="editTaskModules()" />
                                            </div>
                                            <div v-if="issueModulesEdit">
                                                <Form>
                                                    <FormItem>
                                                        <Select v-model="issueEditModules" multiple :max-tag-count="4">
                                                            <Option
                                                                v-for="item in projectModules"
                                                                :value="item.id"
                                                                :key="item.id"
                                                                >{{ item.name }}</Option
                                                            >
                                                        </Select>
                                                    </FormItem>
                                                    <FormItem>
                                                        <Button
                                                            style="margin-left: 8px"
                                                            @click="cancelIssueModulesForm()"
                                                            >{{ __('取消') }}</Button
                                                        >
                                                        <Button
                                                            type="primary"
                                                            @click.native.prevent="updateTaskModules()"
                                                            >{{ __('确定') }}</Button
                                                        >
                                                    </FormItem>
                                                </Form>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="4"> 标签: </Col>
                                        <Col span="20"> y </Col>
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
                                    <Button
                                        type="default"
                                        v-if="projectIssue.project_type.content_type == 6"
                                        @click="editProcess(projectIssue.num)"
                                        slot="extra"
                                    >
                                        <Icon type="md-create" />
                                        编辑
                                    </Button>

                                    <Button
                                        type="default"
                                        v-if="projectIssue.project_type.content_type != 6"
                                        @click="editContent(projectIssue.num)"
                                        slot="extra"
                                    >
                                        <Icon type="md-create" />
                                        编辑
                                    </Button>
                                    <div class="doc-content-view" v-if="projectIssue.project_type.content_type == 6">
                                        <iframe class="process-view-iframe" :src="processUrl"></iframe>
                                    </div>
                                    <div class="doc-content-view">
                                        <mavonEditor
                                            v-if="projectIssue.project_type.content_type != 6"
                                            v-model="projectIssue.project_content.content"
                                            :subfield="editProp.subfield"
                                            :defaultOpen="editProp.defaultOpen"
                                            :toolbarsFlag="editProp.toolbarsFlag"
                                            :editable="editProp.editable"
                                            :scrollStyle="editProp.scrollStyle"
                                            :boxShadow="editProp.boxShadow"
                                            previewBackground="#FFFFFF"
                                        />
                                    </div>
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
                                        <Col span="8"> 经办人: </Col>
                                        <Col span="16"> y </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8"> 报告人: </Col>
                                        <Col span="16"> y </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8"> 投票: </Col>
                                        <Col span="16"> y </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8"> 关注人: </Col>
                                        <Col span="16"> y </Col>
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
                                        <Col span="8"> 创建: </Col>
                                        <Col span="16">
                                            {{ projectIssue.create_at }}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8"> 更新: </Col>
                                        <Col span="16">
                                            {{ projectIssue.update_at }}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8"> 解决: </Col>
                                        <Col span="16">
                                            {{ 2 == projectIssue.completed ? projectIssue.completed_date : '' }}
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
