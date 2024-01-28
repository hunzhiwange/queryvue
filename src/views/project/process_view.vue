<template>
  <div class="lay-content-bo2x">
    <Flow
      ref="myFlow"
      :title="projectIssue.sub_title"
      :content="docContent.content"
      :readOnly="true"
      :minContent="minContent"
    ></Flow>
  </div>
</template>

<script src="./assets/process_view.js" lang="tsx"></script>
<style lang="less" src="./assets/process_view.less"></style>
