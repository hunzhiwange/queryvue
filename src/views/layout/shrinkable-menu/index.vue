<template>
  <div class="ivu-shrinkable-menu">
    <sidebar-menu-shrink
      v-if="shrink"
      :shrink="tmpShrink && shrink"
      :menu-theme="theme"
      :sidebar-theme="sidebarTheme"
      :menu-list="menuList"
      :open-names="openNames"
      @on-change="handleChange"
    ></sidebar-menu-shrink>
    <sidebar-menu
      v-if="!shrink"
      :shrink="tmpShrink && shrink"
      :menu-theme="theme"
      :sidebar-theme="sidebarTheme"
      :menu-list="menuList"
      :open-names="openNames"
      @on-change="handleChange"
    ></sidebar-menu>
  </div>
</template>

<style lang="less" src="./assets/index.less"></style>
<script src="./assets/index.js" lang="tsx"></script>
