<template>
  <div class="page">
    <bpmn-template></bpmn-template>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.item {
  width: 50%;
  flex-shrink: 1;
}

.right {
  border-left: solid 1px #f6f6f7;
}
</style>