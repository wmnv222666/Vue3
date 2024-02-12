<script setup>
import { reactive, computed, ref, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import i18n from '@/locales/i18n'
import { useMessage } from 'naive-ui'

const $t = i18n.global.t
const route = useRoute()
const router = useRouter()
const Message = useMessage()
const store = useStore()

const formRef = ref(null)

const state = reactive({
  currentId: 1,
  btnList: [
    { id: 1, name: $t('Form.Personal Data') },
    { id: 2, name: $t('Form.Address') },
    { id: 3, name: $t('Form.Employment') },
    { id: 4, name: $t('Form.Bank Details') },
    { id: 5, name: $t('Form.Time of Policy') }
  ],
  formData: {
    title: null,
    firstName: null,
    middleName: null,
    lastName: null,
    gender: null,
    sinNumber: null,
    phone: null,
    birthday: null,
    nationality: null
  },
  optGender: store.getters['common/gender']
})

const rules = computed(() => {
  return {
    firstName: [
      {
        required: true,
        message: $t('Form.Please Type'),
        trigger: ['input', 'blur']
      }
    ],
    lastName: [
      {
        required: true,
        message: $t('Form.Please Type'),
        trigger: ['input', 'blur']
      }
    ]
  }
})

onBeforeMount(() => {
  state.formData.firstName = route.params.name
  state.formData.middleName = route.params.name
  state.formData.lastName = route.params.name
  state.formData.sinNumber = route.params['employee#']
})

const onSave = async () => {
  await formRef.value.validate()

  await router.push({ name: 'EmployeeList' })

  Message.success($t('Tips.Success'))
}

const onCancel = () => {
  router.back()
}
</script>

<template>
  <NCard class="container" :header-style="{ padding: 0 }">
    <template #header>
      <div :style="{ background: '#7DB9DE' }">
        <i class="font-13 text-f margin-left-28">{{ $t('Form.Basic Information') }}</i>
      </div>
    </template>
    <NSpace class="padding-top-32" :size="42">
      <NButton
        class="width-120"
        :color="item.id === state.currentId ? '#2888DF' : '#D9D4D4'"
        v-for="item in state.btnList"
        :key="item.id"
        @click="() => (state.currentId = item.id)"
        >{{ item.name }}</NButton
      >
    </NSpace>
    <div class="content">
      <NForm
        ref="formRef"
        :model="state.formData"
        :rules="rules"
        :label-width="160"
        label-placement="left"
        require-mark-placement="left"
      >
        <NFormItem :label="$t('Form.Title')" path="title">
          <NInput v-model:value="state.formData.title"></NInput>
        </NFormItem>
        <NFormItem :label="$t('Form.First Name')" path="firstName">
          <NInput v-model:value="state.formData.firstName"></NInput>
        </NFormItem>
        <NFormItem :label="$t('Form.Middle Name')" path="middleName">
          <NInput v-model:value="state.formData.middleName"></NInput>
        </NFormItem>
        <NFormItem :label="$t('Form.Last Name')" path="lastName">
          <NInput v-model:value="state.formData.lastName"></NInput>
        </NFormItem>
        <NFormItem :label="$t('Form.Gender')" path="gender">
          <NSelect v-model:value="state.formData.gender" :options="state.optGender" />
        </NFormItem>
        <NFormItem :label="$t('Form.SIN Number')" path="sinNumber">
          <NInput v-model:value="state.formData.sinNumber"></NInput>
        </NFormItem>
        <NFormItem :label="$t('Form.Phone')" path="phone">
          <NInput v-model:value="state.formData.phone"></NInput>
        </NFormItem>
        <NFormItem :label="$t('Form.Date of Birth')" path="birthday">
          <NDatePicker v-model:value="state.formData.birthday" type="date" clearable />
        </NFormItem>
        <NFormItem :label="$t('Form.Nationality')" path="nationality">
          <NInput v-model:value="state.formData.nationality"></NInput>
        </NFormItem>
        <NFormItem class="margin-left-100">
          <NSpace class="margin-left-100">
            <NButton type="primary" size="small" @click="onCancel">{{ $t('Form.Cancel') }}</NButton>
            <NButton type="primary" size="small" @click="onSave">{{ $t('Form.Save') }}</NButton>
          </NSpace>
        </NFormItem>
      </NForm>
    </div>
  </NCard>
</template>

<style lang="scss" scoped>
.content {
  padding: 32px 127px 32px 32px;

  .n-input,
  .n-date-picker,
  .n-select {
    width: 365px;
  }
}
</style>
