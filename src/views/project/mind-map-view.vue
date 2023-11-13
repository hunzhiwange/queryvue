<template>
  <div class="lay-content-bo2x">
    <MindMap
      ref="myMindMap"
      :title="projectIssue.sub_title"
      :content="docContent.content"
      :readOnly="true"
      :minContent="minContent"
    ></MindMap>
  </div>
</template>

<script src="./assets/mind-map-view.js" lang="tsx"></script>
<style lang="less" src="./assets/mind-map-view.less"></style>
