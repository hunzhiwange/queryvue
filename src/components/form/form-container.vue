<template>
  <Affix :offset-top="48">
    <Menu mode="horizontal" theme="light" active-name="1">
      <Row>
        <Col flex="auto">
          <MenuItem
            v-for="(menuList, index) in menuLeft"
            :key="index"
            :name="index"
            :to="menuList.path"
          >
            <Icon :type="menuList.icon" />
            {{ menuList.title }}
          </MenuItem>
        </Col>
        <Col flex="275px" v-if="!currentOptions.form.displayOnly">
          <div class="pull-right">
            <ButtonGroup>
              <Button
                :loading="actionLoading"
                type="text"
                icon="ios-arrow-back"
                @click="handleSubmit(true)"
              >
                {{ __('提交并返回') }}
              </Button>
              <Button
                :loading="actionLoading"
                type="text"
                @click="handleSubmit()"
                icon="md-checkmark-circle"
              >
                {{ __('提交') }}
              </Button>
              <Button
                v-if="this.pageType == 'create'"
                :loading="actionLoading"
                icon="md-refresh"
                type="text"
                @click="handleReset()"
              >
                {{ __('重置') }}
              </Button>
            </ButtonGroup>
          </div>
        </Col>
        <Col>
          <MenuItem
            v-for="(menuRight, index) in menuRight"
            :key="index"
            :name="index"
            :to="menuRight.path"
          >
            <Icon :type="menuRight.icon" />
            {{ menuRight.title }}
          </MenuItem>
        </Col>
      </Row>
    </Menu>
  </Affix>
  <Form
    ref="formData"
    :model="formData"
    :rules="currentRules"
    :label-width="currentOptions.form.labelWidth"
    :labelPosition="currentOptions.form.labelPosition"
    class="fixed-footer-offset"
  >
    <Row :gutter="16" :wrap="false">
      <Col
        :[colLayoutProp(item)]="colLayoutValue(item)"
        v-for="(item, index) in layoutData"
        :key="'row-' + index"
        :style="
          (item.minWith ? 'min-width: ' + item.minWith + 'px;' : '') +
          (item.maxWith ? 'max-width: ' + item.maxWith + 'px;' : '') +
          colLayoutStyle(item)
        "
      >
        <Row :gutter="16">
          <template
            v-for="(colItem, colIndex) in item.subgroups"
            :key="colIndex"
          >
            <Col
              :span="colItem.span"
              :style="
                (colItem.minWith
                  ? 'min-width: ' + colItem.minWith + 'px;'
                  : '') +
                (colItem.maxWith ? 'max-width: ' + colItem.maxWith + 'px;' : '')
              "
            >
              <component
                v-if="colItem.tag"
                :is="colItem.tag"
                shadow
                :bordered="false"
                :title="colItem.name"
                :class="
                  'm-b-15 form-layout-box' +
                  (colItem.name && colIndex === 0 ? ' m-t-15' : '') +
                  (colItem.labelPosition
                    ? ' form-layout-' + colItem.labelPosition
                    : '')
                "
              >
                <Row :gutter="16">
                  <template
                    v-for="(config, key) in currentColumns"
                    :key="index"
                  >
                    <Col
                      :span="config.span ? config.span : 24"
                      :style="
                        (config.minWith
                          ? 'min-width: ' + config.minWith + 'px;'
                          : '') +
                        (config.maxWith
                          ? 'max-width: ' + config.maxWith + 'px;'
                          : '')
                      "
                      v-if="
                        config.layout == colItem.id ||
                        (!config.layout && colItem.id == 'default')
                      "
                    >
                      <FormItem
                        :prop="config.key.replace('.', '_comma_')"
                        :label-width="
                          config.labelWidth != undefined
                            ? config.labelWidth
                            : colItem.labelWidth
                            ? colItem.labelWidth
                            : 'auto'
                        "
                        :class="
                          config.labelPosition
                            ? ' form-layout-item-' + config.labelPosition
                            : ''
                        "
                      >
                        <template #label v-if="config.labelShow">
                          <Space :size="5">
                            <span
                              :style="
                                config.meta && config.meta.labelStyle
                                  ? config.meta.labelStyle
                                  : ''
                              "
                            >
                              {{ config.name }}
                            </span>
                            <Tooltip
                              v-if="config.help"
                              theme="light"
                              max-width="600"
                              placement="top"
                              :transfer="true"
                            >
                              <template #content>
                                {{ config.help }}
                                <i v-if="config.help_suggest">
                                  <Text type="warning">
                                    {{ config.help_suggest }}
                                  </Text>
                                </i>
                              </template>
                              <Icon
                                type="ios-help-circle-outline"
                                style="
                                  z-index: 5;
                                  cursor: pointer;
                                  position: relative;
                                "
                              />
                            </Tooltip>
                          </Space>
                        </template>
                        <template v-if="!config.displayOnly">
                          <i-input
                            v-if="config.type == 'input_search'"
                            search
                            v-model="formData[config.key]"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                          />
                          <SearchComponent
                            v-else-if="config.type == 'component'"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateCommonDate"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                            :key="componentKey"
                          />
                          <i-input
                            v-else-if="config.type == 'input'"
                            v-model="
                              formData[
                                config.meta && config.meta.field
                                  ? config.meta && config.meta.field
                                  : config.key
                              ]
                            "
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            :clearable="
                              !(config.meta && config.meta.readonly
                                ? config.meta.readonly
                                : false)
                            "
                            :disabled="
                              config.meta && config.meta.disabled
                                ? config.meta.disabled
                                : false
                            "
                            :readonly="
                              config.meta && config.meta.readonly
                                ? config.meta.readonly
                                : false
                            "
                          ></i-input>
                          <SearchSelect
                            v-else-if="
                              config.type == 'select' ||
                              config.type == 'select_multiple'
                            "
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateArrayJsonData"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                            :is-multiple="config.type == 'select_multiple'"
                          />
                          <SearchTreeSelect
                            v-else-if="
                              config.type == 'tree_select' ||
                              config.type == 'tree_select_multiple'
                            "
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateArrayJsonData"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                            :is-multiple="config.type == 'tree_select_multiple'"
                          />
                          <SearchTree
                            v-else-if="
                              config.type == 'tree' ||
                              config.type == 'tree_multiple'
                            "
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateTreeData"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                            :is-multiple="config.type == 'tree_multiple'"
                          />
                          <SearchCity
                            v-else-if="config.type == 'city'"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateCityData"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                          />
                          <SearchMarkdown
                            v-else-if="config.type == 'markdown'"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateCommonDate"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                          />
                          <SearchDialog
                            v-else-if="
                              config.type == 'dialog' ||
                              config.type == 'dialog_radio'
                            "
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateArrayJsonData"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                            :is-multiple="config.type == 'dialog'"
                          />
                          <SearchSwitch
                            v-else-if="config.type == 'switch'"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateCommonDate"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                          />
                          <InputNumber
                            v-else-if="config.type == 'input_number'"
                            style="width: 100%"
                            p2recision="6"
                            :min="
                              config.meta && config.meta.min != undefined
                                ? config.meta.min
                                : 0
                            "
                            :max="
                              config.meta && config.meta.max != undefined
                                ? config.meta.max
                                : 99999999999
                            "
                            v-model="
                              formData[
                                config.meta && config.meta.field
                                  ? config.meta && config.meta.field
                                  : config.key
                              ]
                            "
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            :active-change="false"
                            :disabled="
                              config.meta && config.meta.disabled
                                ? config.meta.disabled
                                : false
                            "
                            :readonly="
                              config.meta && config.meta.readonly
                                ? config.meta.readonly
                                : false
                            "
                          ></InputNumber>
                          <Input
                            v-else-if="config.type == 'input_password'"
                            style="width: 100%"
                            type="password"
                            password
                            autocomplete="new-password"
                            v-model="formData[config.key]"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                          ></Input>
                          <Checkbox
                            v-model="formData[config.key]"
                            v-else-if="
                              config.type == 'checkbox' ||
                              config.type == 'checkbox_border'
                            "
                            :true-value="
                              config.meta &&
                              config.meta.true_value !== undefined
                                ? config.meta.true_value
                                : 1
                            "
                            :false-value="
                              config.meta &&
                              config.meta.false_value !== undefined
                                ? config.meta.false_value
                                : 0
                            "
                            :border="config.type == 'checkbox_border'"
                          >
                            {{ config.name }}
                          </Checkbox>
                          <DatePicker
                            v-else-if="
                              config.type == 'datetime' || config.type == 'date'
                            "
                            :type="config.type"
                            :model-value="formData[config.key]"
                            @on-change="updateCommonDate($event, config.key)"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            style="width: 100%"
                            placement="bottom-end"
                          />
                          <Datetime
                            v-else-if="config.type == 'datetime_range'"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateCreateAt="updateCreateAt"
                            :create-at-min="formData[config.key]"
                            :create-at-max="
                              formData[
                                config.key.substring(
                                  0,
                                  config.key.lastIndexOf('_min'),
                                ) + '_max'
                              ]
                            "
                            :current-field="config.key"
                          />
                          <Input
                            v-else-if="config.type == 'textarea'"
                            v-model="formData[config.key]"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            type="textarea"
                            :autosize="{
                              minRows:
                                config.meta && config.meta.minRows
                                  ? config.meta.minRows
                                  : 3,
                              maxRows:
                                config.meta && config.meta.maxRows
                                  ? config.meta.maxRows
                                  : 5,
                            }"
                          ></Input>
                          <SearchUploadImage
                            v-else-if="
                              config.type == 'upload_image' ||
                              config.type == 'upload_image_multiple'
                            "
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateCommonDate"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                            :current-all-value="formData"
                            :is-multiple="
                              config.type == 'upload_image_multiple'
                            "
                          ></SearchUploadImage>
                        </template>
                        <template v-else>
                          <i-input
                            v-if="config.type == 'input_search'"
                            search
                            v-model="formData[config.key]"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                          />
                          <SearchComponent
                            v-else-if="config.type == 'component'"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateCommonDate"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                            :displayOnly="config.displayOnly"
                          />
                          <div
                            class="i-curd-item-box"
                            v-else-if="
                              config.type == 'input' ||
                              config.type == 'textarea'
                            "
                          >
                            {{
                              formData[
                                config.meta && config.meta.field
                                  ? config.meta && config.meta.field
                                  : config.key
                              ]
                            }}
                          </div>
                          <SearchSelect
                            v-else-if="
                              config.type == 'select' ||
                              config.type == 'select_multiple'
                            "
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateArrayJsonData"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                            :is-multiple="config.type == 'select_multiple'"
                            :displayOnly="config.displayOnly"
                          />
                          <SearchTreeSelect
                            v-else-if="
                              config.type == 'tree_select' ||
                              config.type == 'tree_select_multiple'
                            "
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateArrayJsonData"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                            :is-multiple="config.type == 'tree_select_multiple'"
                            :displayOnly="config.displayOnly"
                          />
                          <SearchTree
                            v-else-if="
                              config.type == 'tree' ||
                              config.type == 'tree_multiple'
                            "
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateTreeData"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                            :is-multiple="config.type == 'tree_multiple'"
                          />
                          <SearchCity
                            v-else-if="config.type == 'city'"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateCityData"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                          />
                          <SearchMarkdown
                            v-else-if="config.type == 'markdown'"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateCommonDate"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                            :displayOnly="config.displayOnly"
                          />
                          <SearchDialog
                            v-else-if="
                              config.type == 'dialog' ||
                              config.type == 'dialog_radio'
                            "
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateDialogData"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                            :is-multiple="config.type == 'dialog'"
                            :displayOnly="config.displayOnly"
                          />
                          <SearchSwitch
                            v-else-if="config.type == 'switch'"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateCommonDate"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                          />
                          <div
                            class="i-curd-item-box"
                            v-else-if="config.type == 'input_number'"
                          >
                            {{
                              formData[
                                config.meta && config.meta.field
                                  ? config.meta && config.meta.field
                                  : config.key
                              ]
                            }}
                          </div>
                          <Input
                            v-else-if="config.type == 'input_password'"
                            style="width: 100%"
                            type="password"
                            password
                            autocomplete="new-password"
                            v-model="formData[config.key]"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                          ></Input>
                          <Checkbox
                            v-model="formData[config.key]"
                            v-else-if="config.type == 'checkbox_border'"
                            :true-value="
                              config.meta &&
                              config.meta.true_value !== undefined
                                ? config.meta.true_value
                                : 1
                            "
                            :false-value="
                              config.meta &&
                              config.meta.false_value !== undefined
                                ? config.meta.false_value
                                : 0
                            "
                            :border="config.type == 'checkbox_border'"
                          >
                            {{ config.name }}
                          </Checkbox>
                          <Checkbox
                            v-model="formData[config.key]"
                            v-else-if="config.type == 'checkbox_border'"
                            :true-value="
                              config.meta &&
                              config.meta.true_value !== undefined
                                ? config.meta.true_value
                                : 1
                            "
                            :false-value="
                              config.meta &&
                              config.meta.false_value !== undefined
                                ? config.meta.false_value
                                : 0
                            "
                            :border="config.type == 'checkbox_border'"
                          >
                            {{ config.name }}
                          </Checkbox>
                          <div
                            class="i-curd-item-box"
                            v-else-if="config.type == 'checkbox'"
                          >
                            {{ formData[config.key] ? __('是') : __('否') }}
                          </div>
                          <div
                            class="i-curd-item-box"
                            v-else-if="config.type == 'datetime'"
                          >
                            {{ formData[config.key] }}
                          </div>
                          <div
                            class="i-curd-item-box"
                            v-else-if="config.type == 'date'"
                          >
                            {{
                              formData[config.key]
                                ? formData[config.key].substr(0, 10)
                                : ''
                            }}
                          </div>
                          <Datetime
                            v-else-if="config.type == 'datetime_range'"
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateCreateAt="updateCreateAt"
                            :create-at-min="formData[config.key]"
                            :create-at-max="
                              formData[
                                config.key.substring(
                                  0,
                                  config.key.lastIndexOf('_min'),
                                ) + '_max'
                              ]
                            "
                            :current-field="config.key"
                          />
                          <SearchUploadImage
                            v-else-if="
                              config.type == 'upload_image' ||
                              config.type == 'upload_image_multiple'
                            "
                            :placeholder="
                              config.placeholder
                                ? config.placeholder
                                : config.help
                            "
                            @updateData="updateCommonDate"
                            :current-value="formData[config.key]"
                            :api-source="config.meta"
                            :current-field="config.key"
                            :current-all-value="formData"
                            :is-multiple="
                              config.type == 'upload_image_multiple'
                            "
                            :displayOnly="config.displayOnly"
                          ></SearchUploadImage>
                        </template>
                      </FormItem>
                    </Col>
                  </template>
                </Row>
              </component>
            </Col>
          </template>
        </Row>
      </Col>
    </Row>

    <FooterToolbar
      class="footer-toolbar-box"
      v-if="!currentOptions.form.displayOnly"
    >
      <Row justify="end">
        <i-col span="24" class="text-right">
          <Button
            :loading="actionLoading"
            type="primary"
            icon="ios-arrow-back"
            @click="handleSubmit(true)"
          >
            {{ __('提交并返回') }}
          </Button>
          <Button
            :loading="actionLoading"
            type="default"
            icon="md-checkmark-circle"
            @click="handleSubmit()"
          >
            {{ __('提交') }}
          </Button>
          <Button
            v-if="this.pageType == 'create'"
            :loading="actionLoading"
            type="default"
            @click="handleReset()"
            icon="md-refresh"
          >
            {{ __('重置') }}
          </Button>
        </i-col>
      </Row>
    </FooterToolbar>
  </Form>
</template>

<script src="./form-container.jsx" lang="tsx"></script>
