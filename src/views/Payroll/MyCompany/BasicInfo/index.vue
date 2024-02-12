<script setup>
import { useStore } from 'vuex'
import { useMessage } from 'naive-ui'
import i18n from '@/locales/i18n'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const store = useStore()
const Message = useMessage()
const $t = i18n.global.t
const route = useRoute()

// 页面模式: 'View' | 'Edit
const state = reactive({
  pageMode: route.query.type || 'View',
  pageIndex: 'General'
})

// 表单
const formData = reactive({
  companyLogo: 'companyLogo',
  companyName: 'companyName',
  phoneNumber: 'phoneNumber',
  email: 'email',
  website: 'website',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  city: 'city',
  province: 'province',
  postCode: 'postCode',

  bankKey: 'bankKey',
  bankAccount: 'bankAccount',
  bankClientID: 'bankClientID',
  discount: 'discount',

  cra: 'cra',
  mrq: 'mrq',

  SAPServiceIP: 'SAPServiceIP',
  systemID: 'systemID',
  instanceNumber: 'instanceNumber',
  clientID: 'clientID',
  userName: 'userName',
  password: 'password'
})

const formRef = ref(null)

const lang = computed(() => store.state.lang)
const rules = computed(() => {
  return {}
})

const tabList = computed(() => {
  return [
    {
      name: $t('BasicInfo.General'),
      id: 'General'
    },
    {
      name: $t('BasicInfo.Bank Info'),
      id: 'BankInfo'
    },
    {
      name: $t('BasicInfo.Tax Details'),
      id: 'TaxDetails'
    },
    {
      name: $t('BasicInfo.Integration'),
      id: 'Integration'
    }
  ]
})

watch(lang, () => {
  formRef.value.restoreValidation()
})

const onSubmit = () => {
  onEnterViewMode()
}
const onEnterEditMode = () => {
  state.pageMode = 'Edit'
}
const onEnterViewMode = () => {
  state.pageMode = 'View'
}
</script>

<template>
  <NCard>
    <NForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="left"
      :label-width="'140px'"
    >
      <div class="margin-bottom-12">
        <template v-for="item in tabList">
          <NButton
            v-if="item.id === state.pageIndex"
            :key="item.id"
            color="#2888DF"
            class="width-120 margin-right-24"
          >
            {{ item.name }}
          </NButton>
          <NButton
            v-else
            :key="item.id + '-'"
            color="#A29D9D"
            class="width-120 margin-right-24"
            @click="state.pageIndex = item.id"
          >
            {{ item.name }}
          </NButton>
        </template>
      </div>

      <!--表单 【查看】-->
      <template v-if="state.pageMode === 'View'">
        <template v-if="state.pageIndex === 'General'">
          <NFormItem class="width-400" path="logo" :label="$t('Form.Company Logo')">
            <div>{{ formData.companyLogo }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Company Name')">
            <div>{{ formData.companyName }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Phone Number')">
            <div>{{ formData.phoneNumber }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Email')">
            <div>{{ formData.email }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Website')">
            <div>{{ formData.website }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Address Line 1')">
            <div>{{ formData.addressLine1 }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Address Line 2')">
            <div>{{ formData.addressLine2 }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.City')">
            <div>{{ formData.city }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Province')">
            <div>{{ formData.province }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Post Code')">
            <div>{{ formData.postCode }}</div>
          </NFormItem>
        </template>

        <template v-else-if="state.pageIndex === 'BankInfo'">
          <NFormItem class="width-400" path="logo" :label="$t('Form.Bank Key')">
            <div>{{ formData.bankKey }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Bank Account')">
            <div>{{ formData.bankAccount }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Bank Client ID')">
            <div>{{ formData.bankClientID }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Discount')">
            <div>{{ formData.discount }}</div>
          </NFormItem>
        </template>

        <template v-else-if="state.pageIndex === 'TaxDetails'">
          <NFormItem class="width-400" path="logo" :label="$t('Form.CRA')">
            <div>{{ formData.cra }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.MRQ')">
            <div>{{ formData.mrq }}</div>
          </NFormItem>
        </template>

        <template v-else-if="state.pageIndex === 'Integration'">
          <NFormItem class="width-400" path="logo" :label="$t('Form.SAP Service IP')">
            <div>{{ formData.SAPServiceIP }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.System ID')">
            <div>{{ formData.systemID }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Instance Number')">
            <div>{{ formData.instanceNumber }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Client ID')">
            <div>{{ formData.clientID }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.User Name')">
            <div>{{ formData.userName }}</div>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Password')">
            <div>{{ formData.password }}</div>
          </NFormItem>
        </template>

        <NFormItem :label="' '">
          <NButton class="width-100" type="primary" @click="onEnterEditMode">
            {{ $t('Common.Edit') }}
          </NButton>
        </NFormItem>
      </template>

      <!--表单 【编辑】-->
      <template v-if="state.pageMode === 'Edit'">
        <template v-if="state.pageIndex === 'General'">
          <NFormItem class="width-400" path="logo" :label="$t('Form.Company Logo')">
            <NInput
              clearable
              v-model:value="formData.companyLogo"
              :placeholder="$t('Form.Company Logo')"
            >
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Company Name')">
            <NInput
              clearable
              v-model:value="formData.companyName"
              :placeholder="$t('Form.Company Name')"
            >
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Phone Number')">
            <NInput
              clearable
              v-model:value="formData.phoneNumber"
              :placeholder="$t('Form.Phone Number')"
            >
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Email')">
            <NInput clearable v-model:value="formData.email" :placeholder="$t('Form.Email')">
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Website')">
            <NInput clearable v-model:value="formData.website" :placeholder="$t('Form.Website')">
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Address Line 1')">
            <NInput
              clearable
              v-model:value="formData.addressLine1"
              :placeholder="$t('Form.Address Line 1')"
            >
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Address Line 2')">
            <NInput
              clearable
              v-model:value="formData.addressLine2"
              :placeholder="$t('Form.Address Line 2')"
            >
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.City')">
            <NInput clearable v-model:value="formData.city" :placeholder="$t('Form.City')">
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Province')">
            <NInput clearable v-model:value="formData.province" :placeholder="$t('Form.Province')">
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Post Code')">
            <NInput clearable v-model:value="formData.postCode" :placeholder="$t('Form.Post Code')">
            </NInput>
          </NFormItem>
        </template>

        <template v-else-if="state.pageIndex === 'BankInfo'">
          <NFormItem class="width-400" path="logo" :label="$t('Form.Bank Key')">
            <NInput clearable v-model:value="formData.bankKey" :placeholder="$t('Form.Bank Key')">
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Bank Account')">
            <NInput
              clearable
              v-model:value="formData.bankAccount"
              :placeholder="$t('Form.Bank Account')"
            >
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Bank Client ID')">
            <NInput
              clearable
              v-model:value="formData.bankClientID"
              :placeholder="$t('Form.Bank Client ID')"
            >
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Discount')">
            <NInput clearable v-model:value="formData.discount" :placeholder="$t('Form.Discount')">
            </NInput>
          </NFormItem>
        </template>

        <template v-else-if="state.pageIndex === 'TaxDetails'">
          <NFormItem class="width-400" path="logo" :label="$t('Form.CRA')">
            <NInput clearable v-model:value="formData.cra" :placeholder="$t('Form.CRA')"> </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.MRQ')">
            <NInput clearable v-model:value="formData.mrq" :placeholder="$t('Form.MRQ')"> </NInput>
          </NFormItem>
        </template>

        <template v-else-if="state.pageIndex === 'Integration'">
          <NFormItem class="width-400" path="logo" :label="$t('Form.SAP Service IP')">
            <NInput
              clearable
              v-model:value="formData.SAPServiceIP"
              :placeholder="$t('Form.SAP Service IP')"
            >
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.System ID')">
            <NInput clearable v-model:value="formData.systemID" :placeholder="$t('Form.System ID')">
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Instance Number')">
            <NInput
              clearable
              v-model:value="formData.instanceNumber"
              :placeholder="$t('Form.Instance Number')"
            >
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Client ID')">
            <NInput clearable v-model:value="formData.clientID" :placeholder="$t('Form.Client ID')">
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.User Name')">
            <NInput clearable v-model:value="formData.userName" :placeholder="$t('Form.User Name')">
            </NInput>
          </NFormItem>

          <NFormItem class="width-400" path="logo" :label="$t('Form.Password')">
            <NInput clearable v-model:value="formData.password" :placeholder="$t('Form.Password')">
            </NInput>
          </NFormItem>
        </template>

        <NFormItem :label="' '">
          <NButton class="width-100 margin-right-16" type="primary" @click="onSubmit">
            {{ $t('Common.Submit') }}
          </NButton>
          <NButton class="width-100" type="primary" @click="onEnterViewMode">
            {{ $t('Common.Cancel') }}
          </NButton>
        </NFormItem>
      </template>
    </NForm>
  </NCard>
</template>

<style scoped lang="scss"></style>
