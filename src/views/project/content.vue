<template>
    <div class="body">
        <div class="wrap layout2">
            <Row :gutter="16" class="m-t-10">
                <Col span="24">
                    <div class="header">
                        <Menu mode="horizontal" theme="light" active-name="1">
                            <Row type="flex" justify="center" align="middle">
                                <Col span="6">
                                    <MenuItem name="4">
                                        <Button
                                            type="primary"
                                            :loading="saveLoading"
                                            icon="ios-search"
                                            @click="saveContent()"
                                            >保存</Button
                                        ></MenuItem
                                    >
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
                                    <MenuItem name="1" :to="'/board/issue/' + projectIssue.num">
                                        <Icon type="md-arrow-round-back" />
                                        {{ projectIssue.title }}
                                    </MenuItem>
                                </Col>
                                <Col span="6">
                                    <div class="pull-right">
                                        <MenuItem name="3" :to="'/board/content/' + projectIssue.num">
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
                    <div class="doc-content">
                        <mavonEditor
                            v-model="projectIssue.project_content.content"
                            @imgAdd="imageUpload"
                            ref="projectContent"
                            previewBackground="#FFFFFF"
                            :navigation="true"
                        />
                    </div>
                </Col>
            </Row>
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

<script src="./assets/content.js"></script>
<style lang="less" src="./assets/content.less"></style>
