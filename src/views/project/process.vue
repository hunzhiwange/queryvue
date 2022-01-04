<template>
    <div class="layout">
        <Layout>
            <div class="header">
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <Row>
                        <Col span="6">
                            <MenuItem name="2" :to="'/board/'+projectIssue.project.num">
                                <Icon type="md-list" />
                                {{ projectIssue.project.name }}
                            </MenuItem>
                            <MenuItem name="4">
                                <Icon type="md-time" />
                                历史版本
                            </MenuItem>
                        </Col>
                        <Col span="12">
                            <div style="text-align:center;">
                                <MenuItem name="1" :to="'/board/issue/'+projectIssue.num">
                                    <Icon type="md-arrow-round-back" />
                                    {{ projectIssue.title }}
                                </MenuItem>
                            </div>
                        </Col>
                        <Col span="6">
                            <div class="pull-right">
                                <MenuItem name="3" :to="'/board/process/'+projectIssue.num">
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
            <Flow ref="myFlow" class="body-flow" :title="projectIssue.sub_title" v-model="docContent.content" @saveData="saveData"></Flow>
        </Layout>
    </div>
</template>

<style scoped>
.layout{
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
.layout-footer-center{
    text-align: center;
}
</style>

<script src="./assets/process.js"></script>
<style lang="less" src="./assets/process.less"></style>
