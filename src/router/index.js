import { createRouter, createWebHistory } from 'vue-router'
import ViewUIPlus from 'view-ui-plus'
import routes from './router'
import { getToken, isLock } from '../utils/auth'

const router = createRouter({
  routes,
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
})

// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

export default router

ViewUIPlus.LoadingBar.config({
  color: '#1c56c6',
  // failedColor: '#f0ad4e',
  // height: 5
})

const ignoreRouter = [
  '404',
  '403',
  '500',
  'locking',
  'login',
  'dashboard',
  'black-page',
  'profile_index',
  'message',
]

router.beforeEach((to, from, next) => {
  ViewUIPlus.LoadingBar.start()

  setTimeout(() => utils.title(to.meta.title), 0)

  if (!getToken() && to.name !== 'login') {
    next({
      name: 'login',
    })
  } else if (getToken() && to.name === 'login') {
    next({
      name: 'dashboard',
    })
  }

  // 判断当前是否是锁定状态
  else if (isLock() && to.name !== 'locking') {
    next({
      replace: true,
      name: 'locking',
    })
  } else if (!isLock() && to.name === 'locking') {
    next({
      replace: true,
      name: 'dashboard',
    })
  } else if (
    !ignoreRouter.includes(to.name)
    && !utils.permission(`${to.name}_menu`)
  ) {
    next({
      replace: true,
      name: '403',
    })
  } else {
    next()
  }
})

router.afterEach((to) => {
  utils.openNewPage(router.app, to.name, to.params, to.query)
  ViewUIPlus.LoadingBar.finish()
  window.scrollTo(0, 0)
})
