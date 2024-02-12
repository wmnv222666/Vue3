<script setup>
import { useStore } from 'vuex'
import { useMessage } from 'naive-ui'
import i18n from '@/locales/i18n'
import { computed, h } from 'vue'
import Employees from './Employees.vue'
import TimeSheets from './TimeSheets.vue'
import Reports from './Reports.vue'

const store = useStore()
const Message = useMessage()
const $t = i18n.global.t

const tabList = computed(() => {
  return [
    {
      name: 'Dashboard.Employees',
      id: 'Employees',
      component: Employees
    },
    {
      name: 'Dashboard.Time Sheets',
      id: 'TimeSheets',
      component: TimeSheets
    },
    {
      name: 'Dashboard.Reports',
      id: 'Reports',
      component: Reports
    }
  ]
})
</script>

<template>
  <NTabs type="line" animated>
    <NTabPane v-for="item in tabList" :key="item.id" :name="$t(item.name)" :tab="item.id">
      <component :is="item.component"></component>
    </NTabPane>
  </NTabs>
</template>

<style scoped lang="scss"></style>
