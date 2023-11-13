const page = {
  data() {
    return {
      total: 0,
      page: 1,
      data: [],
      dataExtend: {},
      loadingTable: true,
      column_set: false,
    }
  },
  methods: {
    searchList() {
      this.loadingTable = true
      if (
        (!Object.prototype.hasOwnProperty.call(this, 'minDialog')
          || !this.minDialog.minDialog)
        && Object.keys(this.$route.query).length > 0
      ) {
        // 搜索项需要初始化字段数据后才能获取到，这里通过 setTimeout 跳转一下执行顺序，
        // 避免搜索项还未初始化完成就执行搜索
        this.$nextTick(() => {
          this.$refs.search.search(0, 0, this.$route.query, true)
        })
      } else if (
        (!Object.prototype.hasOwnProperty.call(this, 'minDialog')
          || !this.minDialog.minDialog)
        && this.$store.state.page.listPageParams.has(this.$route.name)
      ) {
        this.$nextTick(() => {
          this.$refs.search.search(
            0,
            0,
            this.$store.state.page.listPageParams.get(this.$route.name),
            true,
          )
        })
      } else {
        this.$nextTick(() => {
          this.$refs.search.search()
        })
      }
    },
    getDataFromSearch(data) {
      this.loadingTable = false
      this.data = data.data
      this.page = data.page.current_page
      this.total = data.page.total_record
      this.loadingTable = false
      this.changeValueSelected()
    },
    changePage(page) {
      this.page = page
      this.$refs.search.search(page)
    },
    changePageSize(pageSize) {
      this.$store.commit('changePageSize', pageSize)
      this.$refs.search.search(this.page, pageSize)
    },
    refresh() {
      this.searchList()
    },
  },
}

export default page
