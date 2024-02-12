<script setup>
import { NIcon, useMessage } from 'naive-ui'
import { computed, h, onBeforeMount, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import i18n from '@/locales/i18n'
import { DeleteOutlined } from '@vicons/antd'
import DialogConfirm from '@/components/Dialog/DialogConfirm.vue'
import { DataPagination, TableDataAPI } from '@/lib/utils'

const store = useStore()
const Message = useMessage()
const $t = i18n.global.t

const DialogConfirmRef = ref(null)

onBeforeMount(() => {
  getTableData()
})

const state = reactive({
  tableLoading: false,
  tableData: []
})

const pagination = reactive(new DataPagination())

const columns = computed(() => {
  return [
    { title: $t('Table.Pay Item Name'), key: 'name' },
    { title: $t('Table.Amount'), key: 'Amount' },
    { title: $t('Table.QTY'), key: 'QTY' },
    { title: $t('Table.UOM'), key: 'UOM' },
    { title: $t('Table.Calc.Tax'), key: 'Calc' },
    { title: $t('Table.Calc.Tax(Que)'), key: 'Calc' },
    { title: $t('Table.Calc.EI'), key: 'Calc' },
    { title: $t('Table.Calc.Ins Hours'), key: 'Calc' },
    { title: $t('Table.Calc.CPP/QPP'), key: 'Calc' },
    { title: $t('Table.Calc.EHT'), key: 'Calc' },
    { title: $t('Table.Calc.QHSF'), key: 'Calc' },
    { title: $t('Table.Calc.Vac'), key: 'Calc' },
    { title: $t('Table.Calc.QPIP'), key: 'Calc' },
    { title: $t('Table.Calc.VRSP'), key: 'Calc' },

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

// 操作 - 删除
const onDelete = async () => {
  let { result } = await DialogConfirmRef.value.open({
    type: 'Delete'
  })

  if (!result) return false

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

<style scoped></style>
