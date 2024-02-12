<script setup>
import { toRefs, reactive, ref, h, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useMessage } from 'naive-ui'
const props = defineProps({
  editMsg: {
    type: Object,
    default: () => {}
  },
  title: { type: String, default: () => '' } //判断是创建还是编辑
})
const { title, editMsg } = toRefs(props)
const loadingRef = ref(false) //btn状态
const message = useMessage() //message提示
const store = useStore()
const rules = {
  permission_name: { required: true, message: 'Please enter a name', trigger: 'blur' }
}
const formRef = ref() //ref绑定dom元素
const PAGE_LIST = ['skip', 'limit']
const QUERY_LIST = ['id', 'permission name']
const searchForm = ref({
  skip: 0, // as page-index
  limit: 300 // as page-size
})

const routerList = computed(() => {
  return store.state.PermissionStore.routerList
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
const formMsg = reactive({
  addFrom: {
    permission_name: '', //输入姓名
    id: ''
  }
})
const emit = defineEmits({
  backUpdate: null, //成功更新回调
  backHandler: null //返回
})
//TODO 按钮事件
const handlerClick = () => {
  if (title.value === 'Create') {
    creatHandler()
  } else {
    updateHandler() // 编辑
  }
}
// TODO - 创建提交
const creatHandler = () => {
  if (pageData.checkData.length === 0) {
    message.info('Please select route！')
    return
  }
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        loadingRef.value = true
        const response = await store.dispatch('PermissionStore/createPermissions', {
          permission_name: formMsg.addFrom.permission_name
        })
        const selectedRouteObjList = []
        pageData.checkData.forEach((element) => {
          selectedRouteObjList.push({ permission_id: response.id, route_id: element })
        })
        await store.dispatch('PermissionStore/updateSelectedRoutes', selectedRouteObjList)
        emit('backUpdate')
        message.success('Creating a successful!')
        loadingRef.value = false
      } catch (e) {
        loadingRef.value = false
      }
    } else {
      message.error('Please enter a name')
      loadingRef.value = false
    }
  })
}
// 返回
const backHandler = () => {
  emit('backHandler')
}
// TODO-编辑提交
const updateHandler = async () => {
  if (pageData.checkData.length === 0) {
    message.info('Please select route！')
  } else {
    // update selected routes
    try {
      loadingRef.value = true
      const payload = ref({
        id: formMsg.addFrom.id,
        permission_name: formMsg.addFrom.permission_name
      })
      await store.dispatch('PermissionStore/updatePermission', formMsg.addFrom)
      const selectedRouteObjList = []
      pageData.checkData.forEach((element) => {
        selectedRouteObjList.push({ permission_id: formMsg.addFrom.id, route_id: element })
      })
      await store.dispatch('PermissionStore/updateSelectedRoutes', selectedRouteObjList)
      emit('backUpdate')
      message.success('Edit permission successfully')
      loadingRef.value = false
    } catch (e) {
      loadingRef.value = false
    }
  }
}
let tableLoading = ref(false)
// 列表-表头
const columns = [
  {
    type: 'selection',
    fixed: 'left',
    width: 10
  },
  {
    title: 'Id',
    key: 'id',
    width: 40
  },
  {
    title: 'Name',
    key: 'name',
    width: 80
  },
  {
    title: 'Text',
    key: 'text',
    width: 80
  },
  {
    title: 'Path',
    key: 'path',
    width: 140
  },

  {
    title: 'Parent Id',
    key: 'parent',
    width: 40
  }
]
// 编辑集合
const pageData = reactive({
  checkData: [] //表格选中集合
})
// 选中函数
const handleCheck = (rowKeys) => {
  pageData.checkData = rowKeys
}
const total = computed(() => {
  return store.state.PermissionStore.routeTotal
})
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [2, 10, 20, 30, 50, 100],
  onChange: (page) => {
    pagination.page = page
  },
  onUpdatePageSize: async (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
  prefix({ itemCount }) {
    return `Total is ${total.value}.`
  }
})

// 加载详情-关于路由对用的接口
const getRouterList = async () => {
  tableLoading.value = !tableLoading.value
  try {
    // await store.dispatch('RouteStore/fetchAllRoutes', searchStr.value)
    // await store.dispatch('RouteStore/getRoutesByPermissionId', editMsg.value.id)
    pageData.checkData = store.state.RouteStore.routeListByPermissionId
    tableLoading.value = !tableLoading.value
  } catch (e) {
    tableLoading.value = !tableLoading.value
  }
}
onMounted(async () => {
  console.log('开始')
  if (title.value == 'Edit') {
    formMsg.addFrom.permission_name = editMsg.value.permission_name
    formMsg.addFrom.id = editMsg.value.id + ''
  }
  await getRouterList()
})
</script>
<template>
  <div class="container">
    <!-- 添加 -->
    <div class="container-header">
      <n-form ref="formRef" inline :model="formMsg.addFrom" :rules="rules">
        <n-form-item label="Permission Name" path="permission_name" class="header-right">
          <n-input
            v-model:value="formMsg.addFrom.permission_name"
            placeholder="Please enter a name"
          />
        </n-form-item>
        <n-form-item label="ID" v-if="title == 'Edit'">
          <n-input :disabled="true" :value="formMsg.addFrom.id" placeholder="" />
        </n-form-item>
      </n-form>
    </div>
    <!--    编辑-->
    <div>
      <n-data-table
        :data="routerList"
        :columns="columns"
        :pagination="pagination"
        :max-height="400"
        :scroll-x="650"
        :loading="tableLoading"
        :row-key="(row) => row.id"
        v-model:checked-row-keys="pageData.checkData"
        @update:checked-row-keys="handleCheck"
        size="small"
      />
      <n-divider vertical />
    </div>
    <!--    底部-->
    <div class="footer">
      <n-button type="text" @click="backHandler" size="large">Cancel</n-button>
      &nbsp; &nbsp; &nbsp;
      <n-button type="primary" @click="handlerClick" :loading="loadingRef" size="large">
        {{ title == 'Edit' ? 'Save' : 'Save' }}
      </n-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  padding-top: 5px;
}

.footer {
  text-align: right;
}
</style>
