<script setup>
import { useStore } from 'vuex'
import { NButton, NIcon, useMessage } from 'naive-ui'
import i18n from '@/locales/i18n'
import { computed, h, onBeforeMount, ref, reactive } from 'vue'
import TimeSheetModal from './TimeSheetModal.vue'
import { EditOutlined, EyeOutlined } from '@vicons/antd'
import { DataPagination } from '@/lib/utils'

const store = useStore()
const Message = useMessage()
const $t = i18n.global.t

onBeforeMount(() => {
  createTableData()
  loadData()
})

const modal = ref()

const state = reactive({
  tableLoading: false,
  data: [],
  tableData: [],
  options: [
    { label: $t('Select.To approve'), value: '0' },
    { label: $t('Select.Approve'), value: '1' },
    { label: $t('Select.Rejected'), value: '2' },
    { label: $t('Select.Abandoned'), value: '3' }
  ],
  model: {
    name: '',
    code: '',
    status: null,
    filters: ''
  }
})

const formRef = ref(null)

const pagination = reactive(new DataPagination())

const columns = computed(() => {
  return [
    { title: $t('Table.Employee Name'), key: 'name' },
    { title: $t('Table.Employee #'), key: 'code' },
    {
      title: $t('Table.Working Period'),
      key: 'period',
      render: (row) => {
        return h('span', `${row.startDate} - ${row.endDate}`)
      }
    },
    { title: $t('Table.Total Working Hours'), key: 'total' },
    {
      title: $t('Table.Status'),
      key: 'status',
      render: (row) => {
        let obj = state.options.find((v) => v.value == row.status) || {}
        return h('span', obj.label)
      }
    },
    {
      title: $t('Table.Operation'),
      key: 'Operation',
      render: (row) => {
        if (row.status == '0') {
          return h(
            NIcon,
            {
              size: 20,
              depth: 3,
              class: 'pointer',
              color: '#064a9d',
              title: $t('Common.Approve'),
              onClick: () => onApprove(row)
            },
            () => h(EditOutlined)
          )
        }
        return h(
          NIcon,
          {
            size: 20,
            depth: 3,
            class: 'pointer',
            color: '#079d06',
            title: $t('Common.View'),
            onClick: () => onView(row)
          },
          () => h(EyeOutlined)
        )
      }
    }
  ]
})

// 操作 - 搜索
const onSearch = async () => {
  Message.success($t('Form.Search'))
}

const onView = (data) => {
  modal.value.init(data)
}
const onApprove = (data) => {
  modal.value.init(data)
}

const createTableData = () => {
  state.data = Array.apply(null, {
    length: Math.floor(Math.random() * 100) + 100
  }).map((_, index) => {
    let obj = {}
    columns.value.forEach(({ key }) => {
      if (key == 'period') {
        return Object.assign(obj, {
          startDate: '2022-01-01',
          endDate: '2022-04-30'
        })
      }
      if (key == 'total') {
        // 100 - 200
        return (obj[key] = Math.floor(Math.random() * (200 - 100 + 1) + 100))
      }
      if (key == 'status') {
        return (obj[key] = Math.floor(Math.random() * 4).toString())
      }
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
    if (state.model.code) {
      flag = flag && v.code.includes(state.model.code)
    }
    if (state.model.status) {
      flag = flag && v.status == state.model.status
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
    <NForm ref="formRef" inline :model="state.model" label-placement="left">
      <NFormItem :label="$t('Table.Name')">
        <NInput v-model:value="state.model.name" class="width-200" clearable />
      </NFormItem>
      <NFormItem :label="$t('Table.Employee #')">
        <NInput v-model:value="state.model.code" class="width-200" clearable />
      </NFormItem>
      <NFormItem :label="$t('Table.Status')">
        <NSelect
          v-model:value="state.model.status"
          :options="state.options"
          :placeholder="$t('Form.Please Choose')"
          class="width-200"
          clearable
        />
      </NFormItem>
      <NFormItem :label="$t('Table.Working Period')">
        <NDatePicker
          v-model:value="state.model.period"
          type="daterange"
          class="width-280"
          clearable
        />
      </NFormItem>
      <!--        <NGridItem :span="3">
          <NFormItem :label="$t('Form.Filters')">
            <NInput
              v-model:value="state.model.filters"
              :placeholder="$t('Form.Filters')"
              clearable
            />
          </NFormItem>
        </NGridItem>-->
      <NSpace>
        <NButton type="primary" @click="onSearch">
          {{ $t('Form.Search') }}
        </NButton>
        <!-- <NButton type="primary">
              {{ $t('Form.Export') }}
            </NButton> -->
      </NSpace>
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
    <TimeSheetModal ref="modal" />
  </div>
</template>

<style scoped lang="scss"></style>
