export default {
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
        return __(item.meta.title)
      }
      return ''
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
  updated() {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened()
      }
    })
  },
}
