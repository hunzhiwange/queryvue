<template>
  <Menu mode="horizontal" theme="light" active-name="1">
    <MenuItem
      v-for="(menuList, index) in menuLeft"
      :key="index"
      :name="index"
      :to="menuList.path"
    >
      <Icon :type="menuList.icon" />
      {{ menuList.title }}
    </MenuItem>
  </Menu>

  <Card
    :dis-hover="true"
    :shadow="false"
    class="m-t-15"
    v-for="(importList, index) in batchImportList"
    :key="index"
  >
    <template #title>{{ importList.title }}</template>
    <div style="text-align: center">
      <ButtonGroup size="large" shape="circle">
        <Button
          :icon="importList.button.icon"
          type="primary"
          @click="this.importPath(importList.button.path)"
        >
          {{ importList.button.title }}
        </Button>
      </ButtonGroup>
      <div
        class="bg-gray-100 px-6 py-3 text-gray-400 text-center font-extrabold rounded-full mt-5 dark:bg-gray-headerbg"
      >
        {{ importList.description }}
      </div>
    </div>
  </Card>
</template>
<script>
export default {
  data() {
    return {
      doc: {
        title: '',
        type: '',
        description: '',
      },
      menuLeft: [],
      batchImportList: [],
    }
  },
  methods: {
    importPath(pathUrl) {
      this.$router.push({ path: pathUrl })
    },
    prepareDoc(doc) {
      this.menuLeft.push({
        title: doc.title + __('列表'),
        icon: 'md-list',
        path: `/${doc.type}`,
      })

      this.batchImportList.push({
        title: __('批量导入') + doc.title,
        button: {
          icon: 'md-add-circle',
          title: __('批量新增'),
          path: `/${doc.type}-batch-import-create`,
        },
        description: doc.description,
      })
    },
  },
  beforeMount() {
    this.prepareDoc(this.doc)
  },
}
</script>
