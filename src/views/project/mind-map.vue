<template>
  <Menu mode="horizontal" theme="light" active-name="1">
    <Row>
      <Col span="6">
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
        <div style="text-align: center">
          <MenuItem name="1" :to="'/issue/' + projectIssue.num">
            <Icon type="md-arrow-round-back" />
            {{ projectIssue.title }}
          </MenuItem>
        </div>
      </Col>
      <Col span="6">
        <div class="pull-right">
          <MenuItem name="3" :to="'/content/' + projectIssue.num">
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
  <div class="lay-content-box">
    <MindMap
      ref="myMindMap"
      :title="projectIssue.sub_title"
      :content="docContent.content"
      @saveData="saveData"
    ></MindMap>
  </div>
</template>

<script src="./assets/mind-map.js" lang="tsx"></script>
<style lang="less" src="./assets/mind-map.less"></style>
