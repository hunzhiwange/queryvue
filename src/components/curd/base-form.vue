<template>
  <FormContainer
    ref="formContainer"
    :columns="columns"
    :formData="data"
    :menuLeft="menuLeft"
    :menuRight="menuRight"
    :pageType="pageType"
    :layoutData="layoutData"
    :formOptions="formOptions"
    @handleSubmit="handleSubmit"
  />
</template>

<script>
import { cloneDeep } from 'lodash'
import FormContainer from '../form/form-container'
import utils from '../../utils'
import relation from '../../utils/relation'

export default {
  components: {
    FormContainer,
  },
  data() {
    return {
      pageType: 'create',
      menuLeft: [],
      menuRight: [],
      service: {
        entity: '',
        path: '',
      },
      data: {},
      formOptions: {
        form: {
          displayOnly: false,
          labelPosition: 'top',
        },
      },
      layoutData: [
        {
          span: 24,
          minWith: 1100,
          subgroups: [
            {
              span: 24,
              id: 'default',
              tag: 'card',
            },
          ],
        },
      ],
      editSpecialColumns: [],
      appendSpecialColumns: [],
      editPrimaryKey: {
        type: Array,
        default: ['id'],
      },
      editApiExtends: {},
    }
  },
  methods: {
    handleSubmit(formData, toList) {
      // 避免影响表单原始值
      formData = cloneDeep(formData)

      const actionMethod = `handleSubmit${utils.ucFirst(this.pageType)}`
      if (actionMethod in this) {
        const actionMethodBefore = `handleSubmit${utils.ucFirst(
          this.pageType,
        )}Before`
        if (actionMethodBefore in this) {
          const beforeColumn = Object.keys(formData)
          this[actionMethodBefore](formData)
          const appendColumn = Object.keys(formData).filter(
            (item) => !beforeColumn.includes(item),
          )
          this.appendSpecialColumns = this.appendSpecialColumns.concat(appendColumn)
        }
        this[actionMethod](formData, toList)
      } else {
        utils.error(__('提交方法（%s）不存在', actionMethod))
      }
    },
    prepareNewFormData(formData) {
      const columnKeys = this.getColumnKeys()
      const newFormData = {}
      columnKeys.forEach((field) => {
        newFormData[field] = formData[field]
      })

      this.columns.forEach((item) => {
        if (item.transform && item.transform.to && newFormData[item.key]) {
          newFormData[item.key] = item.transform.to(
            newFormData[item.key],
            this.data,
            newFormData,
          )
        }
      })

      return newFormData
    },
    handleSubmitCreate(formData, toList) {
      this.handleSubmitCreateBase(formData, toList)
    },
    handleSubmitEdit(formData, toList) {
      this.handleSubmitEditBase(formData, toList)
    },
    handleSubmitCreateBase(formData, toList, method) {
      const newFormData = this.prepareNewFormData(formData)
      this.apiPost(
        `${this.service.entity}${method ? `/${method}` : ''}`,
        newFormData,
      ).then(() => {
        if (toList) {
          this.$router.push(this.service.path)
        } else {
          this.$refs.formContainer.handleReset()
        }
      })
    },
    handleSubmitEditBase(formData, toList, method) {
      const newFormData = this.prepareNewFormData(formData)
      this.apiPut(
        this.service.entity,
        this.$route.params.id + (method ? `/${method}` : ''),
        newFormData,
      ).then((res) => {
        if (toList) {
          this.$router.push(this.service.path)
        }
      })
    },
    editTemplate() {
      if (!this.columns) {
        return [[], {}, []]
      }

      const dbColumns = []
      if (this.editPrimaryKey.length > 0) {
        this.editPrimaryKey.forEach((item) => {
          dbColumns.push({
            field: item,
          })
        })
      }

      const specialColumns = this.editSpecialColumns
      const fieldMap = {}
      const multiFields = []
      this.columns.forEach((item) => {
        if (!specialColumns.includes(item.key)) {
          if (Object.prototype.hasOwnProperty.call(item, 'db_column')) {
            if (
              item.db_column !== false
              && !dbColumns.includes(item.db_column)
            ) {
              if (item.db_column.indexOf(',') > 0) {
                item.db_column.split(',').forEach((dbColumn) => {
                  if (!fieldMap[dbColumn]) {
                    fieldMap[dbColumn] = []
                  }
                  fieldMap[dbColumn].push(item.key)
                })
                multiFields.push(item.key)
              } else {
                if (!fieldMap[item.db_column]) {
                  fieldMap[item.db_column] = []
                }
                fieldMap[item.db_column].push(item.key)
              }
              dbColumns.push({
                field: item.db_column,
              })
            }
          } else if (!dbColumns.includes(item.key)) {
            dbColumns.push({
              field: item.key,
            })
            if (!fieldMap[item.key]) {
              fieldMap[item.key] = []
            }
            fieldMap[item.key].push(item.key)
          }

          // 虚拟字段
          if (
            Object.prototype.hasOwnProperty.call(item, 'meta')
            && Object.prototype.hasOwnProperty.call(item.meta, 'virtualColumn')
          ) {
            const { virtualColumn } = item.meta
            if (
              virtualColumn !== false
              && !Object.prototype.hasOwnProperty.call(fieldMap, virtualColumn)
            ) {
              if (virtualColumn.indexOf(',') > 0) {
                virtualColumn.split(',').forEach((columnValue) => {
                  if (!fieldMap[columnValue]) {
                    fieldMap[columnValue] = []
                  }
                  fieldMap[columnValue].push(columnValue)
                })
              } else {
                if (!fieldMap[virtualColumn]) {
                  fieldMap[virtualColumn] = []
                }
                fieldMap[virtualColumn].push(virtualColumn)
              }
            }
          }
        }
      })

      return [dbColumns, fieldMap, multiFields]
    },
    getColumnKeys() {
      if (!this.columns) {
        return this.appendSpecialColumns
      }

      const keys = []
      const specialColumns = this.editSpecialColumns
      this.columns.forEach((item) => {
        if (!specialColumns.includes(item.key) && !item.displayOnly) {
          if (Object.prototype.hasOwnProperty.call(item, 'db_column')) {
            if (item.db_column !== false && !keys.includes(item.db_column)) {
              keys.push(item.key)
            }
          } else if (!keys.includes(item.key)) {
            keys.push(item.key)
          }
        }
      })

      this.appendSpecialColumns.forEach((item) => {
        keys.push(item)
      })

      return keys
    },
    async getEditDbData(editTemplate) {
      return await relation(
        {
          api: `${this.service.entity}/list-only`,
          params: {
            id: this.$route.params.id,
          },
        },
        this.editApiExtends,
        editTemplate,
        [],
        true,
      )
    },
    async getEditData() {
      const template = this.editTemplate()
      const editTemplate = template[0]
      const fieldDbMap = template[1]
      const multiFields = template[2]
      const fieldKeys = []
      editTemplate.forEach((item) => {
        fieldKeys.push(item.field)
      })

      const resultData = await this.getEditDbData(editTemplate)
      if (!resultData.data[0]) {
        utils.errorNotFound()
        return
      }

      let data = resultData.data[0]
      if (Object.keys(fieldDbMap).length > 0) {
        const newData = {}
        Object.keys(data).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(fieldDbMap, key)) {
            const itemKeys = fieldDbMap[key]
            itemKeys.forEach((itemKey) => {
              if (multiFields.includes(itemKey)) {
                if (!Object.prototype.hasOwnProperty.call(newData, itemKey)) {
                  newData[itemKey] = {}
                }
                newData[itemKey][key] = data[key]
              } else {
                newData[itemKey] = data[key]
              }
            })
          }
        })

        data = newData
      }

      this.columns.forEach((item) => {
        if (item.transform && item.transform.from && data[item.key]) {
          data[item.key] = item.transform.from(data[item.key], data)
        }
      })

      this.data = data
    },
  },
  mounted() {
    if (this.pageType == 'edit' || this.pageType == 'detail') {
      this.getEditData()
    }
  },
  beforeMount() {
    if (this.pageType == 'detail') {
      this.formOptions.form.displayOnly = true
    }
  },
}
</script>
