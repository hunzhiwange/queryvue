<template>
    <div class="layout">
        <Layout>
            <div class="header">
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <Row>
                        <Col span="12">
                            <div style="text-align:center;">
                                <MenuItem name="1" :to="'/board/issue/'+projectIssue.num">
                                    <Icon type="md-arrow-round-back" />
                                    {{ projectIssue.title }}
                                </MenuItem>
                            </div>
                        </Col>
                        <Col span="12">
                            <div class="pull-right">
                                <MenuItem name="4">
                                    <Icon type="md-share" />
                                    分享
                                </MenuItem>
                            </div>
                        </Col>
                    </Row>
                </Menu>
            </div>
            <Flow ref="myFlow" class="body-flow" :title="projectIssue.sub_title" v-model="docContent.content" @saveData="saveData" :readOnly="true"></Flow>
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

<script src="./assets/process_view.js"></script>
<style lang="less" src="./assets/process_view.less"></style>
