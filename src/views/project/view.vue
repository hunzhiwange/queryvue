<template>
  <board_header
    ref="board_header"
    :project="project"
    active-name="index"
  ></board_header>
  <div style="display: none" class="fixed-footer-offset2">
    <Row>
      <i-col span="24">
        <search
          :projectIds="getProjectIds"
          ref="search"
          @getDataFromSearch="getDataFromSearch"
          @getProjectFavorDataFromSearch="getProjectFavorDataFromSearch"
          @add="add"
        ></search>
      </i-col>
    </Row>
  </div>
  <div class="project-navigation lay-content-box">
    <Skeleton :loading="loadingData" animated>
      <template #template>
        <div class="main-box2">
          <div class="stage-item2 p-3">
            <Skeleton
              loading
              :title="false"
              size="large"
              animated
              :paragraph="{
                rows: 7,
                width: ['50%', '100%', '100%', '100%', '100%', '100%', '100%'],
              }"
            />
          </div>
        </div>
      </template>
      <template #default>
        <div class="main-box">
          <div
            v-for="(stage, indexTop) in dragList"
            class="stage-item"
            :key="indexTop"
            :id="stage.project_label_id"
          >
            <div class="stage-header">
              <Badge :count="stage.list.length" type="success">
                <div class="title">{{ stage.name }}</div>
              </Badge>
              <div>
                <Dropdown>
                  <a href="javascript:void(0)">
                    <Icon type="md-more" size="18" color="#808695" />
                  </a>
                  <template #list>
                    <DropdownMenu>
                      <DropdownItem
                        @click.native="
                          updateCompleted(item.id, key, key == item.completed)
                        "
                      >
                        移动问题
                      </DropdownItem>
                      <DropdownItem
                        @click.native="
                          updateCompleted(item.id, key, key == item.completed)
                        "
                      >
                        编辑分类
                      </DropdownItem>
                      <DropdownItem
                        @click.native="
                          updateCompleted(item.id, key, key == item.completed)
                        "
                      >
                        删除分类
                      </DropdownItem>
                    </DropdownMenu>
                  </template>
                </Dropdown>
              </div>
            </div>
            <div v-if="!stage.issueForm" class="task-creator-handler-wrap">
              <a
                class="task-creator-handler link-add-handler"
                @click="addTask(stage.project_label_id)"
              >
                <Button type="text" size="small" icon="md-add">添加任务</Button>
              </a>
            </div>
            <div v-if="stage.issueForm" class="task-creator-wrap card p-3">
              <Form
                :ref="'issueForm-' + stage.project_label_id"
                :model="issueForm"
                :rules="issueFormRules"
                label-position="top"
              >
                <FormItem label="任务标题" prop="title">
                  <Input
                    v-model="issueForm.title"
                    type="text"
                    placeholder="任务标题..."
                  ></Input>
                </FormItem>
                <FormItem label="任务类型" prop="project_type_id">
                  <Select
                    v-model="issueForm.project_type_id"
                    @on-change="setCurrentProjectTypeIdForCreateIssue"
                  >
                    <Option
                      v-for="item in projectTypes"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <Space>
                    <Button
                      type="primary"
                      :loading="loadingIssue"
                      @click.native.prevent="
                        handleIssueSubmit(
                          'issueForm-' + stage.project_label_id,
                          stage.project_label_id,
                        )
                      "
                    >
                      {{ __('确定') }}
                    </Button>
                    <Button
                      style="margin-left: 8px"
                      @click="
                        cancelIssueForm(
                          'issueForm-' + stage.project_label_id,
                          stage.project_label_id,
                        )
                      "
                    >
                      {{ __('取消') }}
                    </Button>
                  </Space>
                </FormItem>
              </Form>
            </div>
            <draggable
              tag="ul"
              class="list-group-stage"
              v-bind="dragOptions"
              :list="stage.list"
              group="projectIssue"
              itemKey="id"
              @start="start"
              @end="end"
              :move="onMove"
              @change="change"
              :id="stage.project_label_id"
              item-key="key"
            >
              <template #item="{ element, index }">
                <li
                  class="list-group-item stage-header"
                  :key="element.key"
                  :id="element.id"
                >
                  <Card style="width: 100%" shadow>
                    <template #title>
                      <!-- <label data-v-5cb2b31c="" class="ivu-checkbox-wrapper ivu-checkbox-default"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span> <input type="checkbox" class="ivu-checkbox-input"></span></label> -->
                      <!-- <label data-v-5cb2b31c="" class="ivu-checkbox-wrapper ivu-checkbox-wrapper-checked ivu-checkbox-default"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span> <input type="checkbox" class="ivu-checkbox-input"></span></label> -->
                      <Checkbox
                        v-model="element.completed_bool"
                        @on-change="completeTask(indexTop, index, element.id)"
                      >
                        <em></em>
                      </Checkbox>
                      <Icon
                        :type="element.project_type_icon.icon"
                        :color="element.project_type_icon.color"
                      />
                      <a class="m-l-s" @click="viewTask(element.num)">
                        <span
                          :class="element.completed_bool ? 'item-removed' : ''"
                        >
                          {{ element.num }}
                        </span>
                      </a>
                    </template>
                    <template #extra>
                      <Dropdown>
                        <a href="javascript:void(0)">
                          <Icon type="md-more" size="18" color="#808695" />
                        </a>
                        <template #list>
                          <DropdownMenu>
                            <DropdownItem @click.native="viewTask(element.num)">
                              查看
                            </DropdownItem>
                            <DropdownItem
                              @click.native="
                                editTaskTags(indexTop, index, element.id)
                              "
                            >
                              标签
                            </DropdownItem>
                            <DropdownItem
                              @click.native="
                                editTaskReleases(indexTop, index, element.id)
                              "
                            >
                              版本
                            </DropdownItem>
                            <DropdownItem
                              @click.native="
                                editTaskModules(indexTop, index, element.id)
                              "
                            >
                              模块
                            </DropdownItem>
                            <DropdownItem
                              @click.native="
                                updateCompleted(
                                  item.id,
                                  key,
                                  key == item.completed,
                                )
                              "
                            >
                              归档
                            </DropdownItem>
                            <DropdownItem
                              @click.native="
                                delTask(indexTop, index, element.id)
                              "
                            >
                              删除
                            </DropdownItem>
                          </DropdownMenu>
                        </template>
                      </Dropdown>
                    </template>
                    <!-- <span class="check-box-wrapper">
                                            <label data-v-5cb2b31c="" class="ivu-checkbox-wrapper ivu-checkbox-default"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span> <input type="checkbox" class="ivu-checkbox-input"></span></label>
                                            <label data-v-5cb2b31c="" class="ivu-checkbox-wrapper ivu-checkbox-wrapper-checked ivu-checkbox-default"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span> <input type="checkbox" class="ivu-checkbox-input"></span></label>
                                        </span> -->
                    <span
                      v-if="!element.issueTitleEdit"
                      :class="
                        element.completed_bool ? 'item-removed name' : 'name'
                      "
                    >
                      <Paragraph
                        v-model="element.name"
                        editable
                        @on-edit-end="updateTask(indexTop, index, element.id)"
                        :edit-config="{ triggerType: 'text' }"
                        class="ivu-fl"
                      />
                      <Paragraph copyable>
                        <span style="display: none">
                          [{{ element.num }}]{{ element.name }}
                        </span>
                      </Paragraph>
                    </span>
                    <Divider orientation="right" size="small">
                      <em
                        style="
                          color: #c5c8ce;
                          font-weight: normal;
                          font-size: 13px;
                        "
                      >
                        {{ element.create_at }}
                      </em>
                    </Divider>
                    <div
                      v-if="
                        !element.issueTagsEdit &&
                        element.project_tags.length > 0
                      "
                      class="m-t-15"
                    >
                      标签
                      <Badge
                        v-for="item in element.project_tags"
                        :key="item.id"
                        :text="item.name"
                        :color="item.color"
                        class="m-r-10"
                      />
                      <Icon
                        type="ios-create-outline"
                        @click.native="
                          editTaskTags(indexTop, index, element.id)
                        "
                      />
                    </div>
                    <div v-if="element.issueTagsEdit">
                      <Form label-position="top">
                        <FormItem label="选择标签">
                          <Select
                            v-model="issueEditTags"
                            multiple
                            :max-tag-count="2"
                          >
                            <Option
                              v-for="item in projectTags"
                              :value="item.id"
                              :key="item.id"
                            >
                              {{ item.name }}
                            </Option>
                          </Select>
                        </FormItem>
                        <FormItem>
                          <Space>
                            <Button
                              type="primary"
                              @click.native.prevent="
                                updateTaskTags(indexTop, index, element.id)
                              "
                            >
                              {{ __('确定') }}
                            </Button>
                            <Button
                              style="margin-left: 8px"
                              @click="
                                cancelIssueTagsForm(indexTop, index, element.id)
                              "
                            >
                              {{ __('取消') }}
                            </Button>
                          </Space>
                        </FormItem>
                      </Form>
                    </div>
                    <div
                      v-if="
                        !element.issueReleasesEdit &&
                        element.project_releases.length > 0
                      "
                      class="m-t-15"
                    >
                      版本
                      <Tag
                        v-for="item in element.project_releases"
                        :key="item.id"
                        :label="item.name"
                        color="#c5c8ce"
                      >
                        {{ item.name }}
                      </Tag>
                      <Icon
                        type="ios-create-outline"
                        @click.native="
                          editTaskReleases(indexTop, index, element.id)
                        "
                      />
                    </div>
                    <div v-if="element.issueReleasesEdit">
                      <Form label-position="top">
                        <FormItem label="选择版本">
                          <Select
                            v-model="issueEditReleases"
                            multiple
                            :max-tag-count="2"
                          >
                            <Option
                              v-for="item in projectReleases"
                              :value="item.id"
                              :key="item.id"
                            >
                              {{ item.name }}
                            </Option>
                          </Select>
                        </FormItem>
                        <FormItem>
                          <Space>
                            <Button
                              type="primary"
                              @click.native.prevent="
                                updateTaskReleases(indexTop, index, element.id)
                              "
                            >
                              {{ __('确定') }}
                            </Button>
                            <Button
                              style="margin-left: 8px"
                              @click="
                                cancelIssueReleasesForm(
                                  indexTop,
                                  index,
                                  element.id,
                                )
                              "
                            >
                              {{ __('取消') }}
                            </Button>
                          </Space>
                        </FormItem>
                      </Form>
                    </div>
                    <div
                      v-if="
                        !element.issueModulesEdit &&
                        element.project_modules.length > 0
                      "
                      class="m-t-15"
                    >
                      模块
                      <Tag
                        v-for="(item, indexModule) in element.project_modules"
                        :key="indexModule"
                        :label="item.name"
                        :color="item.color"
                      >
                        {{ item.name }}
                      </Tag>
                      <Icon
                        type="ios-create-outline"
                        @click.native="
                          editTaskModules(indexTop, index, element.id)
                        "
                      />
                    </div>
                    <div v-if="element.issueModulesEdit">
                      <Form label-position="top">
                        <FormItem label="选择模块">
                          <Select
                            v-model="issueEditModules"
                            multiple
                            :max-tag-count="2"
                          >
                            <Option
                              v-for="item in projectModules"
                              :value="item.id"
                              :key="item.id"
                            >
                              {{ item.name }}
                            </Option>
                          </Select>
                        </FormItem>
                        <FormItem>
                          <Space>
                            <Button
                              type="primary"
                              @click.native.prevent="
                                updateTaskModules(indexTop, index, element.id)
                              "
                            >
                              {{ __('确定') }}
                            </Button>
                            <Button
                              style="margin-left: 8px"
                              @click="
                                cancelIssueModulesForm(
                                  indexTop,
                                  index,
                                  element.id,
                                )
                              "
                            >
                              {{ __('取消') }}
                            </Button>
                          </Space>
                        </FormItem>
                      </Form>
                    </div>
                  </Card>
                </li>
              </template>
            </draggable>
          </div>
          <div class="undraggable">
            <i-button type="primary" icon="md-add" @click="addStage">
              添加任务阶段
            </i-button>
          </div>
        </div>
      </template>
    </Skeleton>
  </div>
</template>

<script src="./assets/view.js" lang="tsx"></script>
<style scoped lang="less" src="./assets/view.less"></style>
