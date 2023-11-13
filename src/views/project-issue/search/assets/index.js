import search from '@/utils/search'

const resetForm = {
  key: '',
  status: '',
  type: '',
  project_ids: [],
  page: 1,
  page_size: 99999,
}

export default {
  props: {
    projectIds: {
      type: Array,
      required: true,
    },
  },
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
      searchApi: 'app:project/project-issue',
      treeOption: {},
    }
  },
  methods: {
    searchBaseExtend(page, pageSize, searchForm) {
      this.searchForm.project_ids = this.projectIds
    },
  },
  mixins: [search],
}
