import { validateAlphaDash } from '@/utils/validate'
import search from '../../project-issue/search/index'
import projectTemplate from './template'
//see https://github.com/SortableJS/Vue.Draggable
import draggable from 'vuedraggable'
import board_header from './../board_header'

const resetForm = {
  name: '',
  num: '',
  status: 1,
  template: [],
}

const resetFormCommonUser = {
  selectUser: [],
}

const resetUserForm = {
  key: '',
  project_id: null,
  page: 1,
  page_size: 30,
}

const projectTypeIcon = {
  bug: {
    icon: 'ios-bug',
    color: 'red',
  },
  task: {
    icon: 'ios-list-box-outline',
    color: 'blue',
  },
  product: {
    icon: 'md-map',
    color: 'green',
  },
  story: {
    icon: 'md-mail-open',
    color: 'purple',
  },
  doc: {
    icon: 'ios-document-outline',
    color: 'red',
  },
  process: {
    icon: 'ios-document-outline',
    color: 'red',
  },
  mind: {
    icon: 'ios-document-outline',
    color: 'red',
  },
  swagger: {
    icon: 'ios-document-outline',
    color: 'red',
  },
  swagger_url: {
    icon: 'ios-document-outline',
    color: 'red',
  },
  mind_map: {
    icon: 'ios-document-outline',
    color: 'red',
  },
}

const resetFormUser = {}

export default {
  components: {
    search,
    draggable,
    board_header,
  },
  data() {
    return {
      projects: [],
      project: {
        id: 0,
        num: '',
        name: this.__('请选择项目'),
      },
      releaseData: {
        total: 0,
        data: [],
      },
      page: 1,
    }
  },
  methods: {
    init: function (num) {
      this.apiGet('app:project/project/show', { num: num }).then((res) => {
        this.project = res
        document.title =
          '[' +
          this.project.num +
          ']' +
          this.project.name +
          ' - ' +
          document.title
        this.searchRelease()
      })
      this.apiGet('project:project_release/enum/completed').then((res) => {
        this.projectReleaseCompleted = res
      })
    },
    searchRelease() {
      this.apiGet('app:project/project-release', {
        status: 1,
        page: this.page,
        page_size: this.$store.state.app.pageSize,
        project_ids: [this.project.id],
      }).then((data) => {
        this.releaseData.data = data.data
        this.releaseData.total = data.page.total_record
      })
    },
    updateCompleted(releaseId, completedStatus, currentStatus) {
      if (currentStatus) {
        return
      }

      let formData = {
        completed: completedStatus,
      }

      this.apiPut(
        'app:project/project-release',
        releaseId + '/completed',
        formData,
      ).then(
        (res) => {
          this.refresh()
        },
        () => {},
      )
    },
    refresh() {
      this.init(this.$route.params.num)
    },
    getStatus(completed) {
      let status = ''
      switch (completed) {
        case 1:
          status = 'default'
          break
        case 2:
          status = 'blue'
          break
        case 3:
          status = 'red'
          break
        case 4:
          status = 'success'
          break
      }

      return status
    },
  },
  mounted: function () {
    this.refresh()
  },
  mixins: [],
}
