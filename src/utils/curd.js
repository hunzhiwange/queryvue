const curd = {
  props: {
    service: {
      type: Object,
      default: {
        app: '',
        entity: '',
        name: '',
      },
    },
  },
  data() {
    return {
      formItem: {},
      minForm: false,
      loadingTable: false,
      serviceApi: '',
      serviceName: '',
      selectedData: [],
      selectedFullData: [],
      loading: false,
      currentRowData: {},
      valueSelected: [],
      selectedRadio: '',
    }
  },
  methods: {
    edit(params) {
      this.minForm = true
      this.formItem.id = params.row.id
      Object.keys(this.formItem).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(params.row, key)) {
          this.formItem[key] = params.row[key]
        }
      })
    },
    add(currentProjectId) {
      this.minForm = true
      this.formItem.id = ''
      this.reset()
      if (currentProjectId) {
        this.formItem.project_id = parseInt(currentProjectId)
      }
    },
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    cancelMinForm(form) {
      this.minForm = false
      this.handleReset(form)
    },
    reset() {
      this.formItem = this.resetForm
    },
    remove(params) {
      this.$Modal.confirm({
        content: __('确认删除该%s?', this.service.name),
        onOk: () => {
          this.apiDelete(this.service.entity, params.row.id).then(() => {
            this.data.splice(params.index, 1)
          })
        },
      })
    },
    delete(params) {
      this.$Modal.confirm({
        content: __('确认删除该%s?', this.service.name),
        onOk: () => {
          this.apiDelete(this.service.entity, params.id).then(() => {
            if (!this.tree.tree) {
              const index = this.data.findIndex((item) => item.id === params.id)
              this.data.splice(index, 1)
            } else {
              this.refresh()
            }
          })
        },
      })
    },
    statusMany(statusValue, selectedData) {
      const data = {
        ids: selectedData,
        status: statusValue,
      }

      this.apiPost(`${this.service.app_api}/status`, data).then((res) => {
        this.refresh()
      })
    },
    onSelectionChange(data) {
      const ids = []
      const selectedFullData = []
      data.forEach((item) => {
        ids.push(item.id)
        selectedFullData.push(item)
      })
      this.selectedData = ids
      this.selectedFullData = selectedFullData
    },
    getRadioSelected() {
      return this.data.find((item) => item.id == this.selectedRadio)
    },
    clearSelectedData() {
      this.$refs.table.selectAll(false)
    },
    clearRadioSelectedData() {
      this.selectedRadio = ''
    },
    initValueSelected(valueSelected) {
      if (!this.minDialog.minDialog) {
        return
      }

      this.valueSelected = valueSelected
      this.changeValueSelected()
    },
    changeValueSelected() {
      if (!this.minDialog.minDialog) {
        return
      }

      this.data.forEach((item) => {
        item._checked = this.valueSelected.includes(item.id)
        item._disabled = item._checked
      })
    },
    onColumnWidthResize(newWidth, oldWidth, column, event) {
      this.columns.forEach((item) => {
        if (item.key === column.key) {
          item.width = newWidth
        }
      })
    },
    handleSubmit(form) {
      this.$refs[form].validate((pass) => {
        if (pass) {
          this.loading = !this.loading
          if (!this.formItem.id) {
            this.saveData(form)
          } else {
            this.updateData(form)
          }
        }
      })
    },
    saveData(form) {
      const formData = this.formItem
      this.beforeSaveData(formData)
      this.apiPost(this.serviceApi, formData).then(
        (res) => {
          // let addNode = Object.assign({}, this.formItem, res)
          // this.data.unshift(addNode)
          this.refresh()
          this.loading = !this.loading
          this.cancelMinForm(form)
        },
        () => {
          this.loading = !this.loading
        },
      )
    },
    beforeSaveData(formData) {},
    updateData(form) {
      const formData = this.formItem
      this.apiPut(this.serviceApi, this.formItem.id, formData).then(
        (res) => {
          // this.data.forEach((item, index) => {
          //   if (item.id === this.formItem.id) {
          //     this.data[index] = res
          //   }
          // })
          this.refresh()
          this.loading = !this.loading
          this.cancelMinForm(form)
        },
        () => {
          this.loading = !this.loading
        },
      )
    },
    handleContextMenu(row, index) {
      this.$emit('handleContextMenu', row, index)
    },
    handleContextMenuAction(action, row, index) {
      this.$emit('handleContextMenuAction', action, row, index)
    },
    handleBatchActions(action) {
      if (!this.selectedData.length) {
        utils.warning(__('请勾选数据'))
        return
      }

      this.$emit('handleBatchActions', action, this.selectedData)
    },
  },
  mounted() {
    this.reset()
  },
}

export default curd
