<script setup>
import { NIcon, useMessage } from 'naive-ui'
import { computed, h, onBeforeMount, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import i18n from '@/locales/i18n'
import { DeleteOutlined } from '@vicons/antd'
import DialogConfirm from '@/components/Dialog/DialogConfirm.vue'
import DialogForm from '@/components/Dialog/DialogForm.vue'
import { DataPagination, TableDataAPI } from '@/lib/utils'

const store = useStore()
const Message = useMessage()
const $t = i18n.global.t

const DialogConfirmRef = ref(null)
const DialogFormRef = ref(null)

onBeforeMount(() => {
  getTableData()
})

const state = reactive({
  tableLoading: false,
  tableData: [],
  formData: {
    name: null,
    Amount: null,
    QTY: null,
    UOM: null,
    CalcTax: null,
    CalcTaxQue: null,
    CalcEI: null,
    CalcInsHours: null,
    CalcCPP: null,
    CalcEHT: null,
    CalcQHSF: null,
    CalcVac: null,
    CalcQPIP: null,
    CalcVRSP: null
  },
  options: []
})

const formRef = ref(null)

const pagination = reactive(new DataPagination())

const columns = computed(() => {
  return [
    { title: $t('Table.Pay Item Name'), key: 'name' },
    { title: $t('Table.Amount'), key: 'Amount' },
    { title: $t('Table.QTY'), key: 'QTY' },
    { title: $t('Table.UOM'), key: 'UOM' },
    { title: $t('Table.Calc.Tax'), key: 'CalcTax' },
    { title: $t('Table.Calc.Tax(Que)'), key: 'CalcTaxQue' },
    { title: $t('Table.Calc.EI'), key: 'CalcEI' },
    { title: $t('Table.Calc.Ins Hours'), key: 'CalcInsHours' },
    { title: $t('Table.Calc.CPP/QPP'), key: 'CalcCPP' },
    { title: $t('Table.Calc.EHT'), key: 'CalcEHT' },
    { title: $t('Table.Calc.QHSF'), key: 'CalcQHSF' },
    { title: $t('Table.Calc.Vac'), key: 'CalcVac' },
    { title: $t('Table.Calc.QPIP'), key: 'CalcQPIP' },
    { title: $t('Table.Calc.VRSP'), key: 'CalcVRSP' },

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

// 操作 - 搜索
const onSearch = async () => {
  Message.success($t('Form.Search'))
}

// 操作 - 新增
const onAdd = async () => {
  let { result } = await DialogFormRef.value.open({
    type: 'PayItems-Add'
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
    type: 'PayItems-Edit',
    data
  })

  if (!result) return false

  let i = state.tableData.findIndex((item) => item.id === data.id)
  state.tableData.splice(i, 1, result)

  Message.success($t('Tips.Success'))
}

// 操作 - 删除
const onDelete = async (data) => {
  let { result } = await DialogConfirmRef.value.open({
    type: 'Delete'
  })

  if (!result) return false

  let i = state.tableData.findIndex((item) => item.id === data.id)
  state.tableData.splice(i, 1)

  Message.success($t('Tips.Delete Success'))
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
    <NFormItem :label="$t('Table.Pay Cycle')" path="name">
      <NInput v-model:value="state.formData.name" :placeholder="$t('Form.Please Type')"></NInput>
    </NFormItem>
    <NFormItem>
      <NButton type="primary" @click="onSearch">{{ $t('Form.Search') }}</NButton>
    </NFormItem>
    <NFormItem style="margin-left: auto">
      <NButton type="primary" @click="onAdd">{{ $t('Common.Add') }}</NButton>
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

  <DialogConfirm ref="DialogConfirmRef"></DialogConfirm>
  <DialogForm ref="DialogFormRef"></DialogForm>
</template>

<style scoped></style>
