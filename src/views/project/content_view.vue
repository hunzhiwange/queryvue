<template>
    <div class="body">
        <div class="wrap layout2">
            <Row :gutter="16" class="m-t-10">
                <Col span="24">
                    <div class="header">
                        <Menu mode="horizontal" theme="light" active-name="1">
                            <Row type="flex" justify="center" align="middle">
                                <Col span="6">
                                    <MenuItem name="2" :to="'/board/' + projectIssue.project.num">
                                        <Icon type="md-list" />
                                        {{ projectIssue.project.name }}
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

                    <div class="doc-content" v-if="projectIssue.project_type.content_type == 8" style="height:1100px;">
                        <Swagger ref="mySwagger" class="body-swagger" v-model="projectIssue.project_content.content"></Swagger>
                    </div>
                    <div class="doc-content" v-else-if="projectIssue.project_type.content_type == 9" style="height:1100px;">
                        <Swagger ref="mySwagger" class="body-swagger" v-model="projectIssue.project_content.content" :isUrl="true"></Swagger>
                    </div>
                    <div class="doc-content" v-else>
                        <mavonEditor
                            v-model="projectIssue.project_content.content"
                            :subfield="editProp.subfield"
                            :defaultOpen="editProp.defaultOpen"
                            :toolbarsFlag="editProp.toolbarsFlag"
                            :editable="editProp.editable"
                            :scrollStyle="editProp.scrollStyle"
                            :boxShadow="editProp.boxShadow"
                            previewBackground="#FFFFFF"
                            :navigation="true"
                           __navigationToggle="onAddUrl"
                        />
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script src="./assets/content_view.js"></script>
<style lang="less" src="./assets/content_view.less"></style>
