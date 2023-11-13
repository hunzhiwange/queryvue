import {
  getToken,
  setToken,
  removeToken,
  getAppSecret,
  setAppSecret,
  removeAppSecret,
} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    appSecret: getAppSecret(),
    menus: [],
    rules: [],
    users: {},
  },

  mutations: {
    setToken: (state, token) => {
      state.token = token
    },
    setAppSecret: (state, tmpAppSecret) => {
      state.appSecret = tmpAppSecret
    },
    setRules(state, rules) {
      state.rules = rules
    },
    setUsers(state, users) {
      state.users = users
    },
  },

  actions: {
    login({ commit }, data) {
      setToken(data.token, data.keepLogin)
      setAppSecret(
        {
          tmp_app_key: data.tmp_app_key,
          tmp_app_secret: data.tmp_app_secret,
        },
        data.keepLogin,
      )
    },
    loginStorage({ commit }) {
      let userInfo = localStorage.getItem('userInfo')
      let authList = localStorage.getItem('authList')
      let menus = localStorage.getItem('menus')

      userInfo = userInfo ? JSON.parse(userInfo) : []
      authList = authList ? JSON.parse(authList) : []
      menus = menus ? JSON.parse(menus) : []

      commit('setToken', getToken())
      commit('setAppSecret', getAppSecret())
      commit('setRules', authList)
      commit('setUsers', userInfo)
    },
    logout({ commit }) {
      commit('setToken', '')
      commit('setAppSecret', {})
      commit('setRules', [])
      commit('setUsers', [])

      removeToken()
      removeAppSecret()

      localStorage.removeItem('menus')
      localStorage.removeItem('authList')
      localStorage.removeItem('userInfo')
    },
    setRules({ commit }, rules) {
      rules = { static: [], dynamic: [], ...rules }
      commit('setRules', rules)
      localStorage.setItem('authList', JSON.stringify(rules))
    },
    setUsers({ commit }, users) {
      commit('setUsers', users)
      localStorage.setItem('userInfo', JSON.stringify(users))
    },
  },
}

export default user
