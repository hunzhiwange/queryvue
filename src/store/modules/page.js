const state = {
  listPageParams: new Map(),
}

const mutations = {
  saveListPageParams: (state, { path, params }) => {
    state.listPageParams.set(path, params)
  },
}

const actions = {
  saveListPageParams: ({ commit }, { path, params }) => {
    commit('saveListPageParams', { path, params })
  },
}

export default {
  state,
  mutations,
  actions,
}
