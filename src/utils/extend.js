import { sprintf } from 'sprintf-js'
import { isObject } from 'lodash'

export default {
  install: (app, options) => {
    app.config.globalProperties.__ = function () {
      if (app.config.globalProperties.$i18n.locale !== 'zh-CN') {
        arguments[0] = app.config.globalProperties.$t(arguments[0])
      }

      if (arguments.length > 1) {
        return sprintf.apply(null, arguments)
      }
      return arguments[0]
    }
  },
}
