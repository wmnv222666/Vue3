// 基础路由：【缺省页】
export default [
  {
    name: 'Disabled',
    path: '/Disabled',
    component: () => import('@/components/Common/Disabled.vue'),
    meta: {
      title: 'Disabled',
      isNeedLogin: false,
      isNeedOffLine: false
    }
  },
  {
    name: 'NotFound',
    path: '/NotFound',
    component: () => import('@/components/Common/NotFound.vue'),
    meta: {
      title: 'NotFound',
      isNeedLogin: false,
      isNeedOffLine: false
    }
  },
  { path: '/:pathMatch(.*)', redirect: '/NotFound' }
]
