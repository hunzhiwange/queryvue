<template>
  <div class="min-form" v-show="minForm">
    <Card :bordered="false">
      <template #title>
        {{ formItem.id ? __('编辑项目方法') : __('新增项目方法') }}
      </template>
      <div class="min-form-inner">
        <div class="min-form-body">
          <i-form
            ref="form"
            :rules="rules"
            :model="formItem"
            :label-width="110"
            class="w-1000"
          >
            <Row :gutter="16">
              <i-col span="12">
                <FormItem :label="__('名字')" prop="name">
                  <i-input
                    v-model.trim="formItem.name"
                    placeholder=""
                  ></i-input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem :label="__('排序')" prop="sort">
                  <i-input
                    type="number"
                    v-model.number="formItem.sort"
                    placeholder=""
                  ></i-input>
                </FormItem>
              </i-col>
            </Row>
            <Row :gutter="16">
              <i-col span="12">
                <FormItem :label="__('状态')">
                  <i-switch
                    v-model="formItem.status"
                    size="large"
                    :true-value="1"
                    :false-value="0"
                  >
                    <template #open>
                      <span>{{ __('启用') }}</span>
                    </template>
                    <template #close>
                      <span>{{ __('禁用') }}</span>
                    </template>
                  </i-switch>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem :label="__('所属项目')" prop="project_id">
                  <i-select
                    :disabled="!!formItem.id"
                    v-model="formItem.project_id"
                  >
                    <i-option
                      v-for="item in projects"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </i-option>
                  </i-select>
                </FormItem>
              </i-col>
            </Row>
          </i-form>
        </div>
        <div class="min-form-footer">
          <i-button
            type="primary"
            :loading="loading"
            @click.native.prevent="handleSubmit('form')"
          >
            {{ __('确定') }}
          </i-button>
          <i-button style="margin-left: 8px" @click="cancelMinForm('form')">
            {{ __('取消') }}
          </i-button>
        </div>
      </div>
    </Card>
  </div>
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
            v-if="utils.permission('project_label_status_button')"
          >
            {{ __('启用') }}
          </i-button>
          <i-button
            type="primary"
            icon="md-eye-off"
            @click="statusMany(0)"
            v-if="utils.permission('project_label_status_button')"
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
