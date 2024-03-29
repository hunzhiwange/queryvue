export default {
  name: 'message',
  data() {
    const markAsreadBtn = (h, params) => {
      return (
        <div>
          <buttonGroup size="small" shape="circle">
            <i-button
              type="primary"
              onClick={() => {
                this.hasreadMesList.unshift(
                  this.currentMesList.splice(params.index, 1)[0],
                )
                this.$store.commit('setMessageCount', this.unreadMesList.length)
              }}
            >
              {__('标为已读')}
            </i-button>
          </buttonGroup>
        </div>
      )
    }
    const deleteMesBtn = (h, params) => {
      return (
        <div>
          <buttonGroup size="small" shape="circle">
            <i-button
              type="error"
              onClick={() => {
                this.recyclebinList.unshift(
                  this.hasreadMesList.splice(params.index, 1)[0],
                )
              }}
            >
              {__('删除')}
            </i-button>
          </buttonGroup>
        </div>
      )
    }
    const restoreBtn = (h, params) => {
      return (
        <div>
          <buttonGroup size="small" shape="circle">
            <i-button
              type="success"
              onClick={() => {
                this.recyclebinList.unshift(
                  this.hasreadMesList.splice(params.index, 1)[0],
                )
              }}
            >
              {__('还原')}
            </i-button>
          </buttonGroup>
        </div>
      )
    }
    return {
      currentMesList: [],
      unreadMesList: [],
      hasreadMesList: [],
      recyclebinList: [],
      currentMessageType: 'unread',
      showMesTitleList: true,
      unreadCount: 0,
      hasreadCount: 0,
      recyclebinCount: 0,
      noDataText: __('暂无未读消息'),
      mes: {
        title: '',
        time: '',
        content: '',
      },
      mesTitleColumns: [
        // {
        //     type: 'selection',
        //     width: 50,
        //     align: 'center'
        // },
        {
          title: ' ',
          key: 'title',
          align: 'left',
          ellipsis: true,
          render: (h, params) => {
            return (
              <a
                onClick={() => {
                  this.showMesTitleList = false
                  this.mes.title = params.row.title
                  this.mes.time = this.formatDate(params.row.time)
                  this.getContent(params.index)
                }}
              >
                {params.row.title}
              </a>
            )
          },
        },
        {
          title: ' ',
          key: 'time',
          align: 'center',
          width: 180,
          render: (h, params) => {
            return h('span', [
              h('Icon', {
                props: {
                  type: 'android-time',
                  size: 12,
                },
                style: {
                  margin: '0 5px',
                },
              }),
              h(
                'span',
                {
                  props: {
                    type: 'android-time',
                    size: 12,
                  },
                },
                this.formatDate(params.row.time),
              ),
            ])
          },
        },
        {
          title: ' ',
          key: 'asread',
          align: 'center',
          width: 100,
          render: (h, params) => {
            if (this.currentMessageType === 'unread') {
              return h('div', [markAsreadBtn(h, params)])
            } else if (this.currentMessageType === 'hasread') {
              return h('div', [deleteMesBtn(h, params)])
            } else {
              return h('div', [restoreBtn(h, params)])
            }
          },
        },
      ],
    }
  },
  methods: {
    formatDate(time) {
      let date = new Date(time)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      let minute = date.getMinutes()
      let second = date.getSeconds()
      return (
        year +
        '/' +
        month +
        '/' +
        day +
        '  ' +
        hour +
        ':' +
        minute +
        ':' +
        second
      )
    },
    backMesTitleList() {
      this.showMesTitleList = true
    },
    setCurrentMesType(type) {
      if (this.currentMessageType !== type) {
        this.showMesTitleList = true
      }
      this.currentMessageType = type
      if (type === 'unread') {
        this.noDataText = __('暂无未读消息')
        this.currentMesList = this.unreadMesList
      } else if (type === 'hasread') {
        this.noDataText = __('暂无已读消息')
        this.currentMesList = this.hasreadMesList
      } else {
        this.noDataText = __('回收站无消息')
        this.currentMesList = this.recyclebinList
      }
    },
    getContent(index) {
      // you can write ajax request here to get message content
      let mesContent = ''
      switch (this.currentMessageType + index) {
        case 'unread0':
          mesContent =
            '这是您点击的《欢迎登录 QueryVue 后台管理系统，来了解他的用途吧》的相关内容。'
          break
        case 'unread1':
          mesContent =
            '这是您点击的《使用 QueryVue 和 iView-ui 组件库快速搭建你的后台系统吧》的相关内容。'
          break
        case 'unread2':
          mesContent =
            '这是您点击的《喜欢 QueryVue 的话，欢迎到 Github 主页给个 star 吧》的相关内容。'
          break
        case 'hasread0':
          mesContent = '这是您点击的《这是一条您已经读过的消息》的相关内容。'
          break
        default:
          mesContent = '这是您点击的《这是一条被删除的消息》的相关内容。'
          break
      }
      this.mes.content = mesContent
    },
  },
  mounted() {
    this.currentMesList = this.unreadMesList = [
      {
        title: '欢迎登录 QueryVue 后台管理系统，来了解他的用途吧',
        time: 1507390106000,
      },
      {
        title: '使用 QueryVue 和 iView-ui 组件库快速搭建你的后台系统吧',
        time: 1507390106000,
      },
      {
        title: '喜欢 QueryVue 的话，欢迎到 Github 主页给个 star 吧',
        time: 1507390106000,
      },
    ]
    this.hasreadMesList = [
      {
        title: '这是一条您已经读过的消息',
        time: 1507330106000,
      },
    ]
    this.recyclebinList = [
      {
        title: '这是一条被删除的消息',
        time: 1506390106000,
      },
    ]
    this.unreadCount = this.unreadMesList.length
    this.hasreadCount = this.hasreadMesList.length
    this.recyclebinCount = this.recyclebinList.length
  },
  watch: {
    unreadMesList(arr) {
      this.unreadCount = arr.length
    },
    hasreadMesList(arr) {
      this.hasreadCount = arr.length
    },
    recyclebinList(arr) {
      this.recyclebinCount = arr.length
    },
  },
}
