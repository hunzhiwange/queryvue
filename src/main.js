import { createApp, h } from 'vue'
import ViewUIPlus from 'view-ui-plus'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import 'tailwindcss/tailwind.css'
import './assets/css/global.css'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import '../public/theme/app.css'
import extend from './utils/extend'
import utils from './utils'
import { appRouter } from './router/router'
import i18n from '@/i18n'
import http from '@/utils/http'
import { getCache, setCache } from '@/utils/cache'
import globalMixin from './utils/global-mixin'

window.utils = utils
window.store = store

let serverConfigUrl = window.localStorage.getItem('server.config.url')
if (!serverConfigUrl) {
  serverConfigUrl = '/server.config.json'
  window.localStorage.setItem('server.config.url', serverConfigUrl)
}

let serverConfigEnv = window.localStorage.getItem('server.config.env')
if (!serverConfigEnv) {
  serverConfigEnv = import.meta.env.MODE
  window.localStorage.setItem('server.config.env', serverConfigEnv)
}

const makeApp = () => {
  const app = createApp({
    render: () => h(App),
    mounted() {
      this.currentPageName = this.$route.name
      // 显示打开的页面的列表
      this.$store.commit('setOpenedList')
      this.$store.commit('initCachePage')
      // 权限菜单过滤相关
      this.$store.commit('updateMenulist')
      this.$store.commit('initMenuShrink')
      this.$store.commit('initDarkMode')
      this.$store.commit('initHeaderMenu')
      this.$store.commit('initSidebarMenu')
      this.$store.commit('initPageSize')
    },
    created() {
      const tagsList = []
      appRouter.map((item) => {
        if (item.children.length <= 1) {
          tagsList.push(item.children[0])
        } else {
          tagsList.push(...item.children)
        }
      })
      this.$store.commit('setTagsList', tagsList)
    },
  })

  app.mixin(http)
  app.mixin(globalMixin)

  app.config.globalProperties.$axios = axios // 配置axios的全局引用
  app.config.globalProperties.utils = utils

  app
    .use(i18n)
    .use(ViewUIPlus, {
      i18n,
    })
    .use(extend)
    .use(router)
    .use(store)
    .mount('#app')

  router.app = app

  // 将应用实例对象传递给全局的 provide 注入点
  app.provide('app', app)
}

const cacheServerConfig = getCache('server.config')
if (!cacheServerConfig) {
  axios.get(serverConfigUrl).then((e) => {
    if (!e.data[serverConfigEnv]) {
      throw new Error('Server config env not exists.')
    }

    setCache('server.config', e.data[serverConfigEnv], 3600 * 24)
    makeApp()
  })
} else {
  makeApp()
}
