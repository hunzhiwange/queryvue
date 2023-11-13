<template>
  <Menu mode="horizontal" theme="light" :active-name="currentActiveName">
    <Row>
      <Col span="18">
        <Submenu name="project">
          <template #title>
            <Icon type="md-git-branch" />
            {{ project.name }}
          </template>
          <MenuItem
            :to="'/board/' + item.num"
            v-for="item in projects"
            :key="item.id"
            :name="'project-' + item.id"
          >
            {{ item.name }}
          </MenuItem>
        </Submenu>
        <MenuItem
          v-if="issueNum != ''"
          name="issue"
          :to="'/issue/' + issueNum"
        >
          <Icon type="ios-document" />
          {{ issueNum }}
        </MenuItem>
        <MenuItem name="index" :to="'/board/' + project.num">
          <Icon type="md-list-box" />
          任务
        </MenuItem>
        <MenuItem
          name="attachement"
          :to="'/board/' + project.num + '/attachement'"
        >
          <Icon type="md-document" />
          文件
        </MenuItem>
        <MenuItem name="overview" :to="'/board/' + project.num + '/overview'">
          <Icon type="md-globe" />
          概览
        </MenuItem>
        <MenuItem name="release" :to="'/board/' + project.num + '/release'">
          <Icon type="ios-happy" />
          版本
        </MenuItem>
      </Col>
      <Col span="6">
        <div class="pull-right">
          <MenuItem name="11">
            <Icon type="md-search" />
            筛选
          </MenuItem>
          <MenuItem name="22">
            <Icon type="ios-people" />
            用户
          </MenuItem>
          <MenuItem name="33">
            <Icon type="ios-construct" />
            菜单
          </MenuItem>
        </div>
      </Col>
    </Row>
  </Menu>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      currentActiveName: '',
      projects: [],
    }
  },
  props: {
    project: {},
    activeName: {
      type: String,
      default: '',
    },
    issueNum: {
      type: String,
      default: '',
    },
  },
  methods: {
    init(num, id) {
      this.apiGet('app:project/project', { status: 1 }).then((res) => {
        this.projects = res.data
      })
      setTimeout(() => {
        this.currentActiveName = this.issueNum != '' ? 'issue' : this.activeName
      }, 1000)
    },
  },
  mounted() {
    this.init()
  },
  mixins: [],
}
</script>
