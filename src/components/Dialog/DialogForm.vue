<script setup>
import { reactive, ref, computed } from 'vue'
import i18n from '@/locales/i18n'
import { EventEmitter } from 'events'
import { useMessage } from 'naive-ui'
import { FormOutlined, PlusSquareOutlined, EyeOutlined } from '@vicons/antd'

const eventEmitter = new EventEmitter()
const Message = useMessage()
const $t = i18n.global.t
const formRef = ref(null)

const state = reactive({
  visible: false,
  type: 'PayCycles-Add',

  formData: {}
})

const info = computed(() => {
  let mapping = {
    'PayCycles-Add': {
      title: $t('Common.Add'),
      positiveText: $t('Common.Submit'),
      negativeText: $t('Common.Cancel'),
      formData: {
        PayCycle: null,
        startDate: null,
        paymentDate: null
      },
      rules: {
        PayCycle: {
          required: true,
          message: $t('Form.No Empty'),
          trigger: ['input', 'blur']
        }
      }
    },
    'PayCycles-Edit': {
      title: $t('Common.Edit'),
      positiveText: $t('Common.Submit'),
      negativeText: $t('Common.Cancel'),
      rules: {
        PayCycle: {
          required: true,
          message: $t('Form.No Empty'),
          trigger: ['input', 'blur']
        }
      }
    },
    'PayCycles-View': {
      title: $t('Common.View'),
      positiveText: $t('Common.Close'),
      negativeText: ''
    },

    'GlobalAdmin-Add': {
      title: $t('Common.Add'),
      positiveText: $t('Common.Submit'),
      negativeText: $t('Common.Cancel'),
      formData: {
        account: null,
        companyName: null,
        companyID: null,
        email: null,
        role: null
      },
      rules: {
        account: {
          required: true,
          message: $t('Form.No Empty'),
          trigger: ['input', 'blur']
        }
      }
    },
    'GlobalAdmin-Edit': {
      title: $t('Common.Edit'),
      positiveText: $t('Common.Submit'),
      negativeText: $t('Common.Cancel'),
      rules: {
        account: {
          required: true,
          message: $t('Form.No Empty'),
          trigger: ['input', 'blur']
        }
      }
    },

    'PayItems-Add': {
      title: $t('Common.Add'),
      positiveText: $t('Common.Submit'),
      negativeText: $t('Common.Cancel'),
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
      rules: {
        name: {
          required: true,
          message: $t('Form.No Empty'),
          trigger: ['input', 'blur']
        }
      }
    },
    'PayItems-Edit': {
      title: $t('Common.Edit'),
      positiveText: $t('Common.Submit'),
      negativeText: $t('Common.Cancel'),
      rules: {
        name: {
          required: true,
          message: $t('Form.No Empty'),
          trigger: ['input', 'blur']
        }
      }
    },

    'TimeReport-Add': {
      title: $t('Common.Add'),
      positiveText: $t('Common.Submit'),
      negativeText: $t('Common.Cancel'),
      formData: {},
      rules: {}
    },
    'TimeReport-Edit': {
      title: $t('Common.Edit'),
      positiveText: $t('Common.Submit'),
      negativeText: $t('Common.Cancel'),
      formData: {},
      rules: {}
    }
  }
  return mapping[state.type] || {}
})

const open = (options) => {
  state.type = options.type || 'PayCycles-Add'

  state.visible = true

  if (/Add$/.test(state.type)) {
    state.formData = {
      ...info.formData
    }
  } else if (/(Edit|View)$/.test(state.type)) {
    state.formData = {
      ...options.data
    }
  }

  return new Promise(async (resolve, reject) => {
    eventEmitter.once('close', ({ type }) => {
      if (type === 'success') return resolve({ result: state.formData })
      resolve({ result: false })
    })
  })
}

const onSubmit = async () => {
  await formRef.value.validate()

  eventEmitter.emit('close', {
    type: 'success'
  })
}

const onCancel = () => {
  eventEmitter.emit('close', {})
}


</script>

<template>
  <NModal
    v-model:show="state.visible"
    preset="dialog"
    :title="info.title"
    :positive-text="info.positiveText"
    :negative-text="info.negativeText"
    @positive-click="onSubmit"
    :on-after-leave="onCancel"
    :close-on-esc="false"
    :mask-closable="false"
  >
    <template #icon>
      <PlusSquareOutlined v-if="/Add$/.test(state.type)"></PlusSquareOutlined>
      <FormOutlined v-else-if="/Edit$/.test(state.type)"></FormOutlined>
      <EyeOutlined v-else-if="/View$/.test(state.type)"></EyeOutlined>
    </template>

    <NForm ref="formRef" :model="state.formData" :rules="info.rules" label-placement="left">
      <!--PayCycles-->
      <template v-if="/^(PayCycles-Add|PayCycles-Edit)$/.test(state.type)">
        <NFormItem :label="$t('Table.Pay Cycle')" path="PayCycle">
          <NInput v-model:value="state.formData.PayCycle" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.First pay run start date')" path="startDate">
          <NDatePicker
            v-model:formatted-value="state.formData.startDate"
            type="date"
            clearable
            value-format="yyyy-MM-dd"
          />
        </NFormItem>
        <NFormItem :label="$t('Table.First payment date')" path="paymentDate">
          <NDatePicker
            v-model:formatted-value="state.formData.paymentDate"
            type="date"
            clearable
            value-format="yyyy-MM-dd"
          />
        </NFormItem>
      </template>
      <template v-if="/^(PayCycles-View)$/.test(state.type)">
        <NFormItem :label="$t('Table.Pay Cycle')" path="PayCycle">
          <div>{{ state.formData.PayCycle }}</div>
        </NFormItem>
        <NFormItem :label="$t('Table.First pay run start date')" path="startDate">
          <div>{{ state.formData.startDate }}</div>
        </NFormItem>
        <NFormItem :label="$t('Table.First payment date')" path="paymentDate">
          <div>{{ state.formData.paymentDate }}</div>
        </NFormItem>
      </template>

      <!--PayItems-->
      <template v-if="/^(PayItems-Add|PayItems-Edit)$/.test(state.type)">
        <NFormItem :label="$t('Table.Pay Item Name')" path="name">
          <NInput v-model:value="state.formData.name" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Amount')" path="Amount">
          <NInput v-model:value="state.formData.Amount" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.QTY')" path="QTY">
          <NInput v-model:value="state.formData.QTY" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.UOM')" path="UOM">
          <NInput v-model:value="state.formData.UOM" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Calc.Tax')" path="CalcTax">
          <NInput v-model:value="state.formData.CalcTax" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Calc.Tax(Que)')" path="CalcTaxQue">
          <NInput v-model:value="state.formData.CalcTaxQue" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Calc.EI')" path="CalcEI">
          <NInput v-model:value="state.formData.CalcEI" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Calc.Ins Hours')" path="CalcInsHours">
          <NInput v-model:value="state.formData.CalcInsHours" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Calc.CPP/QPP')" path="CalcCPP">
          <NInput v-model:value="state.formData.CalcCPP" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Calc.EHT')" path="CalcEHT">
          <NInput v-model:value="state.formData.CalcEHT" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Calc.QHSF')" path="CalcQHSF">
          <NInput v-model:value="state.formData.CalcQHSF" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Calc.Vac')" path="CalcVac">
          <NInput v-model:value="state.formData.CalcVac" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Calc.QPIP')" path="CalcQPIP">
          <NInput v-model:value="state.formData.CalcQPIP" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Calc.VRSP')" path="CalcVRSP">
          <NInput v-model:value="state.formData.CalcVRSP" clearable></NInput>
        </NFormItem>
      </template>

      <!--GlobalAdmin-->
      <template v-if="/^(GlobalAdmin-Add|GlobalAdmin-Edit)$/.test(state.type)">
        <NFormItem :label="$t('Table.Account')" path="account">
          <NInput v-model:value="state.formData.account" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Company Name')" path="companyName">
          <NInput v-model:value="state.formData.companyName" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Company ID')" path="companyID">
          <NInput v-model:value="state.formData.companyID" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Email')" path="email">
          <NInput v-model:value="state.formData.email" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Role')" path="role">
          <NInput v-model:value="state.formData.role" clearable></NInput>
        </NFormItem>
      </template>

      <!--GlobalAdmin-->
      <template v-if="/^(TimeReport-Add|TimeReport-Edit)$/.test(state.type)">
        <NFormItem :label="$t('Table.Cycle')" path="PayCycle">
          <NInput v-model:value="state.formData.PayCycle" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Porid')" path="period">
          <NInput v-model:value="state.formData.period" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Pay Day')" path="PayDay">
          <NInput v-model:value="state.formData.PayDay" clearable></NInput>
        </NFormItem>
        <NFormItem :label="$t('Table.Status')" path="status">
          <NInput v-model:value="state.formData.status" clearable></NInput>
        </NFormItem>
      </template>
    </NForm>
  </NModal>
</template>

<style scoped lang="scss"></style>
