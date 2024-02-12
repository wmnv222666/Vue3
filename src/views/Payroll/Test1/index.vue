<script setup>
import { reactive, onMounted, h, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { NButton, useDialog, useMessage } from 'naive-ui'
import Index from '@/components/test1/index.vue'
import { renderIcon } from '@/utils'
import { EditOutlined, DeleteOutlined } from '@vicons/antd'
//import { SearchOutline } from '@vicons/ionicons5'

const dialog = useDialog()
const Dialog = ref('')
const message = useMessage()
const store = useStore()
const loading = ref(false)
const QUERY_LIST = ['id', 'permission_name']
const PAGE_LIST = ['skip', 'limit']
const searchForm = ref({
  id: '',
  permission_name: '',
  skip: 0, // as page-index
  limit: 300 // as page-size
})
const searchStr = computed(() => {
  let results = ''
  for (const key in searchForm.value) {
    if (QUERY_LIST.includes(key) && searchForm.value[key]) {
      results = results
        ? `${key}=${searchForm.value[key]}&${results}`
        : `${key}=${searchForm.value[key]}`
    }
    if (PAGE_LIST.includes(key)) {
      results = results
        ? `${results}&$${key}=${searchForm.value[key]}`
        : `$${key}=${searchForm.value[key]}`
    }
  }
  if (results) {
    results = `?${results}`
  }
  return results
})
const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [2, 10, 20, 30, 50, 100],
  onChange: (page) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  },
  prefix({ itemCount }) {
    return `Total is ${total.value}.`
  }
})
const permissionList = computed(() => {
  return store.state.PermissionStore.permissionList
})
const total = computed(() => {
  return store.state.PermissionStore.total
})
const columns = [
  {
    title: 'ID',
    key: 'id',
    align: 'left'
  },
  {
    title: 'Permission Name',
    key: 'permission_name',
    align: 'left'
  },
  {
    title: 'Operation',
    key: 'operation',
    align: 'left',
    render: (row) => {
      return [
        h(
          NButton,
          {
            size: 'small',
            style: { 'margin-left': '4px', 'margin-right': '8px' },
            type: 'primary',
            title: 'Edit',
            circle: true,
            onClick: () => edit(row)
          },
          { default: renderIcon(EditOutlined) }
        ),
        h(
          NButton,
          {
            size: 'small',
            style: { 'margin-left': '8px', 'margin-right': '4px' },
            type: 'error',
            title: 'Delete',
            circle: true,
            onClick: () => remove(row)
          },
          { default: renderIcon(DeleteOutlined) }
        )
      ]
    }
  }
]
const reloadTableData = async () => {
  loading.value = !loading.value
  try {
    //await store.dispatch('PermissionStore/getPermissions', searchStr.value)
    loading.value = !loading.value
  } catch (err) {
    console.log(err)
    loading.value = !loading.value
  }
}
onMounted(async () => {
  await reloadTableData()
})
const remove = (row) => {
  if (!row.id) return
  const d = dialog.warning({
    title: 'Confirm',
    content: `Permissions with id [ ${row.id} ] will be removed?`,
    positiveText: 'Confirm',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      d.loading = true
      try {
        //{ id: row.id }也可以直接写row.id
        //await store.dispatch('PermissionStore/deletePermissions', { id: row.id })
        message.success('Delete user successfully')
        await reloadTableData()
      } catch (err) {
        console.log(err)
      } finally {
        d.loading = false
      }
    }
  })
}

let editMsg = reactive({
  detail: {
    id: '',
    permission_name: ''
  }
})
const edit = (row) => {
  editMsg.detail.id = row.id
  editMsg.detail.permission_name = row.permission_name
  Dialog.value = 'Edit'
  showModal.value = !showModal.value
}
// TODO-创建
const showModal = ref(false)
const addHandler = () => {
  Dialog.value = 'Create'
  editMsg.detail = {}
  showModal.value = !showModal.value
}
//查询
const searchHandler = (e) => {
  e.preventDefault()
  paginationReactive.page = 1
  reloadTableData()
}
// 更新函数
const backUpdate = async () => {
  showModal.value = !showModal.value
  await reloadTableData()
}
</script>
<template>
  <div class="page-container">
    <!--    头部-->
    <div class="page-container-header">
      <n-form inline mode="searchForm" label-placement="left" size="large" :show-feedback="false">
        <n-form-item label="ID" path="id">
          <n-input v-model:value="searchForm.id" placeholder="ID" clearable />
        </n-form-item>
        <n-form-item label="Permission Name" path="permission name">
          <n-input
            v-model:value="searchForm.permission_name"
            placeholder="Permission Name"
            clearable
          />
        </n-form-item>

        <n-form-item>
          <n-button type="primary" @click="searchHandler" size="large">
            <template #icon>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
            Search
          </n-button>
        </n-form-item>
      </n-form>

      <div class="page-container-header-right">
        <n-divider vertical />
        <n-button type="primary" @click="addHandler" size="large">New</n-button>
      </div>
    </div>

    <div class="page-container-content">
      <n-data-table
        striped
        :loading="loading"
        ref="table"
        :columns="columns"
        :data="permissionList"
        :pagination="paginationReactive"
        size="small"
      />
    </div>

    <!--  弹框-->
    <n-modal
      v-model:show="showModal"
      :style="{ width: Dialog == 'Edit' ? '76% !important' : '76% !important' }"
      preset="card"
      class="custom-card"
      :title="Dialog == 'Edit' ? 'Edit Permissions' : 'New Permissions'"
    >
      <permission-form
        v-if="showModal"
        :title="Dialog"
        :edit-msg="editMsg.detail"
        @back-update="backUpdate"
        @back-handler="showModal = false"
      ></permission-form>
    </n-modal>
  </div>
</template>
<style lang="scss" scoped>
.page-container {
  height: 100%;
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  .page-container-header {
    padding: 14px 10px 12px 0;
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
}
.n-form.n-form--inline {
  width: 80%;
  margin-left: 8px;
}
.page-container-header-right {
  max-width: 20%;
  padding-right: 12px;
}

.page-container-content {
  flex: 1;
  margin-top: 0px;
  margin-right: 16px;
}
</style>
