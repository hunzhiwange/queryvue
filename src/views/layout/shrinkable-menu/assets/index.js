import sidebarMenu from './../components/sidebar-menu.vue'
import sidebarMenuShrink from './../components/sidebar-menu-shrink.vue'

export default {
  name: 'shrinkableMenu',
  components: {
    sidebarMenu,
    sidebarMenuShrink,
  },
  props: {
    shrink: {
      type: Boolean,
      default: false,
    },
    tmpShrink: {
      type: Boolean,
      default: false,
    },
    menuList: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      default: 'light',
      validator(val) {
        return utils.oneOf(val, ['dark', 'light'])
      },
    },
    sidebarTheme: {
      type: String,
      default: 'light',
      validator(val) {
        return utils.oneOf(val, ['dark', 'light'])
      },
    },
    beforePush: {
      type: Function,
    },
    openNames: {
      type: Array,
    },
  },
  computed: {
    shrinkIconColor() {
      return this.theme === 'dark' ? '#000' : '#495060'
    },
  },
  methods: {
    handleChange(name) {
      let willpush = true
      if (this.beforePush !== undefined) {
        if (!this.beforePush(name)) {
          willpush = false
        }
      }
      if (willpush) {
        this.$router.push({
          name: name,
        })
      }
      this.$emit('on-change', name)
    },
    setTmpShrink(type) {
      if (this.shrink) {
        utils.once(() => {
          this.$emit('toggleClickTemp', type)
        })
      }
    },
  },
}
