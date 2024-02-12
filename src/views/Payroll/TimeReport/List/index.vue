<script setup>
import { useStore } from 'vuex'
import { NButton, NIcon, useMessage } from 'naive-ui'
import i18n from '@/locales/i18n'
import { computed, h, onBeforeMount, ref, reactive } from 'vue'
import { DeleteOutlined, EditOutlined, PlayCircleOutlined } from '@vicons/antd'
import { DataPagination } from '@/lib/utils'
import DialogForm from '@/components/Dialog/DialogForm.vue'

const store = useStore()
const Message = useMessage()
const $t = i18n.global.t
const DialogFormRef = ref(null)

onBeforeMount(() => {
  createTableData()
  loadData()
})

const state = reactive({
  tableLoading: false,
  data: [],
  tableData: [],
  options: [
    { label: $t('Select.Saved'), value: '0' },
    { label: $t('Select.To approve'), value: '1' },
    { label: $t('Select.Approve'), value: '2' },
    { label: $t('Select.Pending'), value: '3' }
  ],
  model: {
    payCycle: '',
    payPorid: '',
    status: null,
    payDay: ''
  }
})

const formRef = ref(null)

const pagination = reactive(new DataPagination())

const columns = computed(() => {
  return [
    { title: $t('Table.Pay Cycle'), key: 'PayCycle' },
    {
      title: $t('Table.Porid'),
      key: 'period',
      render: (row) => {
        return h('span', `${row.startDate} - ${row.endDate}`)
      }
    },
    {
      title: $t('Table.Pay Day'),
      key: 'PayDay',
      render: (row) => {
        return h('span', `${row.endDate}`)
      }
    },
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
        return [
          h(
            NIcon,
            {
              size: 20,
              depth: 3,
              color: '#064a9d',
              class: 'btn-icon',
              title: $t('Common.Edit'),
              onClick: () => onEdit(row)
            },
            () => h(EditOutlined)
          ),
          h(
            NIcon,
            {
              size: 20,
              depth: 3,
              color: '#079d06',
              class: 'btn-icon',
              title: $t('Common.Run'),
              onClick: () => onRun(row)
            },
            () => h(PlayCircleOutlined)
          )
        ]
      }
    }
  ]
})

// 操作 - 搜索
const onSearch = async () => {
  Message.success($t('Form.Search'))
}


// 操作 - 新增
const onAdd = async () => {
  let { result } = await DialogFormRef.value.open({
    type: 'TimeReport-Add'
  })

  if (!result) return false
  state.tableData.unshift({
    id: Date.now(),
    ...result
  })
  state.tableData.pop()

  Message.success($t('Tips.Success'))
}

// 操作 - 编辑
const onEdit = async (data) => {
  let { result } = await DialogFormRef.value.open({
    type: 'TimeReport-Edit',
    data
  })

  if (!result) return false

  let i = state.tableData.findIndex((item) => item.id === data.id)
  state.tableData.splice(i, 1, result)

  Message.success($t('Tips.Success'))
}

const onRun = (data) => {
  Message.info(`${$t('Menu.TimeReport')} ${$t('Menu.TimeReportList')} ${$t('Common.Run')}`)
}

const createTableData = () => {
  state.data = Array.apply(null, {
    length: Math.floor(Math.random() * 100) + 100
  }).map((_, index) => {
    let obj = {}
    columns.value.forEach(({ key }) => {
      if (key === 'period') {
        return Object.assign(obj, {
          startDate: '2022-01-01',
          endDate: '2022-04-30'
        })
      }
      if (key === 'total') {
        // 100 - 200
        return (obj[key] = Math.floor(Math.random() * (200 - 100 + 1) + 100))
      }
      if (key === 'status') {
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
      <NFormItem :label="$t('Table.Pay Cycle')">
        <NInput v-model:value="state.model.payCycle" class="width-200" clearable />
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
      <NFormItem :label="$t('Table.Porid')">
        <NDatePicker
          v-model:value="state.model.payPorid"
          type="daterange"
          class="width-280"
          clearable
        />
      </NFormItem>
      <NButton type="primary" @click="onSearch">
        {{ $t('Form.Search') }}
      </NButton>
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

    <DialogForm ref="DialogFormRef"></DialogForm>
  </div>
</template>

<style scoped lang="scss"></style>
