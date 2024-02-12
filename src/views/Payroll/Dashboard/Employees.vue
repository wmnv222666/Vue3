<script setup></script>

<template>
  <div class="margin-bottom-10">{{ $t('Dashboard.Employees') }}</div>
  <NSpace vertical>
    <NSkeleton height="40px" width="33%" :animated="false" />
    <NSkeleton height="40px" width="44%" :animated="false" />
    <NSkeleton height="40px" width="66%" :animated="false" />
    <NSkeleton height="40px" :animated="false" />
    <NSkeleton height="40px" :animated="false" />
    <NSkeleton height="40px" width="50%" :animated="false" />
  </NSpace>
</template>

<style scoped lang="scss"></style>
