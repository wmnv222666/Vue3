import HttpRequest from './HttpRequest'

// 平台管理
export const $BASIC = new HttpRequest({
  baseURL: import.meta.env.VITE_BASIC_API
})
