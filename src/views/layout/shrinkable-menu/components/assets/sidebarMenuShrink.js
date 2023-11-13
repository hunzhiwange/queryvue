export default {
  name: 'sidebarMenuShrink',
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
        return this.__(item.meta.title)
      }
      return ''
    },
  },
}
