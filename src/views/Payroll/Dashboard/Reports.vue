<script setup></script>

<template>
  <div class="margin-bottom-10">{{ $t('Dashboard.Reports') }}</div>
  <NSpace>
    <NSkeleton width="1080px" height="70px" :animated="false" />
    <NSkeleton width="530px" height="320px" :animated="false" />
    <NSkeleton width="540px" height="320px" :animated="false" />
  </NSpace>
</template>

<style scoped lang="scss"></style>
