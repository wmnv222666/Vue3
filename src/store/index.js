import { Language } from '@/lib/storage'
import i18n, { languageList } from '@/locales/i18n'
import common from '@/store/common'
import system from '@/store/system'
import Vuex from 'vuex'

const state = {
  // 系统语言
  lang: null,
  // 系统语言映射表
  languageList
}

const getters = {
  isDev: () => import.meta.env.DEV,
  isProduction: () => import.meta.env.PROD,

  /*设备终端判断*/
  // 微信端
  isWeiXin: () => /(?:MicroMessenger)/.test(navigator.userAgent),
  // 支付宝端
  isAlipay: () => /(?:AlipayClient)/.test(navigator.userAgent),

  isWindowsPhone: () => /(?:Windows Phone)/.test(navigator.userAgent),
  isSymbian: (state, getters) =>
    /(?:SymbianOS)/.test(navigator.userAgent) || getters.isWindowsPhone,
  isFireFox: () => /(?:Firefox)/.test(navigator.userAgent),
  isChrome: () => /(?:Chrome|CriOS)/.test(navigator.userAgent),

  isAndroid: () => /(?:Android)/.test(navigator.userAgent),
  isTablet: (state, getters) =>
    /(?:iPad|PlayBook)/.test(navigator.userAgent) ||
    (getters.isAndroid && !/(?:Mobile)/.test(navigator.userAgent)) ||
    (getters.isFireFox && /(?:Tablet)/.test(navigator.userAgent)),
  isIOS: (state, getters) => /(?:iPhone)/.test(navigator.userAgent) && !getters.isTablet,
  isPC: (state, getters) => !getters.isIOS && !getters.isAndroid && !getters.isSymbian,
  isH5: (state, getters) => !getters.isPC,

  languageObj(state) {
    return state.languageList.find((item) => item.id === state.lang) || {}
  }
}

const mutations = {
  setLang(state, lang) {
    state.lang = lang
  }
}

const actions = {
  // 初始化【免登录】
  async appInitWithoutToken(ctx) {
    await ctx.dispatch('setLanguage', Language.get() || navigator.language.toLowerCase())
    // await ctx.dispatch('common/saveContext', this, {root: true})

    // 初始化过滤器
    // await ctx.dispatch('common/createFilter', null, {root: true})
  },

  // 初始化【登录后】
  async appInit(ctx) {
    await ctx.dispatch('system/getUserInfo', null, { root: true })

    // 返回登录后跳转页面
    return 'Payroll'
  },

  // 设置系统语言
  setLanguage(ctx, lang) {
    lang = (languageList.find((item) => item.values.includes(lang)) || { id: 'zh' }).id
    i18n.global.locale = lang
    Language.set(lang)
    ctx.commit('setLang', lang)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    common,
    system
  }
})
