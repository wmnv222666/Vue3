<script setup>
import { useStore } from 'vuex'
import themeOverrides from '@/styles/theme.js'

const { getters } = useStore()
</script>

<template>
  <NConfigProvider
    :abstract="true"
    :locale="getters.languageObj.locale"
    :date-locale="getters.languageObj.dateLocale"
    :theme-overrides="themeOverrides"
  >
    <NMessageProvider>
      <NDialogProvider>
        <router-view></router-view>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style></style>
