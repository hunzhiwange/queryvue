<template>
    <div class="body">
        <div class="wrap">
            <board_header ref="board_header" :project="project" active-name="index"></board_header>
            <div style="display:none;" class="fixed-footer-offset2 ">
                <Row>
                    <i-col span="24">
                        <search :projectIds="getProjectIds" ref="search" @getDataFromSearch="getDataFromSearch" @getProjectFavorDataFromSearch="getProjectFavorDataFromSearch" @add="add"></search>
                    </i-col>
                </Row>
            </div>
            <div class="project-navigation">
                 <Row>
                    <Col span="24">
                <draggable class="main-box" v-model="dragList" :move="onMove2" filter=".undraggable"
                @change="change2"
                @start="start2"
                @end="end2"
                >
                    <div v-for="(stage,index) in dragList" class="stage-item" :key="index" :id="stage.project_label_id">
                        <div class="stage-header">
                            <Badge :count="stage.list.length" type="success">
                            <div class="title">{{stage.name}}</div>
                            </Badge>
                            <div>
                                <Dropdown>
                                   <a href="javascript:void(0)">
                                       <Icon type="md-more" size="18" color="#808695" />
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem
                                            @click.native="updateCompleted(item.id, key, key == item.completed)"
                                        >
                                            移动问题
                                        </DropdownItem>
                                    </DropdownMenu>
                                    <DropdownMenu slot="list">
                                        <DropdownItem
                                            @click.native="updateCompleted(item.id, key, key == item.completed)"
                                        >
                                            编辑分类
                                        </DropdownItem>
                                    </DropdownMenu>
                                    <DropdownMenu slot="list">
                                        <DropdownItem
                                            @click.native="updateCompleted(item.id, key, key == item.completed)"
                                        >
                                            删除分类
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                        <div v-if="!stage.issueForm" class="task-creator-handler-wrap">
                            <a class="task-creator-handler link-add-handler" @click="addTask(stage.project_label_id)"><Icon type="md-add" /> 添加任务</a>
                        </div>
                        <div v-if="stage.issueForm" class="task-creator-wrap card">
                             <Form :ref="('issueForm-'+stage.project_label_id)" :model="issueForm" :rules="issueFormRules" label-position="top">
                                <FormItem label="任务标题" prop="title">
                                    <Input v-model="issueForm.title" type="textarea" placeholder="任务标题..."></Input>
                                </FormItem>
                                <FormItem label="任务类型" prop="project_type_id">
                                    <Select v-model="issueForm.project_type_id" @on-change="setCurrentProjectTypeIdForCreateIssue">
                                        <Option v-for="item in projectTypes" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem>
                                    <Button style="margin-left: 8px" @click="cancelIssueForm('issueForm-'+stage.project_label_id, stage.project_label_id)">{{ __('取消') }}</Button>
                                    <Button type="primary" :loading="loadingIssue" @click.native.prevent="handleIssueSubmit('issueForm-'+stage.project_label_id, stage.project_label_id)">{{ __('确定') }}</Button>
                                </FormItem>
                            </Form>
                        </div>
                        <draggable tag="span" class="list-group-stage" v-model="stage.list" v-bind="dragOptions" :move="onMove"
                          @change="change"
                             @start="start"
                                @end="end"
                            >
                            <transition-group tag="ul" type="transition" class="list-group" :name="'flip-list'" :id="stage.project_label_id">
                                <li class="list-group-item stage-header" v-for="(element,k) in stage.list" :key="element.key" :id="element.id">
                                    <Card style="width:100%;" shadow >
                                          <div slot="title">
                                              <!-- <label data-v-5cb2b31c="" class="ivu-checkbox-wrapper ivu-checkbox-default"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span> <input type="checkbox" class="ivu-checkbox-input"></span></label> -->
                                            <!-- <label data-v-5cb2b31c="" class="ivu-checkbox-wrapper ivu-checkbox-wrapper-checked ivu-checkbox-default"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span> <input type="checkbox" class="ivu-checkbox-input"></span></label> -->
                                            <Checkbox v-model="element.completed_bool" @on-change="completeTask(index,k, element.id)"><em></em></Checkbox>
                                            <Icon :type="element.project_type_icon.icon" :color="element.project_type_icon.color" />
                                            <span :class="element.completed_bool ? 'item-removed' : ''">{{ element.num }}</span>
                                            <Icon type="ios-copy-outline" />
                                            <Icon @click.native="viewTask(element.num)" type="md-eye" />
                                        </div>
                                        <!-- <a href="javascript:void(0);" class="close-item" slot="extra" @click.prevent="delTask(index,k, element.id)">
                                            <Icon color="#808695" size="18" type="md-close"></Icon>
                                        </a> -->
                                        <div slot="extra">
                                            <Dropdown>
                                            <a href="javascript:void(0)">
                                                <Icon type="md-more" size="18" color="#808695" />
                                                </a>
                                                <DropdownMenu slot="list">
                                                    <DropdownItem
                                                        @click.native="viewTask(element.num)"
                                                    >
                                                        查看
                                                    </DropdownItem>
                                                </DropdownMenu>
                                                <DropdownMenu slot="list">
                                                    <DropdownItem
                                                        @click.native="updateCompleted(item.id, key, key == item.completed)"
                                                    >
                                                        归档
                                                    </DropdownItem>
                                                </DropdownMenu>
                                                <DropdownMenu slot="list">
                                                    <DropdownItem
                                                        @click.native="delTask(index,k, element.id)"
                                                    >
                                                        删除
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                        <!-- <span class="check-box-wrapper">
                                            <label data-v-5cb2b31c="" class="ivu-checkbox-wrapper ivu-checkbox-default"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span> <input type="checkbox" class="ivu-checkbox-input"></span></label>
                                            <label data-v-5cb2b31c="" class="ivu-checkbox-wrapper ivu-checkbox-wrapper-checked ivu-checkbox-default"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span> <input type="checkbox" class="ivu-checkbox-input"></span></label>
                                        </span> -->
                                        <span v-if="!element.issueTitleEdit" :class="element.completed_bool ? 'item-removed name' : 'name'">{{ element.name }} <Icon type="ios-create-outline"  @click.native="editTask(index,k, element.id)" /></span>
                                        <div v-if="element.issueTitleEdit">
                                            <Form>
                                                <FormItem>
                                                    <Input :ref="('issue-title-'+element.id)" v-model="element.name" type="textarea" placeholder="任务标题..." @on-focus="$event.currentTarget.select()"></Input>
                                                </FormItem>
                                                <FormItem>
                                                    <Button style="margin-left: 8px" @click="cancelIssueTitleForm(index,k, element.id)">{{ __('取消') }}</Button>
                                                    <Button type="primary" @click.native.prevent="updateTask(index, k, element.id)">{{ __('确定') }}</Button>
                                                </FormItem>
                                            </Form>
                                        </div>
                                        <Divider orientation="right" size="small"><em style="color: #c5c8ce;font-weight:normal;font-size:13px;">
                                            {{ element.create_at }}
                                            </em>
                                        </Divider>
                                        <div v-if="!element.issueTagsEdit" class="m-t-10">
                                            标签 <Badge v-for="item in element.project_tags" :key="item.id" :text="item.name" :color="item.color" class="m-r-10"/>
                                            <Icon type="ios-create-outline"  @click.native="editTaskTags(index,k, element.id)" />
                                        </div>
                                        <div v-if="element.issueTagsEdit">
                                            <Form>
                                                <FormItem>
                                                    <Select v-model="issueEditTags" multiple :max-tag-count="2">
                                                        <Option v-for="item in projectTags" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                                    </Select>
                                                </FormItem>
                                                <FormItem>
                                                    <Button style="margin-left: 8px" @click="cancelIssueTagsForm(index,k, element.id)">{{ __('取消') }}</Button>
                                                    <Button type="primary" @click.native.prevent="updateTaskTags(index, k, element.id)">{{ __('确定') }}</Button>
                                                </FormItem>
                                            </Form>
                                        </div>
                                        <div v-if="!element.issueReleasesEdit" class="m-t-10">
                                            版本 <Tag v-for="item in element.project_releases" :key="item.id" :label="item.name" color="#c5c8ce">{{ item.name }}</Tag>
                                            <Icon type="ios-create-outline"  @click.native="editTaskReleases(index,k, element.id)" />
                                        </div>
                                        <div v-if="element.issueReleasesEdit">
                                            <Form>
                                                <FormItem>
                                                    <Select v-model="issueEditReleases" multiple :max-tag-count="2">
                                                        <Option v-for="item in projectReleases" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                                    </Select>
                                                </FormItem>
                                                <FormItem>
                                                    <Button style="margin-left: 8px" @click="cancelIssueReleasesForm(index,k, element.id)">{{ __('取消') }}</Button>
                                                    <Button type="primary" @click.native.prevent="updateTaskReleases(index, k, element.id)">{{ __('确定') }}</Button>
                                                </FormItem>
                                            </Form>
                                        </div>
                                        <div v-if="!element.issueModulesEdit" class="m-t-10">
                                            模块
                                            <Tag v-for="(item, index) in element.project_modules" :key="index" :label="item.name" :color="item.color">{{ item.name }}</Tag>
                                            <Icon type="ios-create-outline"  @click.native="editTaskModules(index,k, element.id)" />
                                        </div>
                                        <div v-if="element.issueModulesEdit">
                                            <Form>
                                                <FormItem>
                                                    <Select v-model="issueEditModules" multiple :max-tag-count="2">
                                                        <Option v-for="item in projectModules" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                                    </Select>
                                                </FormItem>
                                                <FormItem>
                                                    <Button style="margin-left: 8px" @click="cancelIssueModulesForm(index,k, element.id)">{{ __('取消') }}</Button>
                                                    <Button type="primary" @click.native.prevent="updateTaskModules(index, k, element.id)">{{ __('确定') }}</Button>
                                                </FormItem>
                                            </Form>
                                        </div>
                                    </Card>
                                </li>
                            </transition-group>
                        </draggable>
                    </div>
                    <div class="undraggable">
                        <i-button type="text" @click="addStage">添加任务阶段</i-button>
                    </div>
                </draggable>
                </Col>
                 </Row>
            </div>
        </div>
    </div>
</template>

<script src="./assets/view.js"></script>
<style lang="less" src="./assets/view.less"></style>
