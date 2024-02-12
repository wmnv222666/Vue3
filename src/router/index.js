import i18n from '@/locales/i18n'
import routes from '@/router/routes'
import store from '@/store'
import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
NProgress.configure({ showSpinner: false })

// 路由对象
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  console.log(
    `%c Enter to ${String(to.name)} from ${String(from.name)}`,
    'font-size: 24px;color: #1fbf1f;'
  )
  NProgress.start()
  NProgress.inc(0.2)

  let isLogin = store.getters['system/isLogin']
  // 首次进入
  if (!from.name) {
    await store.dispatch('appInitWithoutToken')

    // 登录后初始化 - 获取后台权限，解锁 待开放页
    if (store.getters['system/isLogin']) {
      let name = await store.dispatch('appInit')
      if (to.name === 'Main' && to.meta.isNeedOffLine) return next({ name })
    }
  }

  // 3. 阶段 - 权限判断、页面拦截
  if (isLogin) {
    // 已登录

    // A. 待开放页 - 不可进入，需要根据后台权限解锁
    if (to.meta.isNeedOffLine && to.meta.isNeedLogin) return next({ name: 'Disabled' })
    // B. 离线页面 - 登录后不可进入
    if (to.meta.isNeedOffLine) return next(false)
  } else {
    // 未登录

    // C. 普通页面 - 未登录，不可进入
    if (to.meta.isNeedLogin) return next({ name: 'Login' })
  }

  // D. 开放页面 - 登录、未登录，都可以进入
  next()
})

// 路由后置守卫
router.afterEach((to, from) => {
  // 设置标题
  // document.title = String(to.meta.title)
  let { getLocaleMessage, locale } = i18n.global
  document.title = getLocaleMessage(locale).Menu[to.name || ''] || ''
  NProgress.done()
})

// 多标签页同步登出
// 标签页切换、鼠标移入页面时，重新获取token，同步其他标签页token
window.addEventListener('visibilitychange', async function () {
  if (document.visibilityState !== 'visible') return false
  await store.dispatch('system/syncToken')
})
window.onfocus = async function () {
  await store.dispatch('system/syncToken')
}

export default router
