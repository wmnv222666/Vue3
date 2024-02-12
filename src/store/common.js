import i18n from '@/locales/i18n'

const $t = i18n.global.t

const state = {
  gender: () => {
    return [{ id: 1, label: $t('Form.Gender'), value: 1 }]
  }
}

const getters = {}

const mutations = {}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
