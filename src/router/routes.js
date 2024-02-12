import base from '@/router/base'
import Payroll from '@/router/Payroll'

const routes = [
  {
    name: 'Main',
    path: '/',
    component: () => import('@/views/Main/index.vue'),
    meta: {
      isNeedLogin: true,
      isNeedOffLine: false,
      permission: 'Main'
    }
  },
  {
    name: 'Login',
    path: '/Login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      isNeedLogin: false,
      isNeedOffLine: true,
      permission: 'Login'
    }
  },
  {
    name: 'ResetPassword',
    path: '/ResetPassword',
    component: () => import('@/views/Login/ResetPassword.vue'),
    meta: {
      isNeedLogin: false,
      isNeedOffLine: true,
      permission: 'Login'
    }
  },
  Payroll,
  ...base
]
export default routes
