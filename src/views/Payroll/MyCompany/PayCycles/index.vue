<script setup>
import { useStore } from 'vuex'
import { NIcon, useMessage } from 'naive-ui'
import i18n from '@/locales/i18n'
import { computed, h, onBeforeMount, reactive, ref } from 'vue'
import { EditOutlined, EyeOutlined } from '@vicons/antd'
import { DataPagination, TableDataAPI } from '@/lib/utils'
import DialogForm from '@/components/Dialog/DialogForm.vue'

const store = useStore()
const Message = useMessage()
const $t = i18n.global.t

const DialogFormRef = ref(null)

onBeforeMount(() => {
  getTableData()
})

const state = reactive({
  tableLoading: false,
  tableData: [],
  formData: {
    name: null
  },
  options: []
})

const formRef = ref(null)

const pagination = reactive(new DataPagination())

const columns = computed(() => {
  return [
    { title: $t('Table.Pay Cycle'), key: 'PayCycle' },
    { title: $t('Table.First pay run start date'), key: 'startDate' },
    { title: $t('Table.First payment date'), key: 'paymentDate' },
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
              title: $t('Common.View'),
              onClick: () => onView(row)
            },
            () => h(EyeOutlined)
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
    type: 'PayCycles-Add'
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
    type: 'PayCycles-Edit',
    data
  })

  if (!result) return false

  let i = state.tableData.findIndex((item) => item.id === data.id)
  state.tableData.splice(i, 1, result)

  Message.success($t('Tips.Success'))
}

// 操作 - 查看
const onView = async (data) => {
  let { result } = await DialogFormRef.value.open({
    type: 'PayCycles-View',
    data
  })
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

  <DialogForm ref="DialogFormRef"></DialogForm>
</template>

<style scoped lang="scss"></style>
