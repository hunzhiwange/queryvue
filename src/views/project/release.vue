<template>
    <div class="body">
        <div class="wrap">
            <board_header ref="board_header" :project="project" active-name="release"></board_header>
            <div class="project-navigation2">
                 <Row :gutter="16">
                    <Col span="6" v-for="item in releaseData.data" :key="item.id" class="m-t-10">
                        <Card :bordered="false" class="version-item">
                            <p slot="title">
                                {{ item.name }}
                                <Icon type="ios-create-outline" @click.native="editTaskReleases(item.id)" />
                            </p>
                            <a href="javascript:void(0);" slot="extra">
                                <Icon type="ios-loop-strong"></Icon>
                                <Dropdown>
                                   <a href="javascript:void(0)">
                                       <Badge :status="getStatus(item.completed)" :text="item.completed_enum" />
                                        <Icon type="ios-arrow-down"></Icon>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem
                                            v-for="(value,key) in projectReleaseCompleted"
                                            :key="key"
                                            :name="key"
                                            @click.native="updateCompleted(item.id, key, key == item.completed)"
                                            :selected="key == item.completed"
                                        >
                                            {{ value }}
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </a>
                            <p><Progress :percent="item.progress/100" /></p>
                            <p><Divider orientation="right" size="small">
                                <em style="color: #c5c8ce;font-weight:normal;font-size:13px;">
                                预计发布时间： {{ item.create_at }}
                                </em>
                                </Divider>
                            </p>
                        </Card>
                 </Col>
                    <Col span="6" class="m-t-10">
                        <Card :bordered="false" class="version-item version-create" style="height:141px;">
                            <a @click="createRelease">
                                <div style="text-align:center">
                                    <Icon type="md-add" />
                                    <div>创建版本</div>
                                </div>
                            </a>
                        </Card>
                    </Col>
                 </Row>
            </div>
        </div>
        <div class="fixed-footer">
            <Row justify="end">
                <i-col span="8">
                    &nbsp;
                </i-col>
                <i-col span="16" class-name="fr">
                    <Page
                        class="fr"
                        :total="releaseData.total"
                        :current="releaseData.page"
                        :page-size="releaseData.pageSize"
                        show-sizer
                        @on-change="changePage"
                        @on-page-size-change="changePageSize"
                    ></Page>
                </i-col>
            </Row>
        </div>
    </div>
</template>

<script src="./assets/release.js"></script>
<style lang="less" src="./assets/release.less"></style>
