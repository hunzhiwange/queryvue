<template>
  <Affix :offset-top="48" v-if="!this.minContent">
    <div class="header">
      <Menu mode="horizontal" theme="light" active-name="1">
        <Row type="flex" justify="center" align="middle">
          <Col span="8">
            <MenuItem name="2" :to="'/board/' + projectIssue.project.num">
              <Icon type="md-list" />
              {{ projectIssue.project.name }}
            </MenuItem>
          </Col>
          <Col span="12">
            <MenuItem name="1" :to="'/issue/' + projectIssue.num">
              <Icon type="md-arrow-round-back" />
              {{ projectIssue.title }}
            </MenuItem>
          </Col>
          <Col span="4">
            <div class="pull-right">
              <MenuItem name="3" :to="'/content/' + projectIssue.num + '/edit'">
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
  </Affix>

  <div
    v-if="projectIssue.project_type.content_type == 9"
    :class="minContent ? 'h-100p' : 'lay-content-box'"
  >
    <Swagger
      ref="mySwagger"
      class="body-swagger"
      :content="projectIssue.project_content.content"
      :isUrl="true"
      :minContent="minContent"
    ></Swagger>
  </div>

  <div
    v-else-if="projectIssue.project_type.content_type == 8"
    :class="minContent ? 'h-100p' : 'lay-content-box'"
  >
    <Swagger
      ref="mySwagger"
      :content="projectIssue.project_content.content"
      :minContent="minContent"
    ></Swagger>
  </div>

  <div
    v-else-if="projectIssue.project_type.content_type == 6"
    :class="minContent ? '' : 'lay-content-box'"
  >
    <ProcessView
      ref="myProcessView"
      :docContent="projectIssue.project_content"
      :projectIssue="projectIssue"
      :minContent="minContent"
    ></ProcessView>
  </div>

  <div
    v-else-if="projectIssue.project_type.content_type == 10"
    :class="minContent ? '' : 'lay-content-box'"
  >
    <MindMapView
      ref="myMindMapView"
      :docContent="projectIssue.project_content"
      :projectIssue="projectIssue"
      :minContent="minContent"
    ></MindMapView>
  </div>

  <div
    v-else-if="projectIssue.project_type.content_type == 7"
    :class="minContent ? '' : 'lay-content-box'"
  >
    <ContentView
      ref="myContentView"
      :docContent="projectIssue.project_content"
      :projectIssue="projectIssue"
      :minContent="minContent"
    ></ContentView>
  </div>

  <div v-else>
    <Card :bordered="false" shadow v-if="!minContent">
      <v-md-preview :text="projectIssue.project_content.content"></v-md-preview>
    </Card>
    <div v-else>
      <v-md-preview :text="projectIssue.project_content.content"></v-md-preview>
    </div>
  </div>
</template>

<script src="./assets/issue-content.js" lang="tsx"></script>
