export default {
  props: {
    menuList: {
      type: Array,
    },
    iconColor: {
      type: String,
      default: 'white',
    },
    menuTheme: {
      type: String,
      default: 'light',
    },
    sidebarTheme: {
      type: String,
      default: 'light',
    },
  },
  computed: {
    currentOpenNames() {
      let currentOpenNames = []
      this.$store.state.app.openedSubmenuArr.forEach((item) => {
        currentOpenNames.push(item)
      })

      return currentOpenNames
    },
    currentTheme() {
      return this.menuTheme == 'dark' || this.sidebarTheme == 'dark'
        ? 'dark'
        : 'light'
    },
  },
  methods: {
    changeMenu(active, parentName) {
      document.querySelector(
        '#menu_poptip_' + parentName + ' .ivu-poptip-popper',
      ).style.display = 'none'
      this.$emit('on-change', active)
    },
    itemTitle(item) {
      if (item.meta) {
        return __(item.meta.title)
      }
      return ''
    },
  },
}
