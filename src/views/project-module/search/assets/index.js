import search from '@/utils/search'

const resetForm = {
  key: '',
  status: '',
  page: 1,
  page_size: 30,
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
      searchApi: 'project-module',
    }
  },
  mixins: [search],
}
