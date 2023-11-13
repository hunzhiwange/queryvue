<template>
  <Cascader
    v-model="selectedCity"
    :data="cityData"
    filterable
    :placeholder="__('请选择地区')"
    @on-change="onCityChange"
  ></Cascader>
</template>

<script>
import { computed } from 'vue'
import citySourceData from './city-data'

export default {
  setup(props, context) {
    // 深度优先搜索函数
    function findNodeDFS(nodes, targetValue, path = []) {
      for (const node of nodes) {
        const currentPath = [...path, node.value]

        if (node.value == targetValue) {
          return currentPath
        }

        if (node.children && node.children.length > 0) {
          const result = findNodeDFS(node.children, targetValue, currentPath)
          if (result !== null) {
            return result
          }
        }
      }

      return null
    }

    const buildTree = function (data, parentId) {
      const tree = []

      for (let i = 0; i < data.length; i++) {
        if (data[i][1] == parentId) {
          const node = {
            value: data[i][0],
            label: data[i][2],
            children: buildTree(data, data[i][0]),
          }

          tree.push(node)
        }
      }

      return tree
    }

    const cityData = buildTree(citySourceData, '0')

    const selectedCity = computed(() => {
      if (!props.currentValue) {
        return []
      }

      const targetPath = findNodeDFS(cityData, props.currentValue)
      if (targetPath) {
        return targetPath
      }

      return []
    })

    function onCityChange(value) {
      context.emit('updateData', value, props.currentField)
    }

    return {
      selectedCity,
      cityData,
      onCityChange,
    }
  },
  name: 'SearchSelect',
  props: {
    currentField: {
      type: String,
    },
    currentValue: {},
    placeholder: {
      type: String,
      default: __('请选择项目'),
    },
    isMultiple: {
      type: Boolean,
      default: true,
    },
    apiSource: {
      type: Object,
      default: {},
    },
  },
}
</script>
