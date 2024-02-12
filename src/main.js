import { createApp } from 'vue'
import AppView from './App.vue'
import i18n from './locales/i18n'
import router from './router'
import store from './store'
import './styles/global.scss'
import 'nprogress/nprogress.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const App = createApp(AppView)

// 路由
App.use(router)

// 数据仓库
App.use(store)

// 双语系统
App.use(i18n)
//ELemente
App.use(ElementPlus)

App.mount('#app')
