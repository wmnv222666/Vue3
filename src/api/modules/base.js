import { $BASIC } from '@/api/config'

// 应用管理 Application Controller
export const Application = {
  page: (params) => $BASIC.post(`app/page`, params),
  list: (params) => $BASIC.post(`app/list`, params),
  create: (params) => $BASIC.post(`app/add`, params),
  update: (params) => $BASIC.post(`app/update`, params),
  delete: (params) => $BASIC.post(`app/delete`, params),
  detail: (params) => $BASIC.post(`app/detail`, params)
}
