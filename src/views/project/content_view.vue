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

                    <div class="doc-content" v-if="projectIssue.project_type.content_type == 8" style="height: 1100px">
                        <Swagger
                            ref="mySwagger"
                            class="body-swagger"
                            v-model="projectIssue.project_content.content"
                        ></Swagger>
                    </div>
                    <div
                        class="doc-content"
                        v-else-if="projectIssue.project_type.content_type == 9"
                        style="height: 1100px"
                    >
                        <Swagger
                            ref="mySwagger"
                            class="body-swagger"
                            v-model="projectIssue.project_content.content"
                            :isUrl="true"
                        ></Swagger>
                    </div>
                    <div class="doc-content" v-else-if="projectIssue.project_type.content_type == 7">
                        <Card :bordered="false">
                            <ButtonGroup>
                                <Button @click="zoomIn"><Icon type="md-add" /> 放大</Button>
                                <Button @click="zoomOut"><Icon type="md-remove" /> 缩小</Button>
                                <Button @click="fit"><Icon type="md-contract" /> 自适应</Button>
                                <Button @click="downloadAsSvg"><Icon type="md-arrow-down" /> 下载为 SVG</Button>
                                <Button @click="downloadAsPng"><Icon type="md-images" /> 下载为 PNG</Button>
                            </ButtonGroup>

                            <InputNumber
                                class="m-l-10"
                                :precision="0"
                                :min="0"
                                :max="30000"
                                :step="1000"
                                :value="tempHeightMindMap"
                                style="width:100px;"
                                @on-change="changeCurrentHeightMindMap"
                            ></InputNumber>

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

                            <svg id="markmap" xmlns="http://www.w3.org/2000/svg" class="w-screen h-screen leading-none markmap mm-cowe6a-1" :style="{width: '100%', height: currentHeightMindMap+'px'}"></svg>
                        </Card>
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
