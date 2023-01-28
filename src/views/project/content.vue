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
                        <Row :gutter="16" class="m-t-10">
                            <Col :span="projectIssue.project_type.content_type == 7 ? 12 : 24">
                                <mavonEditor
                                    v-model="projectIssue.project_content.content"
                                    @imgAdd="imageUpload"
                                    ref="projectContent"
                                    previewBackground="#FFFFFF"
                                    @change="editorChange"
                                    :defaultOpen="projectIssue.project_type.content_type == 7 ? 'edit' : ''"
                                />
                            </Col>
                            <Col span="12" v-if="projectIssue.project_type.content_type == 7">
                                <Card :bordered="false">
                                    <ButtonGroup>
                                        <Button @click="zoomIn"><Icon type="md-add" /> 放大</Button>
                                        <Button @click="zoomOut"><Icon type="md-remove" /> 缩小</Button>
                                        <Button @click="fit"><Icon type="md-contract" /> 自适应</Button>
                                        <Button @click="downloadAsSvg"><Icon type="md-down" /> 下载为 SVG</Button>
                                    </ButtonGroup>

                                    <ColorPicker
                                        class="m-l-10"
                                        v-model="optionsMindMap.color"
                                        alpha
                                        recommend
                                        @on-change="mindMap"
                                    ></ColorPicker>

                                    <Select
                                        class="m-l-10"
                                        v-model="currentLevelMindMap"
                                        prefix="md-menu"
                                        style="width: 80px"
                                        @on-change="mindMap"
                                    >
                                        <Option v-for="item in levelMindMap" :value="item.value" :key="item.value">{{
                                            item.label
                                        }}</Option>
                                    </Select>

                                    <svg id="markmap" style="width: 100%; height:985px;"></svg>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<style scoped>
.layout {
    /* border: 1px solid #d7dde4;
    background: #f5f7f9; */
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
