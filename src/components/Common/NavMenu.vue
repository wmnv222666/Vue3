<script setup>
import { computed, reactive, h } from 'vue'
import router from '@/router'
import { useStore } from 'vuex'
import i18n from '@/locales/i18n'
import { NIcon, useMessage } from 'naive-ui'
import { TranslationOutlined, UserOutlined, LogoutOutlined } from '@vicons/antd'
import companyNtLogo from '@/assets/companyNtLogo.png'

const store = useStore()
const Message = useMessage()
const $t = i18n.global.t

const state = reactive({
  activeMenu: router.currentRoute.value.matched[0].name
})

const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

const userInfo = computed(() => store.state.system.userInfo)

// 用户操作配置【下拉列表】
const userOptions = computed(() => [
  {
    key: 'languageList',
    label: $t('Common.Languages'),
    icon: renderIcon(TranslationOutlined),
    children: store.state.languageList.map((item) => {
      return {
        key: item.id,
        label: item.name,
        props: {
          onClick: () => {
            setLanguage(item.id)
            document.title = $t(`Menu.${router.currentRoute.value.name}`)
          }
        }
      }
    })
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    key: 'logout',
    label: $t('Common.Logout'),
    icon: renderIcon(LogoutOutlined),
    props: {
      onClick: () => logout()
    }
  }
])

// 导航配置【菜单】
const menuOptions = computed(() => {
  return ['Main', 'Payroll'].map((key) => ({
    key,
    label: $t(`Menu.${key}`)
  }))
})
const isLogin = computed(() => store.getters['system/isLogin'])

const setLanguage = (d) => store.dispatch('setLanguage', d, { root: true })
const logout = (d) => store.dispatch('system/logout', d, { root: true })
const onSelectMenu = (name) => router.push({ name })
</script>

<template>
  <div
    class="nav-menu relative flex between-center"
    :class="isLogin ? `style-${state.activeMenu.toLowerCase()}` : ''"
  >
    <!--已登录-->
    <template v-if="isLogin">
      <!--Logo-->
      <div
        v-if="state.activeMenu === 'Main'"
        class="logo-wrapper relative width-256 height-100p flex center-center"
      >
        <NImage width="158" :src="companyNtLogo" preview-disabled />
      </div>

      <!--menu-->
      <NMenu
        v-model:value="state.activeMenu"
        mode="horizontal"
        :options="menuOptions"
        @update:value="onSelectMenu"
      ></NMenu>

      <!--填充-->
      <div class="flex-1"></div>

      <!--操作区-->
      <div class="flex padding-right-16">
        <!--用户信息-->
        <NDropdown trigger="hover" :options="userOptions">
          <div class="flex center-center text-f pointer margin-left-4">
            <NIcon class="margin-right-4" size="16">
              <UserOutlined></UserOutlined>
            </NIcon>
            {{ userInfo.name }}
          </div>
        </NDropdown>
      </div>
    </template>

    <!--未登录-->
    <template v-else>
      <!--填充-->
      <div class="flex-1"></div>

      <!--操作区-->
      <div class="flex padding-right-16">
        <!--切换语言-->
        <NDropdown
          trigger="hover"
          :options="userOptions.find((item) => item.key === 'languageList').children"
        >
          <NIcon class="pointer padding-8 text-f" size="16">
            <TranslationOutlined></TranslationOutlined>
          </NIcon>
        </NDropdown>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@import 'src/styles/colors';
@import 'src/styles/constants';

.nav-menu {
  height: $NavHeight;

  // 样式【首页】
  &.style-main {
    :deep(.n-menu).n-menu--horizontal .n-menu-item {
      height: $NavHeight;

      .n-menu-item-content {
        .n-menu-item-content-header {
          color: $COLOR_D6;
          font-weight: bold;
        }

        &.n-menu-item-content--selected {
          .n-menu-item-content-header {
            color: $COLOR_F;
          }
        }

        &:hover {
          .n-menu-item-content-header {
            color: $COLOR_F;
          }
        }
      }
    }
  }

  // 样式【payroll】
  &.style-payroll {
    background-color: $ACTIVE;

    .logo-wrapper {
      background-color: $ACTIVE;
    }

    :deep(.n-menu).n-menu--horizontal .n-menu-item {
      height: $NavHeight;

      .n-menu-item-content {
        .n-menu-item-content-header {
          color: $COLOR_C;
          font-weight: bold;
        }

        &.n-menu-item-content--selected {
          .n-menu-item-content-header {
            color: $COLOR_F;
          }

          position: relative;
          z-index: 1;
        }

        &:hover {
          .n-menu-item-content-header {
            color: $COLOR_F;
          }
        }
      }
    }
  }
}
</style>
