<template>
  <Select
    v-model="warehouse_selected"
    filterable
    multiple
    :placeholder="placeholder"
    @on-change="updateData"
  >
    <Option
      v-for="(option, index) in list"
      :value="option.warehouse_no"
      :key="index"
    >
      {{ option.warehouse_name }}
    </Option>
  </Select>
</template>

<style lang="less" scoped></style>

<script>
export default {
  name: 'Warehouse',
  props: {
    warehouseNo: {
      type: String,
    },
    placeholder: {
      type: String,
      default: __('请选择仓库22'),
    },
  },
  data() {
    return {
      list: [],
    }
  },
  methods: {
    init() {
      // this.apiGet('apiQL/stock:warehouse/list-only', {
      //   column: 'warehouse_name,warehouse_no',
      // }).then((res) => {
      //   this.list = res.data
      // })
    },
    updateData(res) {
      this.$emit('updateData', res)
    },
  },
  computed: {
    warehouse_selected: {
      get() {
        return this.warehouseNo ? this.warehouseNo.split(',') : ''
      },
    },
  },
  mounted() {
    this.init()
  },
}
</script>
