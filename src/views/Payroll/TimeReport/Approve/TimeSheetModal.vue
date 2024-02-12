<script setup>
import { useStore } from 'vuex'
import { useMessage } from 'naive-ui'
import i18n from '@/locales/i18n'
import { computed, h, onBeforeMount, reactive } from 'vue'
import { DataPagination } from '@/lib/utils'

const store = useStore()
const Message = useMessage()
const $t = i18n.global.t

onBeforeMount(() => {
  createTableData()
})

const state = reactive({
  showModal: false,
  detail: {},
  data: [],
  tableLoading: false,
  tableData: []
})

const columns = computed(() => {
  return [
    { title: $t('Table.Date'), key: 'date' },
    { title: $t('Table.Time Type'), key: 'timeType' },
    { title: $t('Table.Cost Project'), key: 'costProject' },
    { title: $t('Table.Working Hours'), key: 'workinghours' }
  ]
})

const pagination = reactive(new DataPagination())

const createTableData = () => {
  state.data = Array.apply(null, {
    length: Math.floor(Math.random() * 100) + 100
  }).map((_, index) => {
    let obj = {}
    columns.value.forEach(({ key }) => {
      if (key == 'date') {
        return (obj[key] = `2022-01-31`)
      }
      if (key == 'workinghours') {
        return (obj[key] = Math.floor(Math.random() * 5) + 2)
      }
      return (obj[key] = `${key}-${index + 1}`)
    })
    return obj
  })
}

const loadData = () => {
  state.tableData = state.data.slice(
    pagination.pageSize * (pagination.page - 1),
    pagination.pageSize * pagination.page
  )
  pagination.itemCount = state.data.length
}

const onPageUpdate = (s) => {
  pagination.page = s
  loadData()
}

const onPageSizeUpdate = (s) => {
  pagination.pageSize = s
  loadData()
}

const init = (data) => {
  state.detail = data
  loadData()
  state.showModal = true
}


</script>

<template>
  <NModal
    v-model:show="state.showModal"
    preset="card"
    :bordered="false"
    :style="{ width: '960px' }"
  >
    <NDescriptions label-placement="left" size="small" :columns="4" class="margin-bottom-16">
      <NDescriptionsItem :label="$t('Table.Name')">Jiangli li</NDescriptionsItem>
      <NDescriptionsItem :label="$t('Table.Employee #')">123123123</NDescriptionsItem>
      <NDescriptionsItem :label="$t('Table.Status')">To approve</NDescriptionsItem>
      <NDescriptionsItem :label="$t('Table.Working Period')">
        2021-03-01 to 2021-03-07
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('Table.Submit Time')">2021-03-15</NDescriptionsItem>
      <NDescriptionsItem :label="$t('Table.Pay Cycle')">Weekly</NDescriptionsItem>
    </NDescriptions>

    <NDataTable
      :data="state.tableData"
      :columns="columns"
      :loading="state.tableLoading"
      :pagination="pagination"
      @update:page="onPageUpdate"
      @update:page-size="onPageSizeUpdate"
      remote
      striped
    ></NDataTable>

    <NDescriptions
      bordered
      label-placement="left"
      label-align="right"
      size="small"
      :columns="2"
      class="margin-top-16"
    >
      <NDescriptionsItem :label="$t('Table.Regular time')">
        150 {{ $t('Common.Hours') }}
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('Table.Bonus')"> 200 {{ $t('Common.CAD') }} </NDescriptionsItem>
      <NDescriptionsItem :label="$t('Table.Over Time')">
        15 {{ $t('Common.Hours') }}
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('Table.vacation paid')">
        200 {{ $t('Common.CAD') }}
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('Table.Personal Holiday')">
        15 {{ $t('Common.Hours') }}
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('Table.tips')"> 100 {{ $t('Common.CAD') }} </NDescriptionsItem>
      <NDescriptionsItem :label="$t('Table.Ben QC')"> 80 {{ $t('Common.CAD') }} </NDescriptionsItem>
    </NDescriptions>

    <template #footer>
      <n-divider />
      <div class="text-right" v-if="state.detail.status == '0'">
        <NButton type="primary" @click="state.showModal = false">
          {{ $t('Common.Rejected') }}
        </NButton>
        <NButton type="primary" class="margin-left-16" @click="state.showModal = false">
          {{ $t('Common.Approve') }}
        </NButton>
      </div>
      <div class="text-right" v-else>
        <NButton type="primary" @click="state.showModal = false">
          {{ $t('Common.Close') }}
        </NButton>
      </div>
    </template>
  </NModal>
</template>

<style scoped lang="scss"></style>
