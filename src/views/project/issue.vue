<template>
  <Affix :offset-top="48">
    <board_header
      ref="board_header"
      :project="project"
      active-name="issue"
      :issueNum="projectIssue.num"
    ></board_header>
  </Affix>
  <div class="project-navigation2 m-t-15">
    <Row :gutter="16">
      <Col span="24">
        <Card :bordered="false" shadow class="version-item">
          <template #title>
            <Paragraph copyable style="width: 25px;position: absolute;right:10px;">
              <span style="display: none">
                [{{ projectIssue.num }}]{{ projectIssue.title }}
              </span>
            </Paragraph>
            <Paragraph
              v-model="projectIssue.title"
              editable
              @on-edit-end="updateIssueTitle"
              :edit-config="{ triggerType: 'text' }"
              style="width: 50%;"
            />
          </template>
          <Row>
            <Col span="18">
              <ButtonGroup class="m-r-15">
                <Button
                  type="primary"
                  @click="editContent(projectIssue.num)"
                >
                  <Icon type="md-create" />
                  编辑
                </Button>
              </ButtonGroup>
              <ButtonGroup class="m-r-15">
                <Button type="primary">
                  <Icon type="ios-text" />
                  备注
                </Button>
              </ButtonGroup>
              <ButtonGroup class="m-r-15">
                <Button type="primary">分配</Button>
                <Button type="primary">
                  <Dropdown>
                    更多
                    <Icon type="ios-arrow-down"></Icon>
                    <template #list>
                      <DropdownMenu>
                        <DropdownItem>工作日志</DropdownItem>
                        <DropdownItem divided>附加文件</DropdownItem>
                        <DropdownItem divided>移动</DropdownItem>
                        <DropdownItem>链接</DropdownItem>
                        <DropdownItem>复制</DropdownItem>
                        <DropdownItem>编辑标签</DropdownItem>
                      </DropdownMenu>
                    </template>
                  </Dropdown>
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button type="primary">完成</Button>
                <Button type="primary">进行中</Button>
                <Button type="primary">
                  <Dropdown>
                    更多工作流动作
                    <Icon type="ios-arrow-down"></Icon>
                    <template #list>
                      <DropdownMenu>
                        <DropdownItem>关闭</DropdownItem>
                        <DropdownItem>分配任务</DropdownItem>
                        <DropdownItem>已转需求</DropdownItem>
                      </DropdownMenu>
                    </template>
                  </Dropdown>
                </Button>
              </ButtonGroup>
            </Col>
            <Col span="6" style="text-align: right">
              <ButtonGroup>
                <Button type="primary">
                  <Icon type="md-share-alt" />
                  分享
                </Button>
                <Button type="primary">
                  <Dropdown>
                    <Icon type="md-download" />
                    导出
                    <Icon type="ios-arrow-down"></Icon>
                    <template #list>
                      <DropdownMenu>
                        <DropdownItem>XML</DropdownItem>
                        <DropdownItem>JSON</DropdownItem>
                        <DropdownItem>Word</DropdownItem>
                        <DropdownItem>打印预览</DropdownItem>
                      </DropdownMenu>
                    </template>
                  </Dropdown>
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <Row :gutter="16" class="m-t-15">
      <Col span="18">
        <Row :gutter="16">
          <Col span="24">
            <Card :bordered="false" shadow class="version-item">
              <template #title>
                <strong>问题详情</strong>
              </template>
              <Row>
                <Col span="4">类型:</Col>
                <Col span="8">
                  {{ projectIssue.project_type.content_type_enum }}
                </Col>
                <Col span="4">状态:</Col>
                <Col span="8">{{ projectIssue.project_label.name }}</Col>
              </Row>
              <Row>
                <Col span="4">优先级:</Col>
                <Col span="8">{{ projectIssue.level_enum }}</Col>
                <Col span="4">解决结果:</Col>
                <Col span="8">{{ projectIssue.completed_enum }}</Col>
              </Row>
              <Row>
                <Col span="4">影响版本:</Col>
                <Col span="8">y</Col>
                <Col span="4">解决版本:</Col>
                <Col span="8">y</Col>
              </Row>
              <Row>
                <Col span="4">模块:</Col>
                <Col span="20">
                  <div v-if="!issueModulesEdit">
                    <Tag
                      v-for="(item, index) in projectIssue.project_modules"
                      :key="index"
                      :label="item.name"
                      :color="item.color"
                    >
                      {{ item.name }}
                    </Tag>
                    <Icon
                      type="ios-create-outline"
                      @click.native="editTaskModules()"
                    />
                  </div>
                  <div v-if="issueModulesEdit">
                    <Form>
                      <FormItem>
                        <Select
                          v-model="issueEditModules"
                          multiple
                          :max-tag-count="4"
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
                        <Button
                          style="margin-left: 8px"
                          @click="cancelIssueModulesForm()"
                        >
                          {{ __('取消') }}
                        </Button>
                        <Button
                          type="primary"
                          @click.native.prevent="updateTaskModules()"
                        >
                          {{ __('确定') }}
                        </Button>
                      </FormItem>
                    </Form>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span="4">标签:</Col>
                <Col span="20">y</Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row :gutter="16" class="m-t-15">
          <Col span="24">
            <Card :bordered="false" shadow :class="'issue-content'+([10,9,8,6].includes(projectIssue.project_type_id) ? ' issue-content-no-padding' : '')">
              <template #title>
                <strong>描述</strong>
              </template>

              <template #extra>
                <Button
                  size="small"
                  type="text"
                  @click="previewContent"
                >
                  <Icon type="md-document" />
                  查看
                </Button>

                <Button
                  size="small"
                  class="m-l-10"
                  type="text"
                  @click=" editContent(projectIssue.num)"
                >
                  <Icon type="md-create" />
                  编辑
                </Button>
              </template>

              <div
                class="doc-content-view"
                >
                <div style="height: 600px;width: 100%;overflow-x: hidden;">
                  <IssueContent :minContent="true" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row :gutter="16" class="m-t-15">
          <Col span="24">
            <Card :bordered="false" shadow class="version-item">
              <template #title>
                <strong>附件</strong>
              </template>
            </Card>
          </Col>
        </Row>
        <Row :gutter="16" class="m-t-15">
          <Col span="24">
            <Card :bordered="false" shadow class="version-item">
              <template #title>
                <strong>问题链接</strong>
              </template>
            </Card>
          </Col>
        </Row>
        <Row :gutter="16" class="m-t-15">
          <Col span="24">
            <Card :bordered="false" shadow class="version-item">
              <template #title>
                <strong>子任务</strong>
              </template>
            </Card>
          </Col>
        </Row>
        <Row :gutter="16" class="m-t-15">
          <Col span="24">
            <Card :bordered="false" shadow class="version-item">
              <template #title>
                <strong>活动</strong>
              </template>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span="6">
        <Row :gutter="16">
          <Col span="24">
            <Card :bordered="false" shadow class="version-item">
              <template #title>
                <strong>用户</strong>
              </template>
              <Row>
                <Col span="8">经办人:</Col>
                <Col span="16">y</Col>
              </Row>
              <Row>
                <Col span="8">报告人:</Col>
                <Col span="16">y</Col>
              </Row>
              <Row>
                <Col span="8">投票:</Col>
                <Col span="16">y</Col>
              </Row>
              <Row>
                <Col span="8">关注人:</Col>
                <Col span="16">y</Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row :gutter="16" class="m-t-15">
          <Col span="24">
            <Card :bordered="false" shadow class="version-item">
              <template #title>
                <strong>日期</strong>
              </template>
              <Row>
                <Col span="8">创建:</Col>
                <Col span="16">
                  {{ projectIssue.create_at }}
                </Col>
              </Row>
              <Row>
                <Col span="8">更新:</Col>
                <Col span="16">
                  {{ projectIssue.update_at }}
                </Col>
              </Row>
              <Row>
                <Col span="8">解决:</Col>
                <Col span="16">
                  {{
                    2 == projectIssue.completed
                      ? projectIssue.completed_date
                      : ''
                  }}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>
<script src="./assets/issue.js" lang="tsx"></script>
<style lang="less" src="./assets/issue.less"></style>
