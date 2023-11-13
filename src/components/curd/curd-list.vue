<template>
  <CurdIndex
    ref="curdIndex"
    :search-column="searchColumn"
    :search-plan-source-type="searchPlanSourceType"
    :search-api="searchApi"
    :search-api-params="searchApiParams"
    :search-api-extend="searchApiExtend"
    :search-primary-key="searchPrimaryKey"
    :service="service"
    :leftLinks="leftLinks"
    :leftTabMenus="leftTabMenus"
    :actions="actions"
    :batchActions="batchActions"
    :tree="tree"
    :minDialog="minDialog"
    :mustColumn="mustColumn"
    :selectionRadio="selectionRadio"
    @handleContextMenu="handleContextMenu"
    @handleContextMenuAction="handleContextMenuAction"
    @handleBatchActions="handleBatchActions"
  />
</template>

<script src="./curd.js" lang="tsx"></script>
