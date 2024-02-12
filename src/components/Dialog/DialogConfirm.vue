<script setup>
import { reactive, ref, computed } from 'vue'
import i18n from '@/locales/i18n'
import { EventEmitter } from 'events'
import { useDialog } from 'naive-ui'

const eventEmitter = new EventEmitter()
const dialog = useDialog()

const $t = i18n.global.t

const state = reactive({
  visible: false,
  type: 'Delete'
})

const info = computed(() => {
  let mapping = {
    Delete: {
      type: 'dialog',
      title: $t('Tips.Tips'),
      content: $t('Tips.Delete or Not'),
      positiveText: $t('Common.Confirm'),
      negativeText: $t('Common.Cancel')
    },
    Enabled: {
      type: 'dialog',
      title: $t('Tips.Tips'),
      content: $t('Tips.Enabled or Not'),
      positiveText: $t('Common.Confirm'),
      negativeText: $t('Common.Cancel')
    },
    Export: {
      type: 'dialog',
      title: $t('Tips.Tips'),
      content: $t('Tips.Export or Not'),
      positiveText: $t('Common.Confirm'),
      negativeText: $t('Common.Cancel')
    },
    Reset: {
      type: 'dialog',
      title: $t('Tips.Tips'),
      content: $t('Tips.Reset Password or Not'),
      positiveText: $t('Common.Confirm'),
      negativeText: $t('Common.Cancel')
    }
  }
  return mapping[state.type] || {}
})

const open = (options) => {
  state.type = options.type || 'Delete'

  if (info.value.type === 'dialog') {
    dialog.warning({
      title: info.value.title,
      content: info.value.content,
      positiveText: info.value.positiveText,
      negativeText: info.value.negativeText,
      closeOnEsc: false,
      onPositiveClick: () => onSubmit(),
      onNegativeClick: () => onCancel(),
      onClose: () => onCancel(),
      onMaskClick: () => onCancel()
    })
  } else {
    state.visible = true
  }

  return new Promise(async (resolve, reject) => {
    eventEmitter.once('close', ({ type }) => {
      if (type === 'success') return resolve({ result: true })
      resolve({ result: false })
    })
  })
}

const onSubmit = () => {
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
    :content="info.content"
    :positive-text="info.positiveText"
    :negative-text="info.negativeText"
    @positive-click="onSubmit"
    :on-after-leave="onCancel"
  ></NModal>
</template>

<style scoped lang="scss"></style>
