<script setup>
import { useStore } from 'vuex'
import { NButton, NInputNumber, useMessage } from 'naive-ui'
import { DeleteOutlined, MoreOutlined } from '@vicons/antd'
import i18n from '@/locales/i18n'
import { computed, h, onBeforeMount, ref, reactive } from 'vue'
import { DataPagination } from '@/lib/utils'

const store = useStore()
const Message = useMessage()
const $t = i18n.global.t

onBeforeMount(() => {
  createTableData()
  loadData()
})

const state = reactive({
  tableLoading: false,
  data: [],
  tableData: [],
  options: [],
  model: {
    status: null
  }
})

const formRef = ref(null)

const pagination = reactive(new DataPagination())

const columns = computed(() => {
  return [
    { title: $t('Table.Item Name'), key: 'Item Name' },
    { title: $t('Table.Item Code'), key: 'Item Code' },
    {
      title: $t('Table.Regular Hours'),
      key: 'Regular Hours',
      render: (row) => {
        return h(NInputNumber, { defaultValue: 160 })
      }
    },
    {
      title: $t('Table.Personal Day'),
      key: 'Personal Day',
      render: (row) => {
        return h(NInputNumber, { defaultValue: 0 })
      }
    },
    {
      title: $t('Table.Sick Day'),
      key: 'Sick Day',
      render: (row) => {
        return h(NInputNumber, { defaultValue: 0 })
      }
    },
    {
      title: $t('Table.Vacation'),
      key: 'Vacation',
      render: (row) => {
        return h(NInputNumber, { defaultValue: 0 })
      }
    },
    {
      title: $t('Table.Overtime'),
      key: 'Overtime',
      render: (row) => {
        return h(NInputNumber, { vadefaultValuelue: 40 })
      }
    },
    {
      title: $t('Table.Family Day'),
      key: 'Family Day',
      render: (row) => {
        return h(NInputNumber, { defaultValue: 0 })
      }
    },
    {
      title: $t('Table.Reimbursement'),
      key: 'Reimbursement',
      render: (row) => {
        return h(NInputNumber, { defaultValue: 0 })
      }
    }
  ]
})

const onCancel = () => {
  Message.info(`${$t('Menu.TimeReport')} ${$t('Menu.TimeReportReport')} ${$t('Common.Cancel')}`)
}
const onSave = () => {
  Message.info(`${$t('Menu.TimeReport')} ${$t('Menu.TimeReportReport')} ${$t('Common.Save')}`)
}
const onSubmit = () => {
  Message.info(`${$t('Menu.TimeReport')} ${$t('Menu.TimeReportReport')} ${$t('Common.Submit')}`)
}

const createTableData = () => {
  state.data = Array.apply(null, {
    length: Math.floor(Math.random() * 100) + 100
  }).map((_, index) => {
    let obj = {}
    columns.value.forEach(({ key }) => {
      return (obj[key] = `${key}-${index + 1}`)
    })
    return obj
  })
}

const loadData = () => {
  let data = state.data.filter((v) => {
    let flag = true
    if (state.model.name) {
      flag = flag && v.name.includes(state.model.name)
    }
    return flag
  })
  state.tableData = data.slice(
    pagination.pageSize * (pagination.page - 1),
    pagination.pageSize * pagination.page
  )
  pagination.itemCount = data.length
}

const onPageUpdate = (s) => {
  pagination.page = s
  loadData()
}

const onPageSizeUpdate = (s) => {
  pagination.pageSize = s
  loadData()
}
</script>

<template>
  <div>
    <NForm ref="formRef" :model="state.model" label-placement="left" label-width="auto" inline>
      <NFormItem>
        <NSelect
          class="width-300"
          v-model:value="state.model.status"
          :options="state.options"
          :placeholder="$t('Form.Please Choose')"
          clearable
        />
      </NFormItem>
      <NFormItem>
        <NButton @click="onCancel">{{ $t('Common.Cancel') }}</NButton>
      </NFormItem>
      <NFormItem>
        <NButton type="primary" @click="onSave">{{ $t('Common.Save') }}</NButton>
      </NFormItem>
      <NFormItem>
        <NButton type="primary" @click="onSubmit">{{ $t('Common.Submit') }}</NButton>
      </NFormItem>
    </NForm>
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
  </div>
</template>

<style scoped lang="scss"></style>
