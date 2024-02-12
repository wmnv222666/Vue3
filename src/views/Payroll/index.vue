<script setup>
import NavMenu from '@/components/Common/NavMenu.vue'
import Breadcrumb from '@/components/Common/Breadcrumb.vue'
import companyNtLogo from '@/assets/companyNtLogo.png'
import companyNtLogo_short from '@/assets/companyNtLogo_short.png'
import { computed, reactive, h, ref } from 'vue'
import * as antd from '@vicons/antd'
import * as tabler from '@vicons/tabler'
import * as carbon from '@vicons/carbon'
import { NIcon, useMessage } from 'naive-ui'
import i18n from '@/locales/i18n'
import { useStore } from 'vuex'
import router from '@/router'

const store = useStore()
const Message = useMessage()
const $t = i18n.global.t

const renderIcon = (item) => {
  return h(NIcon, null, {
    default: () => h(icons.value[item.iconName || 'MenuOutlined'])
  })
}

const state = reactive({
  activeMenu: (router.currentRoute.value.matched[2] || router.currentRoute.value.matched[1]).name
})

const collapsed = ref(false)

const icons = computed(() => ({ ...antd, ...tabler, ...carbon }))
const permissionList = computed(() => store.getters['system/permissionList'])
const menuOptions = computed(() => {
  return permissionList.value.map((a) => {
    return {
      key: a.routeName,
      label: $t(`Menu.${a.routeName}`),
      iconName: a.icon,
      children: a.children?.map((b) => {
        return {
          key: b.routeName,
          label: $t(`Menu.${b.routeName}`),
          iconName: b.icon
        }
      })
    }
  })
})

const onSelectMenu = (name) => router.push({ name })
</script>

<template>
  <n-space vertical>
    <n-layout has-sider>
      <n-layout-sider
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
        class="bg-active"
      >
        <div class="relative width-100p height-70 flex center-center">
          <NImage v-show="!collapsed" width="158" :src="companyNtLogo" preview-disabled />
          <NImage v-show="collapsed" width="32" :src="companyNtLogo_short" preview-disabled />
        </div>
        <NMenu
          class="layout-content"
          accordion
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :render-icon="renderIcon"
          @update:value="onSelectMenu"
          v-model:value="state.activeMenu"
        />
      </n-layout-sider>
      <n-layout>
        <NavMenu></NavMenu>
        <div
          class="layout-content flex-1 bg-global-bgl padding-left-20 padding-right-20 padding-bottom-20 padding-top-12"
        >
          <Breadcrumb></Breadcrumb>
          <router-view></router-view>
        </div>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<style scoped lang="scss">
@import 'src/styles/colors';

.main-page {
  background-image: linear-gradient(
    0deg,
    #ffffff,
    #ebf3fa,
    #d7e6f5,
    #c3daf0,
    #aeceea,
    #98c2e5,
    #81b6e0,
    #68abdb,
    #4a9fd5,
    #1a94d0
  );
  min-width: 800px;
  min-height: 500px;
}

:deep(.n-menu).n-menu--vertical {
  .n-menu-item-content {
    .n-menu-item-content-header,
    .n-icon,
    .n-menu-item-content__arrow {
      color: $COLOR_C;
    }

    &.n-menu-item-content--selected,
    &.n-menu-item-content--child-active {
      .n-menu-item-content-header,
      .n-icon,
      .n-menu-item-content__arrow {
        color: $COLOR_F;
      }

      &::before {
        background-color: transparent;
      }
    }

    &.n-menu-item-content--selected {
      background-color: $MAIN;
    }

    &:hover {
      background-color: $MAIN;

      &::before {
        background-color: transparent;
      }

      .n-menu-item-content-header,
      .n-icon,
      .n-menu-item-content__arrow {
        color: $COLOR_F;
      }
    }
  }
}

.layout-content {
  height: calc(100vh - 70px);
  overflow: auto;
}
</style>
