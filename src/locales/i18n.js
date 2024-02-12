import { dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui'
import { createI18n } from 'vue-i18n/index'

// 系统语言映射表 （联动 naive ui）
export const languageList = [
  {
    id: 'zh',
    name: '简体中文',
    values: ['zh', 'zh-cn', 'cn'],
    locale: zhCN,
    dateLocale: dateZhCN
  },
  {
    id: 'en',
    name: 'English',
    values: ['en', 'en-us', 'en-GB'],
    locale: enUS,
    dateLocale: dateEnUS
  }
]

const messages = {}

// 获取语言字典
languageList.forEach(async ({ id }) => (messages[id] = await import(`./lang/${id}.json`)))

export default createI18n({
  // 地区
  locale: 'en',
  messages,
  localeList: [],
  globalInjection: true
})
