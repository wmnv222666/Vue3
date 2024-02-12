<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <NBreadcrumb class="bg-active" separator=">">
    <NBreadcrumbItem v-for="(item, index) in router.currentRoute.value.matched" :key="index">
      {{ $t(`Menu.${item.name}`) }}
    </NBreadcrumbItem>
  </NBreadcrumb>
</template>

<style scoped lang="scss">
.n-breadcrumb {
  width: calc(100% + 20px);
  margin: -20px -20px 20px;
  padding: 0 10px 10px 30px;
  height: 36px;
  line-height: 36px;
  :deep(.n-breadcrumb-item) {
    .n-breadcrumb-item__link,
    .n-breadcrumb-item__separator {
      color: $COLOR_C;
    }
    &:last-child .n-breadcrumb-item__link {
      color: $COLOR_F;
    }
  }
}
</style>
