<template>
  <Text type="secondary">{{ __('加载中') }}</Text>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    let redirect = { name: 'dashboard' }
    if (route.query.hasOwnProperty('redirect')) {
      redirect = JSON.parse(route.query.redirect)
    }

    const router = useRouter()
    router.push(redirect)
  },
}
</script>
