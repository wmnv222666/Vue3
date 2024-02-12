export default {
  name: 'Payroll',
  path: '/Payroll',
  component: () => import('@/views/Payroll/index.vue'),
  meta: {
    isNeedLogin: true,
    isNeedOffLine: false,
    permission: 'Payroll'
  },
  redirect: { name: 'MyCompany' },
  children: [
    /*{
      name: 'Dashboard',
      path: 'Dashboard',
      component: () => import('@/views/Payroll/Dashboard/index.vue'),
      meta: {
        isNeedLogin: true,
        isNeedOffLine: false,
        permission: 'Dashboard'
      }
    },
*/
    {
      name: 'MyCompany',
      path: 'MyCompany',
      component: () => import('@/components/Common/RouteAlive.vue'),
      meta: {
        isNeedLogin: true,
        isNeedOffLine: false,
        permission: 'MyCompany'
      },
      redirect: { name: 'BasicInfo' },

      children: [
        {
          name: 'BasicInfo',
          path: 'BasicInfo',
          component: () => import('@/views/Payroll/MyCompany/BasicInfo/index.vue'),
          meta: {
            isNeedLogin: true,
            isNeedOffLine: false,
            permission: 'MyCompany:BasicInfo'
          }
        },

        {
          name: 'PayItems',
          path: 'PayItems',
          component: () => import('@/views/Payroll/MyCompany/PayItems/index.vue'),
          meta: {
            isNeedLogin: true,
            isNeedOffLine: false,
            permission: 'MyCompany:PayItems'
          }
        },

        {
          name: 'PayCycles',
          path: 'PayCycles',
          component: () => import('@/views/Payroll/MyCompany/PayCycles/index.vue'),
          meta: {
            isNeedLogin: true,
            isNeedOffLine: false,
            permission: 'MyCompany:PayCycles'
          }
        }
      ]
    },

    {
      name: 'MyEmployee',
      path: 'MyEmployee',
      component: () => import('@/components/Common/RouteAlive.vue'),
      meta: {
        isNeedLogin: true,
        isNeedOffLine: false,
        permission: 'MyEmployee'
      },

      children: [
        {
          name: 'EmployeeList',
          path: 'EmployeeList',
          component: () => import('@/views/Payroll/MyEmployee/EmployeeList/index.vue'),
          meta: {
            isNeedLogin: true,
            isNeedOffLine: false,
            permission: 'MyEmployee:EmployeeList'
          }
        },
        {
          name: 'EmployeeCreate',
          path: 'EmployeeCreate',
          component: () => import('@/views/Payroll/MyEmployee/EmployeeCreate/index.vue'),
          meta: {
            isNeedLogin: true,
            isNeedOffLine: false,
            permission: 'MyEmployee:EmployeeCreate'
          }
        }
      ]
    },

    {
      name: 'TimeReport',
      path: 'TimeReport',
      component: () => import('@/components/Common/RouteAlive.vue'),
      meta: {
        isNeedLogin: true,
        isNeedOffLine: false,
        permission: 'TimeReport'
      },
      children: [
        {
          name: 'TimeReportList',
          path: 'List',
          component: () => import('@/views/Payroll/TimeReport/List/index.vue'),
          meta: {
            isNeedLogin: true,
            isNeedOffLine: false,
            permission: 'TimeReport:List'
          }
        },
        {
          name: 'TimeReportReport',
          path: 'TimeReportReport',
          component: () => import('@/views/Payroll/TimeReport/Report/index.vue'),
          meta: {
            isNeedLogin: true,
            isNeedOffLine: false,
            permission: 'TimeReport:Report'
          }
        },
        {
          name: 'TimeReportApprove',
          path: 'TimeReportApprove',
          component: () => import('@/views/Payroll/TimeReport/Approve/index.vue'),
          meta: {
            isNeedLogin: true,
            isNeedOffLine: false,
            permission: 'TimeReport:Approve'
          }
        }
      ]
    },

    {
      name: 'PayRun',
      path: 'PayRun',
      component: () => import('@/components/Common/RouteAlive.vue'),
      meta: {
        isNeedLogin: true,
        isNeedOffLine: false,
        permission: 'PayRun'
      },

      children: [
        {
          name: 'PayrollRun',
          path: 'PayrollRun',
          component: () => import('@/views/Payroll/PayRun/index.vue'),
          meta: {
            isNeedLogin: true,
            isNeedOffLine: false,
            permission: 'PayRun:PayrollRun'
          }
        },

        {
          name: 'RunHistory',
          path: 'RunHistory',
          component: () => import('@/views/Payroll/PayRun/RunHistory.vue'),
          meta: {
            isNeedLogin: true,
            isNeedOffLine: false,
            permission: 'PayRun:RunHistory'
          }
        }
      ]
    },

    {
      name: 'GlobalAdmin',
      path: 'GlobalAdmin',
      component: () => import('@/views/Payroll/GlobalAdmin/index.vue'),
      meta: {
        isNeedLogin: true,
        isNeedOffLine: false,
        permission: 'GlobalAdmin'
      }
    },
    {
      name: 'Bpmn',
      path: 'Bpmn',
      component: () => import('@/views/Payroll/Bpmn/index.vue'),
      meta: {
        isNeedLogin: true,
        isNeedOffLine: false,
        permission: 'Bpmn'
      }
    },
    {
      name: 'Test1',
      path: 'Test1',
      component: () => import('@/views/Payroll/Test1/index.vue'),
      meta: {
        isNeedLogin: true,
        isNeedOffLine: false,
        permission: 'Test1'
      }
    }
  ]
}
