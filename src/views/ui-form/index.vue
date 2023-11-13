<template>
  <div class="min-form" v-show="minForm">
    <Card :bordered="false">
      <p slot="title">
        {{ __('数据源') }}
      </p>
      <div class="min-form-inner">
        <div class="min-form-body">
          <i-form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="110"
            class="w-1000"
          >
            <Row :gutter="16">
              <i-col span="12">
                <FormItem :label="__('实体名称')" prop="entity_name">
                  <i-input
                    v-model.trim="formValidate.entity_name"
                    placeholder=""
                  ></i-input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem :label="__('实体标识')" prop="source_type">
                  <i-input
                    type="number"
                    precision="0"
                    v-model.number="formValidate.source_type"
                    placeholder=""
                  ></i-input>
                </FormItem>
              </i-col>
            </Row>
            <Row :gutter="16">
              <i-col span="12">
                <FormItem :label="__('实体应用')">
                  <i-input
                    v-model.trim="formValidate.entity_app"
                    placeholder=""
                  ></i-input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem :label="__('实体')" prop="entity">
                  <i-input
                    v-model.trim="formValidate.entity"
                    placeholder=""
                  ></i-input>
                </FormItem>
              </i-col>
            </Row>
          </i-form>
        </div>
        <div class="min-form-footer">
          <i-button
            type="primary"
            :loading="loading"
            @click.native.prevent="handleSubmit('formValidate')"
          >
            {{ __('确定') }}
          </i-button>
          <i-button style="margin-left: 8px" @click="cancelMinForm()">
            {{ __('取消') }}
          </i-button>
        </div>
      </div>
    </Card>
  </div>

  <Card :dis-hover="true" :shadow="false" class="m-b-15">
    <template #title>实体 {{ formValidate.entity_name }}</template>
    <div style="text-align: center">
      <ButtonGroup size="large" shape="circle">
        <Button icon="md-settings" type="primary" @click="this.minForm = true">
          设置数据源
        </Button>
        <Button
          icon="ios-download-outline"
          type="primary"
          @click="downloadTableColumn"
        >
          下载列配置
        </Button>
        <Button
          icon="ios-download-outline"
          type="primary"
          @click="downloadSearchColumn"
        >
          下载搜索项
        </Button>
        <Button
          icon="ios-download-outline"
          type="primary"
          @click="downloadForm"
        >
          下载表单项
        </Button>
      </ButtonGroup>
      <div
        class="bg-gray-100 px-6 py-3 text-gray-400 text-center font-extrabold rounded-full mt-5 dark:bg-gray-headerbg"
      >
        apiQL/v1:{{ formValidate.entity_app }}:{{ formValidate.entity }}
      </div>
    </div>
  </Card>

  <CurdIndex
    ref="curdIndex"
    :search-column="searchColumn"
    :search-plan-source-type="searchPlanSourceType"
    :search-api="searchApi"
    :search-api-extend="searchApiExtend"
  />
</template>

<script lang="tsx">
import CurdIndex from '@/components/curd/index'
import { getCache, setCache } from '@/utils/cache'
import { cloneDeep } from 'lodash'

export default {
  components: {
    CurdIndex,
  },
  data() {
    return {
      searchPlanSourceType: 0,
      searchColumn: [],
      columns: [],
      forms: [],
      searchApi: '',
      searchApiExtend: {},
      minForm: false,
      formValidate: {
        entity_name: 'test',
        entity_app: 'base',
        entity: 'test',
        source_type: 20230420000315,
      },
      ruleValidate: {
        entity_name: [
          { required: true, message: '实体名字不能为空', trigger: 'blur' },
        ],
        entity: [{ required: true, message: '实体不能为空', trigger: 'blur' }],
        source_type: [
          {
            required: true,
            type: 'integer',
            message: '实体类型只能为整数',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    downloadSearchColumn() {
      let newColumns = []
      let searchColumn = cloneDeep(this.searchColumn)
      searchColumn.forEach((item) => {
        let newItem = item
        if (
          item.key != 'key' &&
          (Object.prototype.hasOwnProperty.call(newItem, 'download_name') ||
            Object.prototype.hasOwnProperty.call(newItem, 'name'))
        ) {
          newItem['download_name'] =
            "__('" +
            (newItem['download_name']
              ? newItem['download_name']
              : newItem['name']) +
            "')"
        }

        if (Object.prototype.hasOwnProperty.call(newItem, 'download_name')) {
          newItem.name = newItem.download_name
          delete newItem.download_name
        }

        this.removeItemField(newItem)

        if (
          Object.prototype.hasOwnProperty.call(newItem, 'width') &&
          newItem.width == 1
        ) {
          delete newItem.width
        }
        if (Object.prototype.hasOwnProperty.call(newItem, 'params')) {
          delete newItem.params
        }

        if (
          newItem.meta &&
          newItem.meta.data_type &&
          newItem.meta.data_type === 'yes_no'
        ) {
          if (Object.prototype.hasOwnProperty.call(newItem.meta, 'data')) {
            delete newItem.meta.data
          }
          if (newItem.meta.key) {
            delete newItem.meta.key
          }
          if (newItem.meta.value) {
            delete newItem.meta.value
          }
        }

        newColumns.push(newItem)
      })

      let data = 'export default ' + JSON.stringify(newColumns, null, 2)

      // 使用正则表达式进行替换
      var pattern = /"__(.*?)"/g
      data = data.replace(pattern, '__\$1')

      this.downloadJSONFile(data, 'search-column.js')
    },
    downloadTableColumn() {
      let newColumns = []
      let columns = cloneDeep(this.columns)
      columns.forEach((item) => {
        let newItem = item
        if (Object.prototype.hasOwnProperty.call(newItem, 'priority')) {
          delete newItem.priority
        }
        if (
          Object.prototype.hasOwnProperty.call(newItem, 'show') &&
          newItem.show
        ) {
          delete newItem.show
        }

        this.removeItemField(newItem)

        if (
          Object.prototype.hasOwnProperty.call(newItem, 'resizable') &&
          newItem.resizable
        ) {
          delete newItem.resizable
        }

        newItem['title'] = "__('" + newItem['title'] + "')"
        newColumns.push(newItem)
      })

      let data =
        'export default {\n' +
        '  data() {\n' +
        '    return {\n' +
        '      columns: ' +
        JSON.stringify(newColumns, null, 2) +
        '\n' +
        '    }' +
        '  }' +
        '}'

      // 使用正则表达式进行替换
      var pattern = /"__(.*?)"/g
      data = data.replace(pattern, '__\$1')

      this.downloadJSONFile(data, 'table-column.jsx')
    },
    downloadForm() {
      let newColumns = []
      let forms = cloneDeep(this.forms)
      forms.forEach((item) => {
        let newItem = item
        if (Object.prototype.hasOwnProperty.call(newItem, 'name')) {
          newItem['name'] = "__('" + newItem['name'] + "')"
        }
        if (Object.prototype.hasOwnProperty.call(newItem, 'help')) {
          newItem['help'] = "__('" + newItem['help'] + "')"
        }
        if (Object.prototype.hasOwnProperty.call(newItem, 'help_suggest')) {
          newItem['help_suggest'] = "__('" + newItem['help_suggest'] + "')"
        }
        if (
          Object.prototype.hasOwnProperty.call(newItem, 'default_value') &&
          newItem.default_value === ''
        ) {
          delete newItem.default_value
        }

        if (
          Object.prototype.hasOwnProperty.call(newItem, 'span') &&
          newItem.span == 24
        ) {
          delete newItem.span
        }

        this.removeItemField(newItem)

        newColumns.push(newItem)
      })

      let data = 'export default ' + JSON.stringify(newColumns, null, 2)

      // 使用正则表达式进行替换
      var pattern = /"__(.*?)"/g
      data = data.replace(pattern, '__\$1')

      this.downloadJSONFile(data, 'create-column.js')
    },
    downloadJSONFile(data, filename) {
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(data)
      let link = document.createElement('a')
      link.href = uri
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.saveEntity()
          this.cancelMinForm()
          utils.success('数据源设置成功')
        } else {
          utils.error('请修复错误')
        }
      })
    },
    removeItemField(newItem) {
      if (Object.prototype.hasOwnProperty.call(newItem, 'initSearchName')) {
        delete newItem.initSearchName
      }

      if (Object.prototype.hasOwnProperty.call(newItem, 'nameExtend')) {
        delete newItem.nameExtend
      }
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    },
    cancelMinForm: function () {
      this.minForm = false
    },
    viewButton() {
      utils.success('viewButton')
    },
    saveEntity() {
      setCache('ui-list-data', this.formValidate)

      let entity_value =
        (this.formValidate.entity_app
          ? this.formValidate.entity_app + ':'
          : '') + this.formValidate.entity
      this.searchApi = entity_value
      this.searchPlanSourceType = this.formValidate.source_type

      this.apiGet(entity_value + '/struct').then((res) => {
        let searchColumn = []
        searchColumn.push({
          key: 'key',
          name: '',
          download_name: '',
          type: 'input_search',
          width: 2,
        })

        let columns = [
          {
            title: __('选项'),
            type: 'selection',
            key: 'framework_selection',
            width: 55,
            align: 'center',
            fixed: 'left',
          },
          {
            title: __('序号'),
            type: 'index',
            key: 'framework_index',
            width: 80,
            align: 'center',
            fixed: 'left',
            show: false,
          },
        ]

        let forms = []

        let ignoreKey = [
          'id',
          'platform_id',
          'company_id',
          'update_at',
          'delete_at',
          'create_account',
          'update_account',
          'version',
          'create_account_name',
          'update_account_name',
        ]
        Object.keys(res).forEach((key) => {
          if (ignoreKey.includes(key)) {
            return
          }

          let columnItem = {}
          let formItem = {}
          if (res[key].column_struct) {
            let columnTemp = {
              title: res[key].column_name,
              width: 200,
              key: key,
            }

            if (res[key].meta && res[key].meta.search_key_column) {
              const keySearchColumn = searchColumn.find(
                (obj) => obj.key === 'key',
              )
              if (keySearchColumn) {
                keySearchColumn['download_name'] +=
                  "__('" + res[key].column_name + "')+'/'+"
                keySearchColumn['name'] += res[key].column_name + '/'
              }
              columnTemp['fixed'] = 'left'
            }

            switch (res[key].column_struct.type) {
              case 'int':
              case 'tinyint':
              case 'smallint':
              case 'mediumint':
              case 'bigint':
              case 'boolean':
              case 'float':
              case 'double':
              case 'decimal':
              case 'char':
              case 'varchar':
                if (res[key].enum_class) {
                  columnTemp.title = res[key].column_name
                  columnTemp.key = key + '_enum'
                  columnTemp['db_column'] = key

                  let columnItem = {
                    key: key,
                    name: res[key].column_name,
                    type: 'select_multiple',
                    search: 'in',
                    meta: {
                      url: entity_value + '/enum/' + key,
                      key: 'value',
                      value: 'msg',
                      expire: 86400 * 7,
                    },
                  }
                  this.prepareEnumData(res[key].enum_description, columnItem)
                  searchColumn.push(columnItem)

                  let formItem = {
                    key: key,
                    name: res[key].column_name,
                    type: 'select',
                    span: 12,
                    meta: {
                      url: entity_value + '/enum/' + key,
                      key: 'value',
                      value: 'msg',
                      expire: 86400 * 7,
                    },
                    help: res[key].column_comment,
                    default_value: res[key].column_struct.default,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  }
                  this.prepareEnumData(res[key].enum_description, formItem)
                  forms.push(formItem)
                } else if (
                  res[key].column_struct.type == 'char' ||
                  res[key].column_struct.type == 'varchar'
                ) {
                  formItem = {
                    key: key,
                    name: res[key].column_name,
                    type: 'input',
                    span: 12,
                    help: res[key].column_comment,
                    default_value: res[key].column_struct.default,
                    rules: [
                      {
                        required: true,
                        trigger: 'blur',
                      },
                    ],
                  }
                  forms.push(formItem)

                  columnItem = {
                    key: key,
                    name: res[key].column_name,
                    type: 'input',
                    search: 'like',
                  }
                  searchColumn.push(columnItem)
                } else {
                  columnItem = {
                    key: key + '_min',
                    name: res[key].column_name,
                    type: 'input_number',
                    search: 'min',
                    meta: {
                      min: 0,
                    },
                  }
                  searchColumn.push(columnItem)

                  columnItem = {
                    key: key + '_max',
                    name: res[key].column_name,
                    type: 'input_number',
                    search: 'max',
                    meta: {
                      min: 0,
                    },
                  }
                  searchColumn.push(columnItem)

                  formItem = {
                    key: key,
                    name: res[key].column_name,
                    type: 'input_number',
                    meta: {
                      min: 0,
                    },
                    span: 12,
                    help: res[key].column_comment,
                    default_value: res[key].column_struct.default,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  }
                  forms.push(formItem)
                }
                break
              case 'datetime':
                columnItem = {
                  key: key + '_min',
                  name: res[key].column_name,
                  type: 'datetime_range',
                  width: 2,
                  search: 'min',
                }
                searchColumn.push(columnItem)

                columnItem = {
                  key: key + '_max',
                  width: 0,
                  search: 'max',
                }
                searchColumn.push(columnItem)

                if (key != 'create_at') {
                  formItem = {
                    key: key,
                    name: res[key].column_name,
                    type: 'datetime_range',
                    span: 12,
                    help: res[key].column_comment,
                    default_value: res[key].column_struct.default,
                    rules: [
                      {
                        required: true,
                        trigger: 'blur',
                      },
                    ],
                  }
                  forms.push(formItem)
                }
                break
              default:
                columnItem = {
                  key: key,
                  name: res[key].column_name,
                  type: 'input',
                  search: 'like',
                }
                searchColumn.push(columnItem)

                formItem = {
                  key: key,
                  name: res[key].column_name,
                  type: 'input',
                  span: 12,
                  help: res[key].column_comment,
                  default_value: res[key].column_struct.default,
                  rules: [
                    {
                      required: true,
                      trigger: 'blur',
                    },
                  ],
                }
                forms.push(formItem)
                break
            }

            columns.push(columnTemp)
          }
        })

        const keySearchColumn = searchColumn.find((obj) => obj.key === 'key')
        if (keySearchColumn) {
          keySearchColumn['download_name'] = keySearchColumn[
            'download_name'
          ].slice(0, -5)
          keySearchColumn['name'] = keySearchColumn['name'].slice(0, -1)
        }

        columns.push({
          title: __('操作'),
          key: 'framework_action',
          slot: 'action',
          width: 75,
          fixed: 'right',
          align: 'left',
          render: (h, params) => {
            return (
              <div>
                <buttonGroup size="small" shape="circle">
                  <i-button
                    type="text"
                    onClick={() => this.viewButton()}
                    v-show={utils.permission('demo_view_button')}
                  >
                    {__('查看')}
                  </i-button>
                </buttonGroup>
              </div>
            )
          },
        })

        this.searchColumn = searchColumn
        this.columns = columns
        this.forms = forms
        this.$refs.curdIndex.initColumns(this.columns)
      })
    },
    prepareEnumData(enumDescription, currentObj) {
      if (
        enumDescription.length === 2 &&
        enumDescription['0']['name'] == 'YES' &&
        enumDescription['1']['name'] == 'NO'
      ) {
        currentObj.meta = {
          data_type: 'yes_no',
        }
        currentObj.type = 'select'
      } else {
        //currentObj.meta.data = enumDescription
      }
    },
  },
  mounted() {
    let uiListData = getCache('ui-list-data')
    if (null !== uiListData) {
      this.formValidate = uiListData
    }

    this.saveEntity()
  },
}
</script>
