<template>
  <Affix :offset-top="!minDialog.minDialog ? 48 : 0">
    <search
      ref="search"
      :search-column="searchColumn"
      :search-plan-source-type="searchPlanSourceType"
      :enabled-search-plan="enabledSearchPlan"
      :search-api="searchApi"
      :search-api-params="searchApiParams"
      :search-api-extend="searchApiExtend"
      :search-primary-key="searchPrimaryKey"
      :is-detail-page="isDetailPage"
      :treeOption="treeOption"
      :minDialog="minDialog"
      :mustColumn="mustColumn"
      @getDataFromSearch="getDataFromSearch"
      @searchExtend="searchExtend"
      @prepareNewSearchFormCustomer="prepareNewSearchFormCustomer"
      @searchExtendCallback="searchExtendCallback"
      @searchBaseExtend="searchBaseExtend"
      @toggleShow="toggleShow"
      @searchPlanChange="searchPlanChange"
    ></search>
  </Affix>
  <div
    :class="
      (!isDetailPage && !minDialog.minDialog ? 'fixed-footer-offset' : '') +
      (!isDetailPage ? ' i-layout-content-search' : '')
    "
  >
    <div class="i-crud-toolbar">
      <Row :wrap="false">
        <Col flex="1 1 auto" style="overflow: hidden">
          <div class="ivu-row ivu-row-no-wrap">
            <div class="ivu-col i-crud-toolbar-actions" style="flex: 1 1 auto">
              <RadioGroup
                v-model="$route.name"
                type="button"
                class="m-r-10"
                @on-change="toLeftTabMenu"
                v-if="!minDialog.minDialog && leftTabMenus.length > 0"
              >
                <Radio
                  v-for="(leftTabMenu, index) in leftTabMenus"
                  :key="index"
                  :label="leftTabMenu.name"
                >
                  <span>{{ leftTabMenu.title }}</span>
                </Radio>
              </RadioGroup>
              <slot name="header_left"></slot>
              <Text class="i-crud-toolbar-title" strong v-if="isDetailPage">
                {{ detailPageTitle }}
              </Text>
              <Text
                class="i-crud-toolbar-title"
                strong
                v-if="minDialog.minDialog"
              >
                {{ minDialog.title }}
              </Text>
              <template v-if="!isDetailPage && !minDialog.minDialog">
                <Button
                  v-for="(leftLink, index) in leftLinks"
                  :icon="leftLink.icon"
                  :key="index"
                  :type="leftLink.button"
                  @click="leftLinkAccess(leftLink)"
                >
                  {{ leftLink.name }}
                </Button>
              </template>
            </div>
          </div>
        </Col>
        <Col flex="0 1 160px" class="ivu-text-right" style="overflow: hidden">
          <Row>
            <Col flex="2">
              <Tooltip
                :content="__('导出当前页数据')"
                placement="top-start"
                theme="light"
              >
                <Button
                  class="i-crud-toolbar-btn"
                  icon="md-download"
                  @click="exportData(1)"
                ></Button>
              </Tooltip>
            </Col>
            <Col flex="2">
              <Tooltip
                :content="__('导出筛选数据')"
                placement="top-start"
                theme="light"
              >
                <Button
                  class="i-crud-toolbar-btn"
                  icon="ios-download"
                  @click="exportData(2)"
                ></Button>
              </Tooltip>
            </Col>
            <Col flex="2">
              <Tooltip
                :content="__('刷新')"
                placement="top-start"
                theme="light"
              >
                <Button
                  class="i-crud-toolbar-btn"
                  icon="md-refresh"
                  @click="refresh"
                ></Button>
              </Tooltip>
            </Col>
            <Col flex="2">
              <Tooltip
                :content="__('列配置')"
                placement="top-start"
                theme="light"
              >
                <Button
                  class="i-crud-toolbar-btn"
                  icon="md-options"
                  @click="column_set = true"
                ></Button>
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
    <div class="relative">
      <div
        v-if="selectedData.length > 0"
        class="i-crud-body-selection i-crud-table-header-tools"
      >
        {{ __('已选择 %d 项', selectedData.length) }}
        <Divider
          type="vertical"
          class="m-r-15 m-l-15"
          v-if="!minDialog.minDialog"
        />
        <ButtonGroup v-if="!minDialog.minDialog">
          <Button
            v-for="(batchAction, index) in batchActionsShow"
            :key="index"
            @click="handleBatchActions(batchAction.action)"
            size="small"
            type="text"
            :icon="batchAction.icon"
          >
            {{ batchAction.name }}
          </Button>
        </ButtonGroup>
      </div>
      <i-table
        :height="minDialog.minDialog ? searchTableHeight : 0"
        :style="selectedData.length > 0 ? 'margin-top:-40px;' : ''"
        :row-key="treeOption.row_key"
        :loading="loadingTable"
        ref="table"
        :columns="columnsShow"
        :data="data"
        :load-data="handleLoadData"
        class="relative search-table"
        @on-selection-change="onSelectionChange"
        @on-column-width-resize="onColumnWidthResize"
        :show-summary="showSummary"
        :summary-method="handleSummary"
        fixed-shadow="false"
      >
        <template #action="{ row, index }" v-if="actionsShow.length > 0">
          <Dropdown
            @on-visible-change="handleContextMenu(row, index)"
            :transfer="true"
            placement="left"
            v-if="!this.minDialog.minDialog"
          >
            <Button type="text" size="large" icon="ios-options"></Button>
            <template #list>
              <DropdownMenu>
                <DropdownItem
                  v-for="(action, index) in actionsShow"
                  :key="index"
                  @click="handleContextMenuAction(action.type, row, index)"
                >
                  <Icon :type="action.icon" />
                  {{ action.name }}
                </DropdownItem>
              </DropdownMenu>
            </template>
          </Dropdown>
        </template>
      </i-table>
    </div>
  </div>
  <component
    :is="!minDialog.minDialog ? 'FooterToolbar' : 'div'"
    :class="
      'footer-toolbar-box' +
      (minDialog.minDialog ? ' footer-toolbar-box-min-dialog' : '')
    "
    v-if="!isDetailPage"
  >
    <Row justify="end">
      <i-col span="24">
        <Page
          :class="!minDialog.minDialog ? 'fr' : ''"
          :total="total"
          :model-value="page"
          :page-size="$store.state.app.pageSize"
          show-sizer
          show-total
          show-elevator
          :page-size-opts="[20, 30, 50, 100]"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
        ></Page>
      </i-col>
    </Row>
  </component>
  <Drawer
    v-model="column_set"
    width="400"
    :styles="columns_styles"
    class-name="i-crud-toolbar-columns-box i-crud-toolbar-columns-set"
  >
    <template #header>
      <span class="i-crud-toolbar-columns-set-all">列设置</span>
    </template>
    <CellGroup>
      <Divider plain>固定在左侧</Divider>
      <draggable v-model="columns" item-key="id">
        <template #item="{ element }">
          <Cell
            class="i-crud-toolbar-columns-set-item"
            :key="index"
            v-if="element.fixed == 'left'"
          >
            <Checkbox v-model="element.show">{{ element.title }}</Checkbox>
            <template #extra>
              <span class="i-crud-toolbar-columns-set-item-extra">
                <InputNumber
                  v-model="element.width"
                  size="small"
                  class="m-r-10 w-100"
                  :precision="0"
                  :min="0"
                  :step="30"
                />
                <Button
                  size="small"
                  icon="md-pause"
                  type="text"
                  class="ivu-btn-icon-only"
                  @click="columnNotFixed(element)"
                ></Button>
                <Button
                  size="small"
                  icon="md-skip-forward"
                  type="text"
                  class="ivu-btn-icon-only"
                  @click="columnRight(element)"
                ></Button>
              </span>
            </template>
          </Cell>
        </template>
      </draggable>
      <Divider plain>不固定</Divider>
      <draggable v-model="columns" item-key="id">
        <template #item="{ element }">
          <Cell
            class="i-crud-toolbar-columns-set-item"
            :key="index"
            v-if="element.fixed != 'left' && element.fixed != 'right'"
          >
            <Checkbox v-model="element.show">{{ element.title }}</Checkbox>
            <template #extra>
              <span class="i-crud-toolbar-columns-set-item-extra">
                <InputNumber
                  v-model="element.width"
                  size="small"
                  class="m-r-10 w-100"
                  :precision="0"
                  :min="0"
                  :step="30"
                />
                <Button
                  size="small"
                  icon="md-skip-backward"
                  type="text"
                  class="ivu-btn-icon-only"
                  @click="columnLeft(element)"
                ></Button>
                <Button
                  size="small"
                  icon="md-skip-forward"
                  type="text"
                  class="ivu-btn-icon-only"
                  @click="columnRight(element)"
                ></Button>
              </span>
            </template>
          </Cell>
        </template>
      </draggable>
      <Divider plain>固定在右侧</Divider>
      <draggable v-model="columns" item-key="id">
        <template #item="{ element }">
          <Cell
            class="i-crud-toolbar-columns-set-item"
            :key="index"
            v-if="element.fixed == 'right'"
          >
            <Checkbox v-model="element.show">{{ element.title }}</Checkbox>
            <template #extra>
              <span class="i-crud-toolbar-columns-set-item-extra">
                <InputNumber
                  v-model="element.width"
                  size="small"
                  class="m-r-10 w-100"
                  :precision="0"
                  :min="0"
                  :step="30"
                />
                <Button
                  size="small"
                  icon="md-skip-backward"
                  type="text"
                  class="ivu-btn-icon-only"
                  @click="columnLeft(element)"
                ></Button>
                <Button
                  size="small"
                  icon="md-pause"
                  type="text"
                  class="ivu-btn-icon-only"
                  @click="columnNotFixed(element)"
                ></Button>
              </span>
            </template>
          </Cell>
        </template>
      </draggable>
    </CellGroup>
    <div class="i-crud-dialog-footer">
      <Space>
        <Dropdown @on-click="searchPlanClick" v-if="enabledSearchColumn">
          <Button type="default">
            {{ currentSearchPlan.name.substring(0, 6) }}
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <template #list>
            <DropdownMenu>
              <DropdownItem
                :selected="currentSearchPlan.id == item.id"
                v-for="(item, index) in searchPlanData"
                :name="item.id"
                :key="index"
              >
                {{ item.name }}
              </DropdownItem>
              <DropdownItem divided name="save">
                {{ __('保存为常用列配置') }}
              </DropdownItem>
              <DropdownItem v-if="currentSearchPlan.id > 0" name="update">
                {{ __('更新当前列配置') }}
              </DropdownItem>
              <DropdownItem v-if="currentSearchPlan.id > 0" name="delete">
                {{ __('删除当前列配置') }}
              </DropdownItem>
            </DropdownMenu>
          </template>
        </Dropdown>
        <Button type="primary" class="ivu-ml" @click="confirmSaveColumnTemp">
          {{ __('确定') }}
        </Button>
      </Space>
    </div>
  </Drawer>
  <Modal
    v-model="searchPlanModelForColumn"
    :title="__('常用列配置')"
    @on-ok="confirmSaveColumn"
    v-if="enabledSearchColumn"
  >
    <Input
      :maxlength="8"
      v-model="searchPlanNameForColumn"
      :placeholder="__('请输入常用列配置名称')"
    />
  </Modal>
</template>

<script src="./assets/index.js" lang="tsx"></script>
