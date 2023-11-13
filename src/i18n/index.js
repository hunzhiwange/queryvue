import zhCnLocale from 'view-ui-plus/dist/locale/zh-CN'
import enUsLocale from 'view-ui-plus/dist/locale/en-US'
import { createI18n } from 'vue-i18n'
import enUsApp from './en-US'
import zhCnApp from './zh-CN'

// 自动设置语言
const navLang = navigator.language
const localLang = navLang === 'zh-CN' || navLang === 'en-US' ? navLang : false
const lang = window.localStorage.lang || localLang || 'zh-CN'

const i18n = createI18n({
  allowComposition: true,
  globalInjection: true,
  legacy: false,
  locale: lang,
  messages: {
    'zh-CN': Object.assign(zhCnLocale, zhCnApp),
    'en-US': Object.assign(enUsLocale, enUsApp),
  },
})

export default i18n
