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
                        </Card>
                    </Col>
                </Row>
                <Row :gutter="16" class="m-t-10">
                    <Col span="24">
                        <div class="doc-content">
                            <mavon-editor v-model="projectIssue.project_content.content" previewBackground="#FFFFFF" />
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
    height: 30px;
    line-height: 30px;
}
.layout-footer-center {
    text-align: center;
}
</style>

<script src="./assets/content.js"></script>
<style lang="less" src="./assets/content.less"></style>
