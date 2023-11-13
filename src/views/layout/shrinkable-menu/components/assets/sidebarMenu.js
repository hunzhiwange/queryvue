export default {
  name: 'sidebarMenu',
  props: {
    shrink: {
      type: Boolean,
      default: true,
    },
    menuList: Array,
    iconSize: Number,
    menuTheme: {
      type: String,
      default: 'light',
    },
    sidebarTheme: {
      type: String,
      default: 'light',
    },
    openNames: {
      type: Array,
    },
  },
  methods: {
    changeMenu(active) {
      this.$emit('on-change', active)
    },
    itemTitle(item) {
      if (item.meta) {
        return this.__(item.meta.title)
      }
      return ''
    },
  },
  computed: {
    currentTheme() {
      return this.menuTheme == 'dark' || this.sidebarTheme == 'dark'
        ? 'dark'
        : 'light'
    },
  },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened()
      }
    })
  },
}
