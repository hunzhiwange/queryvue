import { sprintf } from 'sprintf-js'
import { isObject, upperFirst } from 'lodash'
import { inject } from 'vue'

const viewModules = import.meta.glob('../views/**/*.vue')
// const componentModules = import.meta.glob('../components/**/*.vue')

const Layout = () => import('@/views/layout/layout')

window.__ = window.gettext = function () {
  const app = inject('app')
  if (isObject(app)) {
    return app.config.globalProperties.__.apply(app, arguments)
  }

  if (arguments.length > 1) {
    return sprintf.apply(null, arguments)
  }
  return arguments[0]
}

// 不作为 layout 组件的子页面展示的页面单
export const commonRouter = [
  {
    type: 'locking',
    title: __('系统已锁定'),
  },
  {
    type: '403',
    title: __('权限不足'),
  },
  {
    type: '404',
    title: __('页面不存在'),
  },
  {
    type: '500',
    title: __('服务端错误'),
  },
  {
    type: 'login',
    title: __('登录'),
  },
]

const appRouterData = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'other-router-top',
    meta: {
      parentName: 'other-router-top',
    },
    children: [
      {
        type: 'other-router',
        title: __('其它路由'),
        children: [
          {
            type: 'black-page',
            title: __('加载中'),
          },
          {
            type: 'dashboard',
            title: __('首页'),
          },
          {
            type: 'message',
            title: __('消息中心'),
          },
        ],
      },
    ],
  },
  {
    type: 'project-top',
    icon: 'md-git-branch',
    title: __('项目'),
    component: Layout,
    children: [
      {
        type: 'project-issue-manager',
        title: __('任务'),
        span: 8,
        children: [
          {
            title: __('项目问题'),
            types: [
              'project-issue',
              'create',
              'edit',
              {
                path: '/issue/:num-:id',
                subTitle: __('任务详情'),
                type: 'issue-detail',
                component: () => import('@/views/project/issue'),
                parentName: 'project-issue',
              },
              {
                path: '/content/:num-:id',
                subTitle: __('查看内容'),
                type: 'issue-content',
                component: () => import('@/views/project/issue-content'),
                parentName: 'project-issue',
              },
              {
                path: '/content/:num-:id/edit',
                subTitle: __('编辑内容'),
                type: 'issue-content-edit',
                component: () => import('@/views/project/issue-content-edit'),
                parentName: 'project-issue',
              },
              {
                path: '/board/:num',
                subTitle: __('项目看板'),
                type: 'board-issue-list',
                component: () => import('@/views/project/view'),
                parentName: 'project-issue',
              },
              {
                path: '/board/:num/attachement',
                subTitle: __('项目文件'),
                type: 'board-attachement',
                component: () => import('@/views/project/attachement'),
                parentName: 'project-issue',
              },
              {
                path: '/board/:num/overview',
                subTitle: __('项目概览'),
                type: 'board-overview',
                component: () => import('@/views/project/overview'),
                parentName: 'project-issue',
              },
              {
                path: '/board/:num/release',
                subTitle: __('项目版本'),
                type: 'board-release',
                component: () => import('@/views/project/release'),
                parentName: 'project-issue',
              },
              {
                path: '/content/:num-:id/edit-content',
                subTitle: __('编辑内容'),
                type: 'issue-content-edit-content',
                component: () => import('@/views/project/content'),
                parentName: 'project-issue',
              },
              {
                path: '/content/:num-:id/edit-process',
                subTitle: __('编辑流程图'),
                type: 'issue-content-edit-process',
                component: () => import('@/views/project/process'),
                parentName: 'project-issue',
              },
              {
                path: '/content/:num-:id/edit-mind-map',
                subTitle: __('编辑思维导图'),
                type: 'issue-content-edit-mind-map',
                component: () => import('@/views/project/mind-map'),
                parentName: 'project-issue',
              },
            ],
          },
          {
            title: __('项目版本'),
            types: ['project-release', 'create', 'edit'],
          },
        ],
      },
      {
        type: 'project-label-manager',
        title: __('分类'),
        span: 8,
        children: [
          {
            title: __('项目模块'),
            types: ['project-module', 'create', 'edit'],
          },
          {
            title: __('项目分类'),
            types: ['project-label', 'create', 'edit'],
          },
          {
            title: __('项目标签'),
            types: ['project-tag', 'create', 'edit'],
          },
        ],
      },
      {
        type: 'project-manager',
        title: __('项目'),
        span: 8,
        children: [
          {
            title: __('项目管理'),
            types: ['project', 'create', 'edit'],
          },
          {
            title: __('项目类型'),
            types: ['project-type', 'create', 'edit'],
          },
        ],
      },
    ],
  },
  {
    type: 'option-top',
    icon: 'md-settings',
    title: __('设置'),
    component: Layout,
    children: [
      {
        type: 'ui-manager',
        title: __('界面设计'),
        span: 14,
        children: [
          {
            type: 'ui-form',
            title: __('表单设计'),
          },
          {
            title: __('打印模板'),
            types: [
              'print-template',
              'create',
              'edit',
              {
                type: 'detail',
                sub: 'design',
                subTitle: __('设计'),
              },
            ],
          },
        ],
      },
      {
        type: 'user-manager',
        title: __('员工管理'),
        span: 10,
        children: [
          {
            title: __('员工'),
            types: [
              'user',
              'create',
              'edit',
              {
                type: 'detail',
                sub: 'role',
                subTitle: __('角色'),
              },
            ],
          },
          {
            title: __('角色'),
            types: [
              'role',
              'create',
              'edit',
              {
                type: 'detail',
                sub: 'permission',
                subTitle: __('权限'),
              },
            ],
          },
          {
            title: __('权限'),
            types: [
              'permission',
              'create',
              'edit',
              {
                type: 'detail',
                sub: 'resource',
                subTitle: __('资源'),
              },
            ],
          },
          {
            title: __('资源'),
            types: ['resource', 'create', 'edit'],
          },
        ],
      },
    ],
  },
]

// let dataMenu = localStorage.getItem('menus')
// dataMenu = dataMenu ? JSON.parse(dataMenu) : []
//
// if (dataMenu) {
//     let routes = []
//     //routerMenu(routes,dataMenu)
//     //appRouterData = appRouterData.concat(routes)
// }

function expandRouterData(routerData) {
  routerData.forEach((route) => {
    if (Object.prototype.hasOwnProperty.call(route, 'types')) {
      let entity = null
      route.types.forEach((type, index) => {
        if (index === 0) {
          if (isObject(type)) {
            Object.assign(route, type)
            entity = type.type
            route.type = entity
          } else {
            entity = type
            route.type = entity
          }
        } else {
          const item = {
            title: route.title,
          }
          if (Object.prototype.hasOwnProperty.call(route, 'alias')) {
            item.alias = route.alias
          }
          if (isObject(type)) {
            Object.assign(item, type)
            type = type.type
          }
          item[`type${upperFirst(type)}`] = entity
          routerData.push(item)
        }
      })
    }

    if (route.children) {
      expandRouterData(route.children)
    }
  })
}

function traverseRouterData(routerData) {
  routerData.forEach((route) => {
    if (!Object.prototype.hasOwnProperty.call(route, 'meta')) {
      route.meta = {}
    }

    if (Object.prototype.hasOwnProperty.call(route, 'span')) {
      route.meta.span = route.span
    }

    if (Object.prototype.hasOwnProperty.call(route, 'width')) {
      route.meta.width = route.width
    }

    if (Object.prototype.hasOwnProperty.call(route, 'parentName')) {
      route.meta.parentName = route.parentName
    }

    if (Object.prototype.hasOwnProperty.call(route, 'typeCreate')) {
      route.name = `${route.typeCreate}.create`
      route.path = `/${route.typeCreate}-create`
      route.meta.headline = route.title
      route.meta.title = __('新增') + route.title
      if (!Object.prototype.hasOwnProperty.call(route.meta, 'parentName')) {
        route.meta.parentName = route.typeCreate
      }
    } else if (Object.prototype.hasOwnProperty.call(route, 'typeEdit')) {
      route.name = `${route.typeEdit}.edit`
      route.path = `/${route.typeEdit}-edit/:id`
      route.meta.headline = route.title
      route.meta.title = __('编辑') + route.title
      if (!Object.prototype.hasOwnProperty.call(route.meta, 'parentName')) {
        route.meta.parentName = route.typeEdit
      }
    } else if (Object.prototype.hasOwnProperty.call(route, 'typeDetail')) {
      let subKey = 'detail'
      let suffixKey = ''
      if (route.sub) {
        if (route.sub.indexOf('.') > -1) {
          subKey = route.sub.substr(0, route.sub.indexOf('.'))
          suffixKey = route.sub.substr(route.sub.indexOf('.') + 1)
        } else {
          subKey = route.sub
        }
      }
      route.name = `${route.typeDetail}.${subKey}${
        suffixKey ? `-${suffixKey}` : ''
      }`
      route.path = `/${route.typeDetail}-${subKey}/:id${
        suffixKey ? `/${suffixKey}` : ''
      }`
      route.meta.headline = route.title
      route.meta.title = route.title + (route.subTitle ? route.subTitle : __('详情'))
      if (!Object.prototype.hasOwnProperty.call(route.meta, 'parentName')) {
        route.meta.parentName = route.typeDetail
      }
    } else if (Object.prototype.hasOwnProperty.call(route, 'type')) {
      route.name = route.type
      route.meta.headline = route.title
      route.meta.title = route.title
    } else if (Object.prototype.hasOwnProperty.call(route, 'typeImportList')) {
      route.name = `${route.typeImportList}.batch-import-list`
      route.path = `/${route.typeImportList}-batch-import-list`
      route.meta.headline = route.title
      route.meta.title = route.title + __('批量操作')
      if (!Object.prototype.hasOwnProperty.call(route.meta, 'parentName')) {
        route.meta.parentName = route.typeImportList
      }
    } else if (
      Object.prototype.hasOwnProperty.call(route, 'typeImportCreate')
    ) {
      route.name = `${route.typeImportCreate}.batch-import-create`
      route.path = `/${route.typeImportCreate}-batch-import-create`
      route.meta.headline = route.title
      route.meta.title = __('批量导入') + route.title
      if (!Object.prototype.hasOwnProperty.call(route.meta, 'parentName')) {
        route.meta.parentName = route.typeImportCreate
      }
    } else {
      route.meta.headline = route.title
    }

    if (!Object.prototype.hasOwnProperty.call(route, 'path')) {
      route.path = `/${route.name.replace(/\./g, '-')}`
    }

    if (
      !Object.prototype.hasOwnProperty.call(route, 'component')
      && !Object.prototype.hasOwnProperty.call(route, 'children')
    ) {
      let component = ''
      if (route.name.indexOf('.') === -1) {
        component = `${
          Object.prototype.hasOwnProperty.call(route, 'alias')
            ? route.alias
            : route.name
        }/index`
      } else if (Object.prototype.hasOwnProperty.call(route, 'alias')) {
        const componentBash = route.alias + route.name.substr(route.name.lastIndexOf('.'))
        component = componentBash.replace(/\./g, '/')
      } else {
        component = route.name.replace(/\./g, '/')
      }

      const componentPath = `../views/${component}.vue`
      if (Object.prototype.hasOwnProperty.call(viewModules, componentPath)) {
        route.component = viewModules[componentPath]
        return
      }

      // componentPath = `../components/${component}.vue`
      // if (
      //   Object.prototype.hasOwnProperty.call(componentModules, componentPath)
      // ) {
      //   route.component = componentModules[componentPath]
      //   return
      // }

      throw new Error(
        `Can't find the path '${componentPath}' of component '${component}'.`,
      )
    }

    if (route.children) {
      traverseRouterData(route.children)
    }
  })
}

expandRouterData(commonRouter)
expandRouterData(appRouterData)
traverseRouterData(commonRouter)
traverseRouterData(appRouterData)

// 作为 layout 组件的子页面展示并且在左侧菜单显示的路由写在 appRouter 里
export const appRouter = appRouterData

// 所有上面定义的路由都要写在下面的 routers 里
export default [...commonRouter, ...appRouterData]
