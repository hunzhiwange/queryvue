<template>
    <div class="body">
        <div class="wrap layout2">
            <!-- <board_header
                ref="board_header"
                :project="project"
                active-name="issue"
                :issueNum="projectIssue.num"
            ></board_header> -->
            <div class="project-navigation2 m-t-10">
                <Row :gutter="16">
                    <Col span="24">
                        <div class="header">
                            <Menu mode="horizontal" theme="light" active-name="1">
                                <Row>
                                    <Col span="6">
                                        <MenuItem name="2" :to="'/board/' + projectIssue.project.num">
                                            <Icon type="md-list" />
                                            {{ projectIssue.project.name }}
                                        </MenuItem>
                                        <MenuItem name="4">
                                            <Icon type="md-time" />
                                            历史版本
                                        </MenuItem>
                                    </Col>
                                    <Col span="12">
                                        <div style="text-align: center">
                                            <MenuItem name="1" :to="'/board/issue/' + projectIssue.num">
                                                <Icon type="md-arrow-round-back" />
                                                {{ projectIssue.title }}
                                            </MenuItem>
                                        </div>
                                    </Col>
                                    <Col span="6">
                                        <div class="pull-right">
                                            <Button type="text" icon="ios-search" @click="saveContent()"
                                                >保存</Button
                                            >
                                            <MenuItem name="3" :to="'/board/process/' + projectIssue.num">
                                                <Icon type="md-eye" />
                                                浏览
                                            </MenuItem>
                                            <MenuItem name="4">
                                                <Icon type="md-share" />
                                                分享
                                            </MenuItem>
                                        </div>
                                    </Col>
                                </Row>
                            </Menu>
                        </div>
                        <!-- <Card :bordered="false" class="version-item">
                            <p slot="title">
                                <strong>{{ projectIssue.title }}</strong>
                            </p>
                            <Row>
                                <Col span="18">
                                    <ButtonGroup class="m-r-15">
                                        <Button type="primary" @click="saveContent()">
                                            <Icon type="ios-refresh-circle" />
                                            保存
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                                <Col span="6" style="text-align: right">
                                    <ButtonGroup>
                                        <Button type="primary" @click="backIssue()">
                                            <Icon type="md-share-alt" />
                                            返回任务
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Card> -->
                    </Col>
                </Row>
                <Row :gutter="16" class="m-t-10">
                    <Col span="24">
                        <div class="doc-content">
                           <Flow ref="myFlow" class="body-flow" :title="projectIssue.sub_title" v-model="docContent.content" @saveData="saveData"></Flow>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    height: 100%;
}
.layout .ivu-menu-horizontal {
    height: 33px;
    line-height: 33px;
}
.layout-footer-center {
    text-align: center;
}
</style>

<script src="./assets/process.js"></script>
<style lang="less" src="./assets/process.less"></style>
