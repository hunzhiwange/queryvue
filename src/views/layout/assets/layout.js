import { commonRouter } from './../../../router/router'
import { QuickScore } from 'quick-score'

// 组件
import shrinkableMenu from '@/views/layout/shrinkable-menu/index'
import tagsPageOpened from '@/views/layout/tags-page-opened/index'
// import breadcrumbNav from '@/views/layout/breadcrumb-nav/index'
import fullScreen from '@/views/layout/fullscreen/index'
import lockScreen from '@/views/layout/lockscreen/index'
import messageTip from '@/views/layout/message-tip/index'
import themeSwitch from '@/views/layout/theme-switch/index'
import i18nSwitch from '@/views/layout/i18n-switch/index'
import changePassword from '@/views/layout/user/change-password'
import information from '@/views/layout/user/information'

// 图片
import img_logo from '@/assets/images/logo_light.png'
import img_logo_main from '@/assets/images/logo.svg'
import img_mini_logo from '@/assets/images/logo_96x96_light.png'
import avator from '@/assets/images/avator.png'

import { getCache, setCache, deleteCache } from '@/utils/cache'
import { cloneDeep } from 'lodash'
import router from '@/router'

function getMenuDataAll() {
  let commonRouterName = []
  commonRouter.forEach((item) => {
    commonRouterName.push(item.name)
  })
  let menuDataAll = []
  router.getRoutes().forEach((item) => {
    //return !commonRouterName.includes(item.name) && !item.children.length;
    // 如果只需要保留最后一级，也可以这样做
    if (
      !commonRouterName.includes(item.name) &&
      item.components &&
      !item.children.length &&
      item.path.indexOf('/:') === -1
    ) {
      menuDataAll.push({
        title: item.meta.title,
        path: item.path.substring(1),
        name: item.name,
      })
    }
  })
  return menuDataAll
}

var menuDataAll = getMenuDataAll()

export default {
  setup() {},
  components: {
    shrinkableMenu,
    tagsPageOpened,
    // breadcrumbNav,
    fullScreen,
    lockScreen,
    messageTip,
    themeSwitch,
    i18nSwitch,
    changePassword,
    information,
  },
  data() {
    return {
      menuSearchKey: '',
      menuData: [],
      menuDataAll: [],
      pageOpenedDashboard: this.$store.state.app.pageOpenedDashboard,
      tabList: [
        {
          label: '标签一',
          name: 'name1',
        },
        {
          label: '标签二',
          name: 'name2',
        },
        {
          label: '标签三',
          name: 'name3',
        },
        {
          label: '标签四',
          name: 'name4',
        },
        {
          label: '标签五',
          name: 'name5',
        },
      ],
      cityList: [
        {
          value: 'New York',
          label: 'New York',
        },
        {
          value: 'London',
          label: 'London',
        },
        {
          value: 'Sydney',
          label: 'Sydney',
        },
        {
          value: 'Ottawa',
          label: 'Ottawa',
        },
        {
          value: 'Paris',
          label: 'Paris',
        },
        {
          value: 'Canberra',
          label: 'Canberra',
        },
      ],
      model: '',
      model1: [],
      uiSetting: false,
      value2: true,
      single: false,
      links: [
        {
          key: '帮助',
          title: '帮助',
          href: 'https://www.queryphp.com',
          blankTarget: true,
        },
        {
          key: 'github',
          icon: 'logo-github',
          href: 'https://github.com/hunzhiwange/queryphp',
          blankTarget: true,
        },
        {
          key: '条款',
          title: '条款',
          href: 'https://github.com/hunzhiwange/queryphp',
          blankTarget: true,
        },
      ],
      copyright: '©2022 QueryPHP.com',
      columns2: [
        {
          title: 'Name',
          key: 'name',
        },
        {
          title: 'Age',
          key: 'age',
        },
        {
          title: 'Address',
          key: 'address',
        },
      ],
      data2: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03',
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01',
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02',
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04',
        },
      ],
      img_logo: img_logo,
      img_logo_main: img_logo_main,
      img_mini_logo: img_mini_logo,
      //shrink: false,
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
      dialogVisible: false,
      avator: avator,
      tmpShrink: true,
      menuDataVisible: false,
    }
  },
  computed: {
    menuList() {
      let menuList = this.$store.state.app.menuList
      menuList.forEach((item) => {
        item.permission = utils.permission(item.name + '_menu')
        let firstLevelChildrenHasPermission = false
        item.children.forEach((v) => {
          v.permission = utils.permission(v.name + '_menu')
          let seccondLevelChildrenHasPermission = true
          if (v.children) {
            seccondLevelChildrenHasPermission = false
            v.children.forEach((v) => {
              v.permission = utils.permission(v.name + '_menu')

              // 判断是否存在有权限的直接子节点
              if (v.permission) {
                seccondLevelChildrenHasPermission = true
              }
            })
          }

          // 直接子节点无权限，父节点将不会有权限
          if (v.permission && seccondLevelChildrenHasPermission) {
            v.permission = true
          } else {
            v.permission = false
          }

          // 判断是否存在有权限的直接子节点
          if (v.permission) {
            firstLevelChildrenHasPermission = true
          }
        })

        // 直接子节点无权限，父节点将不会有权限
        if (item.permission && firstLevelChildrenHasPermission) {
          item.permission = true
        } else {
          item.permission = false
        }
      })

      return menuList
    },
    pageTagsList() {
      if (localStorage.pageOpenedList) {
        this.$store.state.app.pageOpenedList = JSON.parse(
          localStorage.pageOpenedList,
        )
      }

      return this.$store.state.app.pageOpenedList // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath // 当前面包屑数组
    },
    avatorPath() {
      return this.avator
    },
    cachePage() {
      return this.$store.state.app.cachePage
    },
    lang() {
      return this.$store.state.app.lang
    },
    shrink() {
      return this.$store.state.app.shrink
    },
    darkMode() {
      return this.$store.state.app.darkMode
    },
    headerMenu() {
      return this.$store.state.app.headerMenu
    },
    sidebarMenu() {
      return this.$store.state.app.sidebarMenu
    },
    menuTheme() {
      return this.$store.state.app.menuTheme
    },
    mesCount() {
      return this.$store.state.app.messageCount
    },
    username() {
      return this.$store.state.user.users.name
    },
  },
  methods: {
    // filterMenuMethod (value, option) {
    //     return true;
    //     //return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    // },
    handleSearch() {
      if (!this.menuSearchKey) {
        this.menuData = []
        return
      }

      const qs = new QuickScore(menuDataAll, ['title', 'path'])
      const results = qs.search(this.menuSearchKey)
      let menuData = []
      results.forEach((item) => {
        item.item.matchPath = item.item.path
        item.item.matchTitle = item.item.title
        if (item.matches['path']) {
          item.item.matchPath = this.highLightSearch(
            item.item.matchPath,
            item.matches['path'],
          )
        }
        if (item.matches['title']) {
          item.item.matchTitle = this.highLightSearch(
            item.item.matchTitle,
            item.matches['title'],
          )
        }
        menuData.push(item.item)
      })
      this.menuData = menuData
    },
    highLightSearch(string, matches) {
      const substrings = []
      let previousEnd = 0

      for (let [start, end] of matches) {
        const prefix = string.substring(previousEnd, start)
        const match =
          '<span class="ivu-typography"><mark>' +
          string.substring(start, end) +
          '</mark></span>'
        substrings.push(prefix, match)
        previousEnd = end
      }

      substrings.push(string.substring(previousEnd))

      return '<span>' + substrings.join('') + '</span>'
    },
    selectMenu(value) {
      this.menuDataVisible = false
      this.$router.push({ name: value })
    },
    linkTo(item) {
      let routerObj = {}
      routerObj.name = item.name
      if (item.argu) {
        routerObj.params = item.argu
      }
      if (item.query) {
        routerObj.query = item.query
      }
      if (this.beforePush(item)) {
        this.$router.push(routerObj)
      }
    },
    init() {
      // 消息
      let messageCount = 3
      this.messageCount = messageCount.toString()
      this.$store.commit('setMessageCount', 3)

      // 初始化菜单
      this.$store.commit('setCurrentPageName', this.$route.name)
      utils.setCurrentPath(this, this.$route.name)
      this.routeToOpen(this.$route)
      this.checkTag(this.$route.name)
      localStorage.currentPageName = this.$route.name

      // 刷新后台自动刷新权限
      this.refreshPermission()

      // 刷新用户信息
      setTimeout(() => {
        this.userInfo()
      }, 3000)
    },
    // 刷新权限，防止需要重新登录才刷新权限
    refreshPermission() {
      let permissionCache = getCache('user_permission')
      if (permissionCache) {
        this.$store.dispatch('setRules', permissionCache)
        return
      }

      let apiToken = this.$store.state.user.token
      this.apiGet('app:user/user/permission', {
        refresh: '1',
        token: apiToken,
      }).then((res) => {
        this.$store.dispatch('setRules', res)
        setCache('user_permission', res, 3600 * 24)
      })
    },
    userInfo() {
      let userInfoCache = getCache('user_info')
      if (userInfoCache) {
        this.$store.dispatch('setUsers', userInfoCache)
        return
      }

      let apiToken = this.$store.state.user.token
      this.apiGet('app:user/user/info', { token: apiToken }).then((res) => {
        this.$store.dispatch('setUsers', res)
        setCache('user_info', res, 3600 * 24)
      })
    },
    toggleClick() {
      this.$store.commit('changeMenuShrink', !this.shrink)
    },
    toggleDarkModeClick() {
      this.$store.commit('changeDarkMode', !this.darkMode)
      this.initDarkMode()
    },
    toggleHeaderMenuClick(header) {
      this.$store.commit('changeHeaderMenu', header)
    },
    toggleSidebarMenuClick(sidebar) {
      this.$store.commit('changeSidebarMenu', sidebar)
    },
    toggleClickTemp(hello) {
      this.tmpShrink = !hello
    },
    logout() {
      this.$Modal.confirm({
        title: __('提示'),
        content: __('确认退出吗?'),
        onOk: () => {
          this.changePasswordLogout()
        },
        onCancel: () => {},
      })
    },
    changePasswordLogout() {
      let apiToken = this.$store.state.user.token
      let data = { token: apiToken }
      this.apiPost('app:auth/login/logout', data).then(() => {
        this.$store.dispatch('logout')
        deleteCache('user_permission')
        deleteCache('user_info')
        setTimeout(() => {
          router.replace('/login')
        }, 1000)
      })
    },
    changePassword() {
      this.$refs.changePassword.open()
    },
    information() {
      this.$refs.information.open()
    },
    handleClickUserDropdown(name) {
      switch (name) {
        case 'logout':
          this.logout()
          break
        case 'changePassword':
          this.changePassword()
          break
        case 'information':
          this.information()
          break
      }
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some((item) => {
        if (item.name === name) {
          return true
        }
      })

      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        utils.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {},
        )
      }
    },
    handleSubmenuChange() {},
    beforePush() {
      return true
    },
    fullscreenChange() {},
    routeToOpen(to) {
      this.$store.commit('clearOpenedSubmenu')

      let matched = cloneDeep(to.matched)
      let current = matched.pop()
      matched.forEach((v) => {
        this.$store.commit('addOpenSubmenu', v.name)
      })
      this.$store.commit(
        'addOpenSubmenu',
        current.meta.parentName ? current.meta.parentName : current.name,
      )
    },
    handleDragDrop(name, newName, a, b, names) {
      // names 为调整后的 name 集合
      this.tabList.splice(b, 1, ...this.tabList.splice(a, 1, this.tabList[b]))
    },
    handleTabRemove(name) {},
    initDarkMode() {
      //这个条件用于判断当前系统应用模式是否开启了“暗”模式（win10在   个性化-颜色-选择默认应用模式  中修改）
      // if (localStorage.themes === 'dark' || (!('themes' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      if (this.$store.state.app.darkMode) {
        document.documentElement.classList.add('dark')
        // 暗黑模式去掉主题自定义
        document.querySelector('link[name="theme"]').setAttribute('href', '')
        document
          .querySelector('link[name="menuTheme"]')
          .setAttribute('href', '')
      } else {
        document.documentElement.classList.remove('dark')
        // 暗黑模式恢复主题自定义
        // 代码提取到方法
        let stylePath = '/theme/'
        if (localStorage.theme) {
          let theme = JSON.parse(localStorage.theme)
          this.$store.commit('changeMenuTheme', theme.menuTheme)
          this.$store.commit('changeMainTheme', theme.mainTheme)
        } else {
          this.$store.commit('changeMenuTheme', 'light')
          this.$store.commit('changeMainTheme', 'blue')
        }
        // 根据用户设置主题
        let stylesheetPath =
          stylePath + this.$store.state.app.themeColor + '.css'
        document
          .querySelector('link[name="theme"]')
          .setAttribute('href', stylesheetPath)

        let stylesheetMenuPath =
          stylePath +
          this.$store.state.app.themeColor +
          '_' +
          this.$store.state.app.menuTheme +
          '.css'
        document
          .querySelector('link[name="menuTheme"]')
          .setAttribute('href', stylesheetMenuPath)
      }
    },
  },
  watch: {
    $route(to) {
      this.$store.commit('setCurrentPageName', to.name)
      utils.setCurrentPath(this, to.name)
      this.routeToOpen(to)
      this.checkTag(to.name)
      localStorage.currentPageName = to.name
    },
    lang() {
      utils.setCurrentPath(this, this.$route.name) // 在切换语言时用于刷新面包屑
    },
  },
  mounted() {
    this.init()
    this.initDarkMode()
  },
  created() {
    this.$store.dispatch('loginStorage')
  },
  mixins: [],
}
