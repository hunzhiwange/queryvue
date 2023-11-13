import search from '@/utils/search'

const resetForm = {
  key: '',
  status: '',
  type: '',
  page: 1,
  page_size: 99999,
}

export default {
  data() {
    return {
      resetForm: resetForm,
      searchRule: {},
      searchItem: {
        status: [
          { value: '1', title: this.__('启用') },
          { value: '0', title: this.__('禁用') },
        ],
      },
      searchApi: 'project',
    }
  },
  methods: {
    searchExtend(data) {
      let projectIds = []
      data.data.forEach((item) => {
        projectIds.push(item.id)
      })
      if (!projectIds.length) {
        return
      }

      this.apiGet('app:project/project', {
        type: 'favor',
        project_ids: projectIds,
        page: 1,
        page_size: this.searchForm.size,
      }).then((res) => {
        this.$emit('getProjectFavorDataFromSearch', res)
      })
    },
  },
  mixins: [search],
}
