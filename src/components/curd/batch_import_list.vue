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
  props: {
    menuLeft: {
      type: Array,
      default: [],
    },
    batchImportList: {
      type: Array,
      default: [],
    },
  },
  methods: {
    importPath(pathUrl) {
      this.$router.push({ path: pathUrl })
    },
  },
}
</script>
