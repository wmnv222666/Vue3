<script setup>
import { NIcon, useMessage } from 'naive-ui'
import { EditOutlined, PlayCircleOutlined, DeleteOutlined } from '@vicons/antd'
import { reactive, computed, h, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import i18n from '@/locales/i18n'
import DialogConfirm from '@/components/Dialog/DialogConfirm.vue'

import { DownloadExcel, DataPagination, TableDataAPI } from '@/lib/utils'

const $t = i18n.global.t
const router = useRouter()
const Message = useMessage()

const DialogConfirmRef = ref(null)

onBeforeMount(() => {
  getTableData()
})

const state = reactive({
  tableLoading: false,
  tableData: [],
  formData: {
    name: null,
    employeeNo: null,
    employeeType: null,
    status: null,
    payCycle: null,
    entryTime: null,
    filters: null
  },
  options: []
})

const formRef = ref(null)

const pagination = reactive(new DataPagination())

const columns = computed(() => {
  return [
    { title: $t('Table.Name'), key: 'name' },
    { title: $t('Table.Gender'), key: 'gender' },
    { title: $t('Table.Employee #'), key: 'employee#' },
    { title: $t('Table.Pay Cycle'), key: 'payCycle' },
    { title: $t('Table.Employee Type'), key: 'employeeType' },
    { title: $t('Table.Department'), key: 'department' },
    { title: $t('Table.Status'), key: 'status' },
    { title: $t('Table.Entry Time'), key: 'entryTime' },
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
              color: '#869d06',
              class: 'btn-icon',
              title: $t('Common.Enabled'),
              onClick: () => onEnabled(row)
            },
            () => h(PlayCircleOutlined)
          ),
          h(
            NIcon,
            {
              size: 20,
              depth: 3,
              color: '#9d0618',
              class: 'btn-icon',
              title: $t('Common.Delete'),
              onClick: () => onDelete(row)
            },
            () => h(DeleteOutlined)
          )
        ]
      }
    }
  ]
})

const onAdd = () => {
  router.push({ name: 'EmployeeCreate' })
}
const onEdit = (row) => {
  router.push({ name: 'EmployeeCreate', params: row })
}

// 操作 - 禁用
const onEnabled = async () => {
  let { result } = await DialogConfirmRef.value.open({
    type: 'Enabled'
  })

  if (!result) return false

  Message.success($t('Tips.Enabled Success'))
}

// 操作 - 删除
const onDelete = async () => {
  let { result } = await DialogConfirmRef.value.open({
    type: 'Delete'
  })

  if (!result) return false

  Message.success($t('Tips.Delete Success'))
}

// 操作 - 搜索
const onSearch = async () => {
  Message.success($t('Form.Search'))
}

// 操作 - 导出
const onExport = async () => {
  let { result } = await DialogConfirmRef.value.open({
    type: 'Export'
  })

  if (!result) return false

  await DownloadExcel()

  Message.success($t('Tips.Success'))
}

// 获取 - 表格数据
const getTableData = async () => {
  state.tableLoading = true
  let { data } = await TableDataAPI(columns, pagination)
  state.tableLoading = false

  state.tableData = data.records
  pagination.itemCount = data.total
}

const onPageUpdate = (s) => {
  pagination.page = s
  getTableData()
}

const onPageSizeUpdate = (s) => {
  pagination.pageSize = s
  getTableData()
}
</script>

<template>
  <NForm ref="formRef" :model="state.formData" label-placement="left" inline>
    <NFormItem :label="$t('Table.Name')" path="name">
      <NInput v-model:value="state.formData.name" :placeholder="$t('Form.Please Type')"></NInput>
    </NFormItem>
    <NFormItem :label="$t('Table.Employee #')" path="employeeNo">
      <NSelect
        v-model:value="state.formData.employeeNo"
        :placeholder="$t('Form.Please Choose')"
        :options="state.options"
      ></NSelect>
    </NFormItem>
    <NFormItem :label="$t('Table.Employee Type')" path="employeeType">
      <NSelect
        v-model:value="state.formData.employeeType"
        :placeholder="$t('Form.Please Choose')"
        :options="state.options"
      ></NSelect>
    </NFormItem>
    <NFormItem :label="$t('Table.Status')" path="status">
      <NSelect
        v-model:value="state.formData.status"
        :placeholder="$t('Form.Please Choose')"
        :options="state.options"
      ></NSelect>
    </NFormItem>
    <NFormItem :label="$t('Table.Pay Cycle')" path="payCycle">
      <NSelect
        v-model:value="state.formData.payCycle"
        :placeholder="$t('Form.Please Choose')"
        :options="state.options"
      ></NSelect>
    </NFormItem>
    <NFormItem :label="$t('Table.Entry Time')" path="entryTime">
      <NDatePicker v-model:value="state.formData.entryTime" type="datetimerange" clearable />
    </NFormItem>
    <NFormItem>
      <NButton type="primary" @click="onSearch">{{ $t('Form.Search') }}</NButton>
      <NButton type="primary" @click="onExport">{{ $t('Form.Export') }}</NButton>
      <NButton type="primary" @click="onAdd">{{ $t('Common.Add') }}</NButton>
    </NFormItem>
  </NForm>
  <!--  <div class="flex between-center margin-bottom-24">
      <NInput v-model:value="state.formData.filters" :placeholder="$t('Form.Filters')"></NInput>
      <NButton margin-left-12" type="primary" @click="onAdd">{{
        $t('Form.Add New Employee')
      }}</NButton>
    </div>-->

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

  <DialogConfirm ref="DialogConfirmRef"></DialogConfirm>
</template>

<style scoped lang="scss">
.n-form-item {
  :deep(.n-form-item-blank) {
    min-width: 200px;
    margin-right: 10px;
  }
}

// .n-data-table {
//   height: calc(100vh - $NavHeight - 40px - 33px - 116px - 34px - 24px);
//   overflow: auto;
// }
</style>
