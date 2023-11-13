<template>
  <span
    @click="showMessage"
    class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-message"
  >
    <Tooltip
      :content="value > 0 ? value + ' ' + __('条新消息') : __('无新消息')"
      placement="bottom"
      theme="light"
    >
      <Badge :count="value" dot>
        <Icon type="ios-notifications-outline" size="23"></Icon>
      </Badge>
    </Tooltip>
  </span>
</template>

<script src="./assets/index.js" lang="tsx"></script>
