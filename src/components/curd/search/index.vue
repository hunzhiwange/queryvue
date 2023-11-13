<template>
  <div
    :class="
      'search-wrap ' +
      (searchShow ? 'search-wrap-expand' : 'search-wrap-collapse')
    "
    style="margin-bottom: 0"
    v-if="!isDetailPage"
  >
    <Row :gutter="16" :wrap="false">
      <Col flex="auto">
        <Row
          :gutter="16"
          v-for="(configItem, index_parent) in sliceConfigItem"
          v-show="index_parent > 0 ? searchShow : true"
          :class="index_parent > 0 ? 'm-t-10' : ''"
        >
          <template v-for="config in configItem">
            <i-col :span="config.width * 6" style="position: relative">
              <Tooltip
                :placement="minDialog.minDialog ? 'top-start' : 'top-start'"
                theme="light"
                :max-width="600"
                :transfer="true"
                :delay="1000"
              >
                <template #content>
                  <Text type="warning">
                    「{{ searchTypeName(config.search, config.type)
                    }}{{ __('匹配') }}」
                  </Text>
                  {{ config.help ? config.help : config.name }}
                  <i v-if="config.help_suggest">
                    <Text type="warning">
                      {{ config.help_suggest }}
                    </Text>
                  </i>
                </template>
                <Row :gutter="28" :wrap="false">
                  <Col flex="70px" style="overflow: hidden">
                    <label
                      style="
                        line-height: 35px;
                        overflow: hidden;
                        white-space: nowrap;
                      "
                    >
                      {{
                        config.type == 'input_search'
                          ? __('关键词')
                          : config.name
                      }}
                    </label>
                  </Col>
                  <Col flex="auto" style="overflow: hidden">
                    <i-input
                      v-if="config.type == 'input_search'"
                      @on-search="search()"
                      search
                      v-model="searchForm[config.key]"
                      :placeholder="config.name"
                    />
                    <i-input
                      v-else-if="config.type == 'input'"
                      v-model="searchForm[config.key]"
                      :placeholder="config.name + config.nameExtend"
                      clearable
                    />
                    <SearchSelect
                      v-else-if="
                        config.type == 'select' ||
                        config.type == 'select_multiple'
                      "
                      :placeholder="config.name"
                      @updateData="updateArrayJsonData"
                      :current-value="searchForm[config.key]"
                      :api-source="config.meta"
                      :current-field="config.key"
                      :is-multiple="config.type == 'select_multiple'"
                    />
                    <SearchTreeSelect
                      v-else-if="
                        config.type == 'tree_select' ||
                        config.type == 'tree_select_multiple'
                      "
                      :placeholder="config.name"
                      @updateData="updateArrayJsonData"
                      :current-value="searchForm[config.key]"
                      :api-source="config.meta"
                      :current-field="config.key"
                      :is-multiple="config.type == 'tree_select_multiple'"
                    />
                    <InputNumber
                      v-else-if="config.type == 'input_number'"
                      style="width: 100%"
                      p2recision="6"
                      :min="
                        config.meta && config.meta.min ? config.meta.min : 0
                      "
                      v-model="searchForm[config.key]"
                      :placeholder="config.name + config.nameExtend"
                      :active-change="false"
                    ></InputNumber>
                    <Datetime
                      v-else-if="config.type == 'datetime_range'"
                      :placeholder="config.name"
                      @updateCreateAt="updateCreateAt"
                      :create-at-min="searchForm[config.key]"
                      :create-at-max="
                        searchForm[
                          config.key.substring(
                            0,
                            config.key.lastIndexOf('_min'),
                          ) + '_max'
                        ]
                      "
                      :current-field="config.key"
                    />
                    <SearchDialog
                      v-else-if="
                        config.type == 'dialog' || config.type == 'dialog_radio'
                      "
                      :placeholder="config.name"
                      @updateData="updateArrayJsonData"
                      :current-value="searchForm[config.key]"
                      :api-source="config.meta"
                      :current-field="config.key"
                      :is-multiple="config.type == 'dialog'"
                    />
                  </Col>
                </Row>
              </Tooltip>
            </i-col>
          </template>
        </Row>
      </Col>
      <Col flex="300px">
        <Space size="small" type="flex">
          <Button
            type="primary"
            shape="circle"
            @click.native.prevent="search()"
            icon="ios-search"
          >
            {{ __('搜索') }}
          </Button>
          <Tooltip
            :content="__('重置')"
            placement="top-start"
            theme="light"
            :transfer="true"
          >
            <i-button
              icon="md-refresh"
              type="text"
              @click.native.prevent="reset()"
            ></i-button>
          </Tooltip>
          <Tooltip
            :content="searchShow ? __('收起') : __('展开')"
            placement="top-start"
            theme="light"
            :transfer="true"
          >
            <i-button
              type="default"
              @click="toggleShow()"
              :icon="searchShow ? 'ios-arrow-up' : 'ios-arrow-down'"
            ></i-button>
          </Tooltip>
          <Dropdown @on-click="searchPlanClick" v-if="enabledSearchPlan">
            <Tooltip
              :content="this.currentSearchPlan.name"
              placement="top-start"
              theme="light"
              :transfer="true"
            >
              <Button type="default">
                {{ this.currentSearchPlan.name.substring(0, 6) }}
                <Icon type="ios-arrow-down"></Icon>
              </Button>
            </Tooltip>
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
                  {{ __('保存为常用筛选') }}
                </DropdownItem>
                <DropdownItem v-if="currentSearchPlan.id > 0" name="update">
                  {{ __('更新当前筛选') }}
                </DropdownItem>
                <DropdownItem v-if="currentSearchPlan.id > 0" name="delete">
                  {{ __('删除当前筛选') }}
                </DropdownItem>
              </DropdownMenu>
            </template>
          </Dropdown>
          <Modal
            v-model="searchPlanModel"
            :title="__('常用搜索')"
            @on-ok="saveSearchPlan"
            v-if="enabledSearchPlan"
          >
            <Input
              :maxlength="8"
              v-model="searchPlanName"
              :placeholder="__('请输入常用搜索名称')"
            />
          </Modal>
        </Space>
      </Col>
    </Row>
  </div>
</template>

<script src="./assets/index.js" lang="tsx"></script>
