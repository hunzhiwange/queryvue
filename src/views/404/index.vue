<template>
  <div class="error404">
    <div class="error404-body-con">
      <Card>
        <div class="error404-body-con-title">
          4
          <span><Icon type="ios-navigate-outline"></Icon></span>
          4
        </div>
        <p class="error404-body-con-message">
          YOU&nbsp;&nbsp;LOOK&nbsp;&nbsp;LOST
        </p>
        <div class="error404-btn-con">
          <i-button
            @click="goHome"
            size="large"
            style="width: 200px"
            type="text"
          >
            {{ __('返回首页') }}
          </i-button>
          <i-button
            @click="backPage"
            size="large"
            style="width: 200px; margin-left: 40px"
            type="primary"
          >
            {{ __('返回上一页') }}
          </i-button>
        </div>
      </Card>
    </div>
  </div>
</template>

<style lang="less" src="./assets/index.less"></style>
<script src="./assets/index.js" lang="tsx"></script>
