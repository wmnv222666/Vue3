import { Session, Local } from './knight-storage'

// 登录令牌
export const Token = new Session('Token', 168)

// 用户信息
export const UserInfo = new Session('UserInfo')

// 用户信息
export const Language = new Local('Language')
