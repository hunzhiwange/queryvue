const getters = {
  sidebar: (state) => state.app.sidebar,
  visitedViews: (state) => state.app.visitedViews,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  introduction: (state) => state.user.introduction,
  status: (state) => state.user.status,
  roles: (state) => state.user.roles,
  setting: (state) => state.user.setting,
  listPageParams: (state) => state.page.listPageParams,
}
export default getters
