<template>
    <div class="layout">
        <Layout>
            <div class="header">
                <Menu mode="horizontal" theme="light" active-name="1">
                    <Row>
                        <Col span="6">
                            <MenuItem name="2" :to="'/board/' + projectIssue.project.num">
                                <Icon type="md-list" />
                                {{ projectIssue.project.name }}
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
                                <MenuItem name="3" :to="'/project/content/' + projectIssue.num">
                                    <Icon type="md-create" />
                                    编辑
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

            <div class="doc-content-view-max">
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
        </Layout>
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
    /* height: 33px;
    line-height: 33px; */
}
.layout-footer-center {
    text-align: center;
}
</style>

<script src="./assets/content_view.js"></script>
<style lang="less" src="./assets/content_view.less"></style>
