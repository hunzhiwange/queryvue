<template>
  <Menu mode="horizontal" theme="light" active-name="1">
    <Row type="flex" justify="center" align="middle">
      <Col span="8">
        <MenuItem name="4">
          <Button
            type="text"
            size="small"
            :loading="saveLoading"
            icon="ios-search"
            @click="saveContent()"
          >
            保存
          </Button>
        </MenuItem>
        <MenuItem name="26" :to="'/board/' + projectIssue.project.num">
          <Icon type="md-list" />
          {{ projectIssue.project.name }}
        </MenuItem>
        <MenuItem name="42">
          <Icon type="md-time" />
          历史版本
        </MenuItem>
        <MenuItem
          name="422"
          v-if="this.projectIssue.project_type.content_type == 7"
        >
          <Button
            type="text"
            size="small"
            icon="ios-eye"
            @click="mindMapPreview"
          >
            预览
          </Button>
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

  <div class="lay-content-box edit-content-box">
    <v-md-editor
      ref="projectContent"
      v-model="projectIssue.project_content.content"
      @save="saveContent"
      height="calc(100% - 16px)"
      :disabled-menus="[]"
      :default-show-toc="projectIssue.project_type.content_type != 8"
      toc-nav-position-right="true"
      @upload-image="handleUploadImage"
      :mode="projectIssue.project_type.content_type != 8 ? 'editable' : 'edit'"
    ></v-md-editor>
  </div>
  <Modal
    v-model="mindMapView"
    fullscreen
    :title="this.projectIssue.title"
    v-if="this.projectIssue.project_type.content_type == 7"
  >
    <ButtonGroup>
      <Button @click="zoomIn">
        <Icon type="md-add" />
        放大
      </Button>
      <Button @click="zoomOut">
        <Icon type="md-remove" />
        缩小
      </Button>
      <Button @click="fit">
        <Icon type="md-contract" />
        自适应
      </Button>
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
      <Option
        v-for="item in levelMindMap"
        :value="item.value"
        :key="item.value"
      >
        {{ item.label }}
      </Option>
    </Select>

    <svg
      ref="markmap"
      id="markmap"
      style="width: 100%; height: calc(100% - 100px)"
    ></svg>
  </Modal>
</template>

<script src="./assets/content.js" lang="tsx"></script>
<style lang="less" src="./assets/content.less"></style>
