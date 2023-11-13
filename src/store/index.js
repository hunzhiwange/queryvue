import { createStore } from 'vuex'
import app from './modules/app'
import user from './modules/user'
import page from './modules/page'
import getters from './getters'

export default createStore({
  // state: {},
  // mutations: {},
  // actions: {},
  // modules: {}
  modules: {
    app,
    user,
    page,
  },
  getters,
})
