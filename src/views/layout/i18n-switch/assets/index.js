export default {
  name: 'i18nSwitch',
  data() {
    return {
      i18n: 'zh-CN',
      i18nSelect: false,
      modalLoading: false,
      i18nList: [
        {
          name: 'zh-CN',
          title: '中文简体',
        },
        {
          name: 'en-US',
          title: 'English',
        },
      ],
    }
  },
  methods: {
    handleSelect() {
      this.i18nSelect = true
    },
    setIi8n() {
      localStorage.lang = this.i18n
      this.$i18n.locale = this.i18n
      this.$store.commit('switchLang', this.i18n)
      this.i18nSelect = false
      this.$forceUpdate()
      utils.success(__('切换语言成功'))
    },
  },
  created() {
    this.i18n = localStorage.lang || 'zh-CN'
  },
}
