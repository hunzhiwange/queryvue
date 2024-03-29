import { validateAlphaDash } from '@/utils/validate'
import { toRaw } from 'vue'

const resetForm = {
  id: null,
  pid: [-1],
  name: '',
  num: '',
  status: 1,
}

const resetFormResource = {}

export default {
  data() {
    return {
      formItem: Object.assign({}, resetForm),
      siblings: [],
      siblingsList: [],
      pidOptions: [],
      oldEditPid: [],
      pidDisabled: true,
      typeDisabled: true,
      currentParentData: null,
      minForm: false,
      rules: {
        name: [
          {
            required: true,
            message: this.__('请输入权限名字'),
          },
        ],
        num: [
          {
            required: true,
            message: this.__('请输入权限编号'),
          },
          {
            validator: validateAlphaDash,
          },
        ],
      },
      dataTree: [],
      loading: false,
      nodeRoot: [],
      loadingSynchrodata: false,
      synchrodataReplace: false,
      rightForm: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static',
      },
      formResource: resetFormResource,
      selectResource: [],
      loadingResource: false,
      resources: [],
      resourceTotal: 0,
      resourcePage: 1,
      resourcePermissionId: 0,
      viewDetail: {},
      resourceSearchKey: '',
    }
  },
  methods: {
    renderContent(h, { root, node, data }) {
      return (
        <span class="tree-item" style="display: inline-block; width: 100%;">
          <span class="tree-item-title">
            <Badge
              status={1 === data.status ? 'success' : 'default'}
              text={data.name}
            />
            <span class="m-l-10" style="color:#c5c8ce;">
              {data.num}
            </span>
          </span>
          <span class="tree-item-operate">
            <buttonGroup size="small" shape="circle">
              <i-button
                type="text"
                onClick={() => this.append(root, node, data)}
                v-show={utils.permission('permission_add_button')}
              >
                {this.__('新增')}
              </i-button>
              <i-button
                type="text"
                onClick={() => this.edit(root, node, data)}
                v-show={utils.permission('permission_edit_button')}
              >
                {this.__('编辑')}
              </i-button>
              <i-button
                type="text"
                onClick={() => this.resource(root, node, data)}
                v-show={utils.permission('permission_resource_button')}
              >
                {this.__('授权')}
              </i-button>
              <i-button
                type="text"
                onClick={() => this.remove(root, node, data)}
                v-show={
                  !(
                    (data.children && data.children.length > 0) ||
                    !utils.permission('permission_delete_button')
                  )
                }
              >
                {this.__('删除')}
              </i-button>
            </buttonGroup>
          </span>
        </span>
      )
    },
    edit(root, node, nodeData) {
      this.minForm = true
      this.currentParentData = nodeData
      this.formItem.id = nodeData.id
      this.nodeRoot = root
      let data = {}
      Object.keys(toRaw(this.formItem)).forEach((item) => {
        if (item == 'pid') {
          return
        }
        data[item] = nodeData[item]
      })
      this.formItem = data

      let pidOptions = this.getArraySelect(this.dataTree, true)
      pidOptions.unshift({ value: -1, label: this.__('根权限') })
      this.pidOptions = pidOptions
      let parentID = this.getParentID(root, nodeData).reverse()
      parentID.pop()
      if (parentID.length == 0) {
        parentID = [-1]
      }

      this.siblingsList = []
      this.siblings = []

      setTimeout(() => {
        this.pidDisabled = false
        this.oldEditPid = this.formItem.pid = parentID
      }, 0)
    },
    append(root, node, nodeData) {
      this.minForm = true
      this.currentParentData = nodeData
      this.formItem.id = ''
      this.pidDisabled = true

      // 父级菜单
      let pidOptions = this.getArraySelect(this.dataTree)
      pidOptions.unshift({ value: -1, label: __('根权限') })
      this.pidOptions = pidOptions
      let parentID = this.getParentID(root, nodeData).reverse()

      setTimeout(() => {
        this.formItem.pid = parentID
        this.siblingsList = []
        this.siblings = []
      })
    },
    getParentID(root, nodeData) {
      let result = [nodeData.id]

      const parentKey = root.find(
        (el) => el.nodeKey === nodeData.nodeKey,
      ).parent
      if (parentKey !== undefined) {
        const parent = root.find((el) => el.nodeKey === parentKey).node
        result = result.concat(this.getParentID(root, parent))
      }

      return result
    },
    add: function () {
      this.minForm = true
      this.currentParentData = null
      this.formItem.id = ''
      this.pidDisabled = true

      let pidOptions = this.getArraySelect(this.dataTree)
      pidOptions.unshift({ value: -1, label: this.__('根权限') })
      this.pidOptions = pidOptions
      setTimeout(() => {
        this.formItem.pid = [-1]
      })
    },
    resource(root, node, nodeData) {
      this.resourcePermissionId = nodeData.id
      this.viewDetail = nodeData

      this.apiGet('permission/' + nodeData.id).then((res) => {
        this.resources = res.resource
        this.resourceTotal = res.resource.length

        var selectResource = []
        res.resource.forEach((item) => {
          let temp = item.id + '``' + item.name + '|' + item.num
          selectResource.push(temp)
        })
        this.selectResource = selectResource
      })

      this.rightForm = true
    },
    remove(root, node, nodeData) {
      if (node.children && node.children.length > 0) {
        utils.error('权限包含子项，请先删除子项.')
        return
      }

      this.$Modal.confirm({
        title: this.__('提示'),
        content: this.__('确认删除该权限?'),
        onOk: () => {
          this.loading = !this.loading
          this.apiDelete('permission', nodeData.id).then(
            (res) => {
              this.init()
              this.loading = !this.loading
            },
            () => {
              this.loading = !this.loading
            },
          )
        },
        onCancel: () => {},
      })
    },
    status(nodeData, status) {
      this.loading = !this.loading
      this.apiPut('permission/enable/', nodeData.id, {
        status: status,
      }).then(
        (res) => {
          nodeData['status'] = status
          this.loading = !this.loading
        },
        () => {
          this.loading = !this.loading
        },
      )
    },
    statusMany(type) {
      let selected = this.$refs.tree.getCheckedNodes()
      if (!selected.length) {
        utils.warning(this.__('请勾选数据'))
        return
      }

      let selectedIds = []
      selected.forEach(({ id }) => selectedIds.push(id))

      let data = {
        ids: selectedIds,
        status: type,
      }

      this.loading = !this.loading
      this.apiPost('permission/enables', data).then(
        (res) => {
          selected.forEach((item, key) => {
            item['status'] = type
          })
          this.loading = !this.loading
        },
        () => {
          this.loading = !this.loading
        },
      )
    },
    top(root, node, nodeData) {
      this.order(root, node, nodeData, 'top')
    },
    up(root, node, nodeData) {
      this.order(root, node, nodeData, 'up')
    },
    down(root, node, nodeData) {
      this.order(root, node, nodeData, 'down')
    },
    order(root, node, nodeData, type) {
      var parentKey = root.find((el) => el === node).parent
      if (parentKey !== undefined) {
        var parent = root.find((el) => el.nodeKey === parentKey).node
        var index = parent.children.indexOf(nodeData)
      } else {
        const nowNode = this.dataTree.find((el) => el.nodeKey === node.nodeKey)
        var index = this.dataTree.indexOf(nowNode)
      }

      switch (type) {
        case 'up':
          if (index == 0) {
            return
          }
          break
        case 'down':
          if (index == this.dataTree.length - 1) {
            return
          }
          break
        case 'top':
          if (index == 0) {
            return
          }
          break
      }

      this.loading = !this.loading
      this.apiPut('permission/order/', nodeData.id, { type: type }).then(
        (res) => {
          if (parentKey !== undefined) {
            switch (type) {
              case 'up':
                parent.children = this.swapItems(
                  parent.children,
                  index,
                  index - 1,
                )
                break
              case 'down':
                parent.children = this.swapItems(
                  parent.children,
                  index,
                  index + 1,
                )
                break
              case 'top':
                parent.children = this.swapItems(parent.children, index, 0)
                break
            }
          } else {
            switch (type) {
              case 'up':
                this.dataTree = this.swapItems(this.dataTree, index, index - 1)
                break
              case 'down':
                this.dataTree = this.swapItems(this.dataTree, index, index + 1)
                break
              case 'top':
                this.dataTree = this.swapItems(this.dataTree, index, 0)
                break
            }
          }
          this.loading = !this.loading
        },
        () => {
          this.loading = !this.loading
        },
      )
    },
    swapItems: function (arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    init: function () {
      this.apiGet('permission').then((res) => {
        this.dataTree = res
      })
    },
    getArraySelect(data, isEdit) {
      let result = []

      data.forEach(({ id, name, children }) => {
        if (isEdit && id == this.formItem.id) {
          return
        }

        let item = {
          value: id,
          label: name,
        }
        if (children) {
          item.children = this.getArraySelect(children, isEdit)
        }
        result.push(item)
      })
      return result
    },
    handleSubmit(form) {
      this.$refs[form].validate((pass) => {
        if (pass) {
          this.loading = !this.loading
          if (!this.formItem.id) {
            this.savePermission(form)
          } else {
            this.updatePermission(form)
          }
        }
      })
    },
    savePermission(form) {
      let inputData = this.formItem
      inputData.pid = this.parsePid(inputData.pid)
      this.apiPost('permission', inputData).then(
        (res) => {
          this.init()
          this.loading = !this.loading
          this.cancelMinForm(form)
        },
        (res) => {
          this.loading = !this.loading
        },
      )
    },
    updatePermission(form) {
      let inputData = toRaw(this.formItem)
      inputData.pid = this.parsePid(inputData.pid)
      this.apiPut('permission', this.formItem.id, inputData).then(
        (res) => {
          this.init()
          this.loading = !this.loading
          this.cancelMinForm(form)
        },
        (res) => {
          this.loading = !this.loading
        },
      )
    },
    parsePid(pid) {
      pid = pid.pop()
      if (pid < 0) {
        pid = 0
      }

      return pid
    },
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    cancelMinForm: function (form) {
      this.minForm = false
      this.handleReset(form)
    },
    synchrodataPermission: function () {
      this.loadingSynchrodata = true
      let data = {
        replace: this.synchrodataReplace,
      }
      this.apiPost('permission/synchrodata', data).then(
        (res) => {
          this.loadingSynchrodata = false
        },
        (res) => {
          this.loadingSynchrodata = false
        },
      )
    },
    reset() {
      this.formItem = resetForm
    },
    changeResourcePage(page) {
      this.resourcePage = page

      this.searchResource(this.resourceSearchKey)
    },
    searchResource(query) {
      query = query.replace(/(^\s*)|(\s*$)/g, '')
      this.resourceSearchKey = query

      utils.once(() => {
        if (query !== '') {
          this.loadingResource = true

          this.apiGet('resource', {
            key: query,
            page_size: 9999,
            status: 1,
          }).then((res) => {
            this.loadingResource = false
            this.resources = res.data
          })
        } else {
          this.resources = []
        }
      }, 500)
    },
    changeResource() {},
    handleResourceSubmit(form) {
      this.loading = !this.loading

      var resourceId = []
      this.selectResource.forEach((item) => {
        let temp = item.split('``')
        resourceId.push(temp[0])
      })

      var formData = {
        id: this.resourcePermissionId,
        resource_id: resourceId,
      }

      this.apiPost('permission/resource', formData).then(
        (res) => {
          this.loading = !this.loading
          this.rightForm = false
        },
        (res) => {
          this.loading = !this.loading
        },
      )
    },
  },
  computed: {},
  mounted: function () {
    this.init()
  },
  mixins: [],
}
