<template>
  <div class="fixed-footer-offset">
    <Affix :offset-top="48">
      <search
        ref="search"
        @getDataFromSearch="getDataFromSearch"
        @add="add"
      ></search>
    </Affix>

    <i-table
      :loading="loadingTable"
      ref="table"
      :columns="columns"
      :data="data"
      class="search-table"
      @on-selection-change="onSelectionChange"
    ></i-table>
  </div>
  <FooterToolbar class="footer-toolbar-box">
    <Row justify="end">
      <i-col span="8">
        <ButtonGroup shape="circle">
          <i-button
            type="primary"
            icon="md-eye"
            @click="statusMany(1)"
            v-if="utils.permission('project_issue_status_button')"
          >
            {{ __('启用') }}
          </i-button>
          <i-button
            type="primary"
            icon="md-eye-off"
            @click="statusMany(0)"
            v-if="utils.permission('project_issue_status_button')"
          >
            {{ __('禁用') }}
          </i-button>
        </ButtonGroup>
      </i-col>
      <i-col span="16" class-name="fr">
        <Page
          class="fr"
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
  </FooterToolbar>
</template>

<script src="./assets/index.js" lang="tsx"></script>
