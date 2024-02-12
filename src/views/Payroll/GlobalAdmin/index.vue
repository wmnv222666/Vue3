<script setup>
import { NButton, NIcon, useMessage } from 'naive-ui'
import { computed, h, onBeforeMount, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import i18n from '@/locales/i18n'
import { DeleteOutlined, EditOutlined, RedoOutlined } from '@vicons/antd'
import { useRouter, useRoute } from 'vue-router'
import DialogConfirm from '@/components/Dialog/DialogConfirm.vue'
import DialogForm from '@/components/Dialog/DialogForm.vue'
import { DataPagination, TableDataAPI } from '@/lib/utils'

const store = useStore()
const Message = useMessage()
const router = useRouter()
const route = useRoute()
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
    account: null,
    companyName: null,
    companyID: null,
    email: null,
    role: null
  },
  options: []
})

const formRef = ref(null)

const pagination = reactive(new DataPagination())

const columns = computed(() => {
  return [
    { title: $t('Table.Account'), key: 'account' },
    { title: $t('Table.Company Name'), key: 'companyName' },
    { title: $t('Table.Company ID'), key: 'companyID' },
    { title: $t('Table.Email'), key: 'email' },
    { title: $t('Table.Role'), key: 'role' },
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
              color: '#9d9a06',
              class: 'btn-icon',
              title: $t('Login.Reset Password'),
              onClick: () => onReset(row)
            },
            () => h(RedoOutlined)
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

// 操作 - 新增
const onAdd = async () => {
  let { result } = await DialogFormRef.value.open({
    type: 'GlobalAdmin-Add'
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
    type: 'GlobalAdmin-Edit',
    data
  })

  if (!result) return false

  let i = state.tableData.findIndex((item) => item.id === data.id)
  state.tableData.splice(i, 1, result)

  Message.success($t('Tips.Success'))
}

// 操作 - 重置密码
const onReset = async () => {
  let { result } = await DialogConfirmRef.value.open({
    type: 'Reset'
  })

  if (!result) return false
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
const onDelete = async (data) => {
  let { result } = await DialogConfirmRef.value.open({
    type: 'Delete'
  })

  if (!result) return false

  let i = state.tableData.findIndex((item) => item.id === data.id)
  state.tableData.splice(i, 1)

  Message.success($t('Tips.Delete Success'))
}

// 操作 - 搜索
const onSearch = async () => {
  Message.success($t('Form.Search'))
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
    <NFormItem :label="$t('Table.Company Name')" path="companyName">
      <NInput
        v-model:value="state.formData.companyName"
        :placeholder="$t('Form.Please Type')"
      ></NInput>
    </NFormItem>
    <NFormItem :label="$t('Table.Company ID')" path="companyID">
      <NInput
        v-model:value="state.formData.companyID"
        :placeholder="$t('Form.Please Type')"
      ></NInput>
    </NFormItem>
    <NFormItem :label="$t('Table.Account')" path="account">
      <NInput v-model:value="state.formData.account" :placeholder="$t('Form.Please Type')"></NInput>
    </NFormItem>
    <NFormItem :label="$t('Table.Email')" path="email">
      <NInput v-model:value="state.formData.email" :placeholder="$t('Form.Please Type')"></NInput>
    </NFormItem>
    <NButton type="primary" @click="onSearch">
      {{ $t('Form.Search') }}
    </NButton>
    <!-- margin-left: auto 最后一个元素靠右 -->
    <NButton style="margin-left: auto" type="primary" @click="onAdd">
      {{ $t('Common.Add') }}
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

  <DialogConfirm ref="DialogConfirmRef"></DialogConfirm>
  <DialogForm ref="DialogFormRef"></DialogForm>
</template>

<style scoped lang="scss"></style>
