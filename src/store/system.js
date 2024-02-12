/**
 * 系统与用户 管理
 */
import { Token, UserInfo } from '@/lib/storage'
import Router from '@/router'

const state = {
  token: Token.get() || null,
  userInfo: UserInfo.get() || {},

  // 模拟权限数据列表【源数据】
  permissionList: [
    /*    {
      permission: 'Dashboard',
      routeName: 'Dashboard',
      icon: 'DashboardOutlined'
    },*/
    {
      permission: 'MyCompany',
      routeName: 'MyCompany',
      icon: 'BankOutlined',
      children: [
        {
          permission: 'MyCompany:BasicInfo',
          routeName: 'BasicInfo',
          icon: 'ProfileOutlined'
        },
        {
          permission: 'MyCompany:PayItems',
          routeName: 'PayItems',
          icon: 'PayCircleOutlined'
        },
        {
          permission: 'MyCompany:PayCycles',
          routeName: 'PayCycles',
          icon: 'AccountBookOutlined'
        }
      ]
    },
    {
      permission: 'MyEmployee',
      routeName: 'MyEmployee',
      icon: 'TeamOutlined',
      children: [
        {
          permission: 'MyEmployee:EmployeeList',
          routeName: 'EmployeeList',
          icon: 'BarsOutlined'
        }
      ]
    },
    {
      permission: 'TimeReport',
      routeName: 'TimeReport',
      icon: 'CalendarStats',
      children: [
        {
          permission: 'TimeReport:List',
          routeName: 'TimeReportList',
          icon: 'BarsOutlined'
        },
        {
          permission: 'TimeReport:Report',
          routeName: 'TimeReportReport',
          icon: 'BarChartOutlined'
        },
        {
          permission: 'TimeReport:Approve',
          routeName: 'TimeReportApprove',
          icon: 'AuditOutlined'
        }
      ]
    },
    /*{
      permission: 'PayRun',
      routeName: 'PayRun',
      icon: 'CurrencyRuble',
      children: [
        {
          permission: 'PayRun:PayrollRun',
          routeName: 'PayrollRun',
          icon: 'Run'
        },
        {
          permission: 'PayRun:RunHistory',
          routeName: 'RunHistory',
          icon: 'FieldTimeOutlined'
        }
      ]
    },*/
    // {
    //   permission: 'Billing',
    //   routeName: 'Billing',
    //   icon: 'BankOutlined'
    // },
    // {
    //   permission: 'Reporting',
    //   routeName: 'Reporting',
    //   icon: 'LineChartOutlined'
    // },
    /*{
      permission: 'Setting',
      routeName: 'Setting',
      icon: 'SettingOutlined'
    },*/
    {
      permission: 'GlobalAdmin',
      routeName: 'GlobalAdmin',
      icon: 'UserAdmin'
    },
    {
      permission: 'Bpmn',
      routeName: 'Bpmn',
      icon: 'UserAdmin'
    },
    {
      permission: 'Test1',
      routeName: 'Test1',
      icon: 'UserAdmin'
    },
  ]
}

const getters = {
  isLogin: (state) => Boolean(state.token),
  // 依赖权限数据重组成指定数据结构
  permissionList(state) {
    return state.permissionList
  }
}

const mutations = {
  tokenUpdate: (state, d) => {
    state.token = d
    d && Token.set(d)
  },
  userInfoUpdate: (state, d) => UserInfo.set((state.userInfo = d))
}

const actions = {
  // 登出
  logout(ctx) {
    ctx.commit('tokenUpdate', null)
    ctx.commit('userInfoUpdate', {})
    Token.del()

    Router.push({ name: 'Login' }).then()
  },

  // 同步token
  async syncToken(ctx) {
    console.log('Sync Token')
    ctx.commit('tokenUpdate', Token.get())
    ctx.commit('userInfoUpdate', UserInfo.get())

    if (ctx.getters.isLogin) {
      // 已登录
      Router.currentRoute.value.meta.isNeedOffLine && Router.push('/').then()
    } else {
      // 未登录
      Router.currentRoute.value.meta.isNeedLogin && ctx.dispatch('logout')
    }
  },
  // TODO 获取用户信息
  async getUserInfo(ctx) {
    ctx.commit('userInfoUpdate', {
      name: `用户${Date.now().toString().slice(-4)}`,
      ...UserInfo.get()
    })

    // TODO 获取权限信息
  }

  // 权限同步路由表 - 以后台接口树状结构为核心
  // PS: 不能使用 getters 属性
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
