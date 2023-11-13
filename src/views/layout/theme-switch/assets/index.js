export default {
  name: 'themeSwitch',
  data() {
    return {
      themeSelect: false,
      modalLoading: false,
      themeList: [
        {
          name: 'black_blue',
          title: __('青蓝冰水') + '.' + __('暗黑模式'),
          menu: '#fff',
          element: '#2d8cf0',
          placement: 'top',
        },
        {
          name: 'black_green',
          title: __('千山一碧') + '.' + __('暗黑模式'),
          menu: '#fff',
          element: '#33b976',
          placement: 'top',
        },
        {
          name: 'black_yellow',
          title: __('灿若云霞') + '.' + __('暗黑模式'),
          menu: '#fff',
          element: 'rgba(230, 155, 3, 1)',
          placement: 'top',
        },
        {
          name: 'black_red',
          title: __('红尘有你') + '.' + __('暗黑模式'),
          menu: '#fff',
          element: 'rgba(186, 40, 53, 1)',
          placement: 'top',
        },
        {
          name: 'light_blue',
          title: __('青蓝冰水') + '.' + __('白天模式'),
          menu: '#2d8cf0',
          element: '#fff',
          placement: 'bottom',
        },
        {
          name: 'light_green',
          title: __('千山一碧') + '.' + __('白天模式'),
          menu: '#33b976',
          element: '#fff',
          placement: 'bottom',
        },
        {
          name: 'light_yellow',
          title: __('灿若云霞') + '.' + __('白天模式'),
          menu: 'rgba(230, 155, 3, 1)',
          element: '#fff',
          placement: 'bottom',
        },
        {
          name: 'light_red',
          title: __('红尘有你') + '.' + __('白天模式'),
          menu: 'rgba(186, 40, 53, 1)',
          element: '#fff',
          placement: 'bottom',
        },
        {
          name: 'black_jirablue',
          title: __('JIRA 经典蓝') + '.' + __('暗黑模式'),
          menu: '#fff',
          element: '#205081',
          placement: 'top',
        },
        {
          name: 'black_cyan',
          title: __('青春绽放') + '.' + __('暗黑模式'),
          menu: '#fff',
          element: '#10a082',
          placement: 'top',
        },
        {
          name: 'black_vip',
          title: __('VIP 尊贵') + '.' + __('暗黑模式'),
          menu: '#fff',
          element: '#fbd54e',
          placement: 'top',
        },
        {
          name: 'black_github',
          title: __('Github 经典') + '.' + __('暗黑模式'),
          menu: '#fff',
          element: '#24292e',
          placement: 'top',
        },
        {
          name: 'light_jirablue',
          title: __('JIRA 经典蓝') + '.' + __('白天模式'),
          menu: '#205081',
          element: '#fff',
          placement: 'bottom',
        },
        {
          name: 'light_cyan',
          title: __('青春绽放') + '.' + __('白天模式'),
          menu: '#10a082',
          element: '#fff',
          placement: 'bottom',
        },
        {
          name: 'light_vip',
          title: __('VIP 尊贵') + '.' + __('白天模式'),
          menu: '#fbd54e',
          element: '#fff',
          placement: 'bottom',
        },
        {
          name: 'light_github',
          title: __('Github 经典') + '.' + __('白天模式'),
          menu: '#24292e',
          element: '#fff',
          placement: 'bottom',
        },
      ],
    }
  },
  methods: {
    handleSelect() {
      this.themeSelect = true
    },
    setTheme(themeFile) {
      // 暗黑模式去掉主题设置
      if (this.$store.state.app.darkMode) {
        utils.warning(__('暗黑模式不支持切换主题'))
        return
      }

      let theme = themeFile.split('_')
      let menuTheme = theme[0]
      let mainTheme = theme[1]
      if (menuTheme === 'black') {
        this.$store.commit('changeMenuTheme', 'dark')
        menuTheme = 'dark'
      } else {
        this.$store.commit('changeMenuTheme', 'light')
        menuTheme = 'light'
      }

      if (localStorage.theme) {
        let theme = JSON.parse(localStorage.theme)
        theme.mainTheme = mainTheme
        theme.menuTheme = menuTheme
        localStorage.theme = JSON.stringify(theme)
      } else {
        localStorage.theme = JSON.stringify({
          mainTheme: mainTheme,
          menuTheme: menuTheme,
        })
      }

      let path = '/theme/' + mainTheme + '.css'
      let menuPath = '/theme/' + mainTheme + '_' + menuTheme + '.css'

      document.querySelector('link[name="theme"]').setAttribute('href', path)
      document
        .querySelector('link[name="menuTheme"]')
        .setAttribute('href', menuPath)

      this.themeSelect = false

      utils.success(__('主题切换成功'))
    },
  },
  created() {
    // 暗黑模式去掉主题设置
    if (this.$store.state.app.darkMode) {
      return
    }

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
    let stylesheetPath = stylePath + this.$store.state.app.themeColor + '.css'
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
  },
}
