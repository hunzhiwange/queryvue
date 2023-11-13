import { cloneDeep } from 'lodash'
import { appRouter } from '../../router/router'

const app = {
  state: {
    cachePage: [],
    lang: 'zh-CN',
    isFullScreen: false,
    openedSubmenuArr: [], // 要展开的菜单数组
    menuTheme: 'light', // 主题
    themeColor: '',
    shrink: false,
    darkMode: false,
    headerMenu: 'primary', // primary 主色, dark 暗色 light 亮色
    sidebarMenu: 'light', // dark 暗色 light 亮色
    pageSize: 30, // 分页数量
    pageOpenedDashboard: {
      meta: {
        title: __('首页'),
      },
      path: '/dashboard',
      name: 'dashboard',
    },
    pageOpenedList: [],
    currentPageName: '',
    currentPath: [
      {
        meta: {
          title: __('首页'),
        },
        icon: 'ios-home-outline',
        path: '/dashboard',
        name: 'dashboard',
      },
    ], // 面包屑数组
    menuList: [],
    routers: [...appRouter],
    tagsList: [],
    messageCount: 0,
    dontCache: ['text-editor', 'artical-publish'], // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
  },
  mutations: {
    setTagsList(state, list) {
      state.tagsList.push(...list)
    },
    updateMenulist(state) {
      //   let accessCode = parseInt(Cookies.get('access'))
      const menuList = []

      if (!appRouter) {
        return
      }

      appRouter.forEach((item, index) => {
        if (item.children.length === 1) {
          menuList.push(item)
        } else {
          const len = menuList.push(item)
          let childrenArr = []
          childrenArr = item.children.filter((child) => child)
          const handledItem = cloneDeep(menuList[len - 1])
          handledItem.children = childrenArr
          menuList.splice(len - 1, 1, handledItem)
        }
      })
      state.menuList = menuList
    },
    initMenuShrink(state) {
      // 菜单折叠
      const menuShrink = localStorage.getItem('menu_shrink')
      if (menuShrink !== null) {
        state.shrink = menuShrink === 'true'
      }
    },
    initDarkMode(state) {
      const dark_mode = localStorage.getItem('dark_mode')
      if (dark_mode !== null) {
        state.darkMode = dark_mode === 'true'
      }
    },
    initHeaderMenu(state) {
      const headerMenu = localStorage.getItem('header_menu')
      if (
        headerMenu !== null
        && ['primary', 'dark', 'light'].includes(headerMenu)
      ) {
        state.headerMenu = headerMenu
      }
    },
    initSidebarMenu(state) {
      const sidebarMenu = localStorage.getItem('sidebar_menu')
      if (sidebarMenu !== null && ['dark', 'light'].includes(sidebarMenu)) {
        state.sidebarMenu = sidebarMenu
      }
    },
    initPageSize(state) {
      let pageSize = localStorage.getItem('page_size')
      if (pageSize !== null) {
        pageSize = parseInt(pageSize)
        pageSize = pageSize || 30
        state.pageSize = pageSize
      }
    },
    changeMenuTheme(state, theme) {
      state.menuTheme = theme
    },
    changeMainTheme(state, mainTheme) {
      state.themeColor = mainTheme
    },
    changeMenuShrink(state, shrink) {
      state.shrink = shrink
      localStorage.setItem('menu_shrink', shrink)
    },
    changeDarkMode(state, mode) {
      state.darkMode = mode
      localStorage.setItem('dark_mode', mode)
    },
    changeHeaderMenu(state, mode) {
      if (['primary', 'dark', 'light'].includes(mode)) {
        state.headerMenu = mode
        localStorage.setItem('header_menu', mode)
      }
    },
    changeSidebarMenu(state, mode) {
      if (['dark', 'light'].includes(mode)) {
        state.sidebarMenu = mode
        localStorage.setItem('sidebar_menu', mode)
      }
    },
    changePageSize(state, pageSize) {
      if (pageSize) {
        pageSize = parseInt(pageSize)
        pageSize = pageSize || 30
        state.pageSize = pageSize
        localStorage.setItem('page_size', pageSize)
      }
    },
    addOpenSubmenu(state, name) {
      let hasThisName = false
      let isEmpty = false
      if (name.length === 0) {
        isEmpty = true
      }
      if (state.openedSubmenuArr.includes(name)) {
        hasThisName = true
      }
      if (!hasThisName && !isEmpty) {
        state.openedSubmenuArr.push(name)
      }
    },
    closePage(state, name) {
      state.cachePage.forEach((item, index) => {
        if (item === name) {
          state.cachePage.splice(index, 1)
        }
      })
    },
    initCachePage(state) {
      if (localStorage.cachePage) {
        state.cachePage = JSON.parse(localStorage.cachePage)
      }
    },
    removeTag(state, name) {
      state.pageOpenedList.map((item, index) => {
        if (item.name === name) {
          state.pageOpenedList.splice(index, 1)
        }
      })
    },
    pageOpenedList(state, get) {
      const openedPage = state.pageOpenedList[get.index]
      if (get.argu) {
        openedPage.argu = get.argu
      }
      if (get.query) {
        openedPage.query = get.query
      }

      if (get.index != 0) {
        state.pageOpenedList.unshift(
          state.pageOpenedList.splice(get.index, 1)[0],
        )
      }

      if (state.pageOpenedList.length > 9) {
        state.pageOpenedList.pop()
      }

      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    },
    clearAllTags(state, vm) {
      state.pageOpenedList = []
      state.cachePage.length = 0
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
      vm.$router.push({ name: 'dashboard' })
    },
    clearOtherTags(state, vm) {
      const currentName = vm.$route.name
      let currentIndex = -1

      state.pageOpenedList.forEach((item, index) => {
        if (item.name === currentName) {
          currentIndex = index
        }
      })

      if (currentIndex === -1) {
        state.pageOpenedList.splice(0)
      } else {
        state.pageOpenedList.splice(currentIndex + 1)
        state.pageOpenedList.splice(0, currentIndex)
      }
      const newCachepage = state.cachePage.filter(
        (item) => item === currentName,
      )

      state.cachePage = newCachepage
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    },
    clearCurrentTag(state, vm) {
      const currentName = vm.$route.name
      let currentIndex = 0

      state.pageOpenedList.forEach((item, index) => {
        if (item.name === currentName) {
          currentIndex = index
        }
      })

      state.pageOpenedList.splice(currentIndex, 1)
      const newCachepage = state.cachePage.filter(
        (item) => item !== currentName,
      )
      state.cachePage = newCachepage
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)

      vm.$router.push({
        name:
          state.pageOpenedList.length > 0
            ? state.pageOpenedList[0].name
            : 'dashboard',
      })
    },
    clearRightsTag(state, vm) {
      const currentName = vm.$route.name
      let currentIndex = 0
      let find = false
      const rightName = []

      state.pageOpenedList.forEach((item, index) => {
        if (item.name === currentName) {
          currentIndex = index
          find = true
        }
        if (find === true) {
          rightName.push(item.name)
        }
      })

      rightName.shift()
      if (rightName.length == 0) {
        return
      }

      state.pageOpenedList.splice(currentIndex + 1)
      const newCachepage = state.cachePage.filter(
        (item) => !rightName.includes(item),
      )
      state.cachePage = newCachepage
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    },
    clearLeftsTag(state, vm) {
      const currentName = vm.$route.name
      let currentIndex = 0
      let find = false
      const leftName = []

      state.pageOpenedList.forEach((item, index) => {
        if (item.name === currentName) {
          currentIndex = index
          find = true
        }
        if (find === false) {
          leftName.push(item.name)
        }
      })

      if (leftName.length == 0) {
        return
      }

      state.pageOpenedList.splice(0, currentIndex)
      const newCachepage = state.cachePage.filter(
        (item) => !leftName.includes(item),
      )
      state.cachePage = newCachepage
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    },

    /**
     * 拖动后排序保存
     *
     * @param  {object} state
     * @param  {array} newTags
     * @return void
     */
    dragTags(state, newTags) {
      state.pageOpenedList = newTags
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    },

    setOpenedList(state) {
      state.pageOpenedList = localStorage.pageOpenedList
        ? JSON.parse(localStorage.pageOpenedList)
        : []
    },
    setCurrentPath(state, pathArr) {
      state.currentPath = pathArr
    },
    setCurrentPageName(state, name) {
      state.currentPageName = name
    },
    setAvator(state, path) {
      localStorage.avatorImgPath = path
    },
    switchLang(state, lang) {
      state.lang = lang
    },
    clearOpenedSubmenu(state) {
      state.openedSubmenuArr.length = 0
    },
    setMessageCount(state, count) {
      state.messageCount = count
    },
    /**
     * 创建一个标签
     *
     * @param  {object} state
     * @param  {object} tagObj
     * @return {void}
     */
    increateTag(state, tagObj) {
      // 刷新和首页被记入标签中直接跳过
      if (['refresh', 'dashboard', 'black-page'].includes(tagObj.name)) {
        return
      }

      if (!utils.oneOf(tagObj.name, state.dontCache)) {
        state.cachePage.push(tagObj.name)
        localStorage.cachePage = JSON.stringify(state.cachePage)
      }

      state.pageOpenedList.unshift(tagObj)

      if (state.pageOpenedList.length > 9) {
        state.pageOpenedList.pop()
      }

      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    },
  },
  actions: {},
}

export default app
