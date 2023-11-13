<template>
  <router-view v-if="isRouterAlive" />
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload,
    }
  },
  data() {
    return {
      theme: this.$store.state.app.themeColor,
      isRouterAlive: true,
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false

      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
  },
}
</script>
