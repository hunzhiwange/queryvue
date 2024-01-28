import Cookies from 'js-cookie'
import moment from 'moment'
import img_logo from '@/assets/images/logo_box.png'
import login_banner1 from '@/assets/images/login_banner1.png'
import login_banner2 from '@/assets/images/login_banner2.png'
import login_banner3 from '@/assets/images/login_banner3.png'
import getServerConfig from '@/utils/server-config'

const serverConfig = await getServerConfig()

export default {
  data() {
    return {
      img_logo: img_logo,
      login_banner1: login_banner1,
      login_banner2: login_banner2,
      login_banner3: login_banner3,
      loading: false,
      form: {
        name: '',
        nameBackup: '',
        password: '',
        code: '',
      },
      codeUrl: '',
      codeImg: serverConfig.APP_BASE_API + '/app:auth/apiQL/v1:login/code',
      rules: {
        name: [
          {
            required: true,
            message: __('请输入账号'),
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: __('请输入密码'),
            trigger: 'blur',
          },
          {
            min: 6,
            max: 12,
            message: __('长度在 %d 到 %d 个字符', 6, 12),
            trigger: 'blur',
          },
        ],
        code: [
          {
            required: true,
            message: __('请输入验证码'),
            trigger: 'blur',
          },
        ],
      },
      checked: false,
      remember: 0,
      links: [
        {
          key: '帮助',
          title: '帮助',
          href: 'https://www.dhb168.com',
          blankTarget: true,
        },
        {
          key: 'github',
          icon: 'logo-github',
          href: 'https://github.com/hunzhiwange/queryphp',
          blankTarget: true,
        },
        {
          key: '条款',
          title: '条款',
          href: 'https://github.com/hunzhiwange/queryphp',
          blankTarget: true,
        },
      ],
      copyright: '©' + new Date().getFullYear() + ' dhb168.com',
    }
  },
  methods: {
    refreshSeccode(force) {
      if (force || this.form.name != this.form.nameBackup) {
        this.form.nameBackup = this.form.name
        if (this.form.name) {
          this.codeUrl =
            this.codeImg + '?id=' + this.form.name + '&time=' + moment().unix()
        }
      }
    },
    handleSubmit(form) {
      if (this.loading) return
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = !this.loading

          let data = {}
          data.name = this.form.name
          data.password = this.form.password
          data.code = this.form.code

          if (this.checked) {
            data.remember = 1
          } else {
            data.remember = 0
          }

          this.apiPost('app:auth/login/validate', data).then(
            (res) => {
              res.keepLogin = this.isKeepLogin()
              this.$store.dispatch('login', res)

              setTimeout(() => {
                window.location.href = '/'
              }, 500)
            },
            () => {
              this.loading = !this.loading
            },
          )
        } else {
          return false
        }
      })
    },
    keepLogin() {
      Cookies.set('keep_login', this.checked ? 'T' : 'F', {
        expires: 60,
      })
    },
    checkKeepLogin() {
      this.checked = this.isKeepLogin()
    },
    isKeepLogin() {
      return Cookies.get('keep_login') === 'T' || !Cookies.get('keep_login')
    },
    setTheme() {
      if (localStorage.theme) {
        let theme = JSON.parse(localStorage.theme)
        this.$store.commit('changeMenuTheme', theme.menuTheme)
        this.$store.commit('changeMainTheme', theme.mainTheme)
      } else {
        this.$store.commit('changeMenuTheme', 'light')
        this.$store.commit('changeMainTheme', 'blue')
      }
      // 根据用户设置主题
      let stylesheetPath = '/' + this.$store.state.app.themeColor + '.css'
      let themeLink = document.querySelector('link[name="theme"]')
      themeLink.setAttribute('href', stylesheetPath)

      let stylesheetMenuPath =
        '/' +
        this.$store.state.app.themeColor +
        '_' +
        this.$store.state.app.menuTheme +
        '.css'
      let menuThemeLink = document.querySelector('link[name="menuTheme"]')
      menuThemeLink.setAttribute('href', stylesheetMenuPath)
    },
  },
  created() {
    this.checkKeepLogin()
  },
  mounted() {
    window.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        this.handleSubmit('form')
      }
    })
  },
  mixins: [],
}
