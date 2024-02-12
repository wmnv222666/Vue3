<script setup></script>

<template>
  <div class="margin-bottom-10">{{ $t('Dashboard.Time Sheets') }}</div>
  <NSpace>
    <NSkeleton width="710px" height="358px" :animated="false" />
    <NSpace vertical>
      <NSkeleton width="358px" height="65px" :animated="false" />
      <NSkeleton width="358px" height="65px" :animated="false" />
      <NSkeleton width="358px" height="65px" :animated="false" />
      <NSkeleton width="358px" height="65px" :animated="false" />
      <NSkeleton width="358px" height="65px" :animated="false" />
    </NSpace>
    <NSkeleton width="1080px" height="70px" :animated="false" />
  </NSpace>
</template>

<style scoped lang="scss"></style>
