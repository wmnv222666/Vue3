<script setup>
import bgLeft from '@/assets/login/bg-left-business_medium.svg'
import bgMiddle from '@/assets/login/bg-middle-walker_medium.svg'
import bgRight from '@/assets/login/bg-right-done_medium.svg'
import { computed, reactive, watch, ref } from 'vue'
import router from '@/router'
import { useStore } from 'vuex'
import i18n from '@/locales/i18n'
import { useMessage } from 'naive-ui'
import { EditOutlined, LockOutlined, UserOutlined } from '@vicons/antd'
import NavMenu from '@/components/Common/NavMenu.vue'

const store = useStore()
const Message = useMessage()
const $t = i18n.global.t

// 背景图片列表
const bgImages = reactive([
  { src: bgLeft, className: 'width-20p' },
  { src: bgMiddle, className: 'width-40p' },
  { src: bgRight, className: 'width-20p' }
])

// 页面模式: 'Login' | 'Forget Password'
const state = reactive({
  pageMode: 'Login'
})

// 表单
const formData = reactive({
  userName: null,
  phone: null,
  rememberMe: false
})

const formRef = ref(null)

// 计算属性

const lang = computed(() => store.state.lang)
const rules = computed(() => {
  return {
    userName: [
      {
        required: true,
        message:
          state.pageMode === 'Login'
            ? $t('Login.UserName Message')
            : $t('Login.UserName/Email Message'),
        trigger: ['input', 'blur']
      }
    ],
    password: [
      {
        required: true,
        message: $t('Login.Password Message'),
        trigger: ['input', 'blur']
      }
    ]
  }
})

watch(lang, () => {
  formRef.value.restoreValidation()
})

// 方法

const appInit = (d) => store.dispatch('appInit', d, { root: true })
const tokenUpdate = (d) => store.commit('system/tokenUpdate', d, { root: true })

const onLogin = async () => {
  await formRef.value.validate()

  // 储存token
  await tokenUpdate('123456')

  // 登录后跳转
  let name = await appInit()
  Message.success($t('Login.Success'))
  await router.push({ name })
}

const onEnterForgetPwd = () => {
  state.pageMode = 'Forget Password'
}

const onEnterLogin = () => {
  state.pageMode = 'Login'
}

const onForgetPasswordSubmit = async () => {
  await formRef.value.validate()

  state.pageMode = 'Login'

  Message.success($t('Login.Forget Password Success'))
}
</script>

<template>
  <div class="login-page relative full-screen">
    <!--背景内容-->
    <div class="flex around-center full-screen absolute">
      <NImage
        v-for="(image, i) in bgImages"
        :class="image.className"
        object-fit="cover"
        :key="i"
        :src="image.src"
        preview-disabled
      ></NImage>
    </div>

    <div class="flex column width-100p height-100p">
      <!--导航-->
      <NavMenu></NavMenu>

      <!--页面内容-->
      <div class="flex-1 flex center-center">
        <!--窗口 【登录】 【忘记密码】-->
        <NCard class="width-308 bg-global-bg radius-8">
          <div class="text-text text-center font-18 padding-top-48">
            <div class="line-height-26 margin-bottom-12">
              {{ state.pageMode === 'Login' ? $t('Login.Title') : $t('Login.Forget Password') }}
            </div>

            <div class="border-hover width-32p margin-center"></div>
          </div>

          <div class="padding-8">
            <NForm ref="formRef" :model="formData" :rules="rules" label-placement="left">
              <!--表单 【登录】-->
              <template v-if="state.pageMode === 'Login'">
                <div class="text-center text-9 margin-top-12 margin-bottom-12 line-height-24">
                  {{ $t('Basic.Name') }}
                </div>

                <NFormItem path="userName">
                  <NInput
                    clearable
                    v-model:value="formData.userName"
                    :placeholder="$t('Login.UserName Placeholder')"
                  >
                    <template #prefix>
                      <NIcon>
                        <UserOutlined></UserOutlined>
                      </NIcon>
                    </template>
                  </NInput>
                </NFormItem>
                <NFormItem path="password">
                  <NInput
                    clearable
                    type="password"
                    show-password-on="mousedown"
                    v-model:value="formData.password"
                    :placeholder="$t('Login.Password Placeholder')"
                  >
                    <template #prefix>
                      <NIcon>
                        <LockOutlined></LockOutlined>
                      </NIcon>
                    </template>
                  </NInput>
                </NFormItem>

                <div class="margin-bottom-4">
                  <NCheckbox v-model:checked="formData.rememberMe">
                    {{ $t('Login.RememberMe') }}
                  </NCheckbox>
                </div>

                <div class="margin-bottom-24">
                  <NButton class="width-100p" type="info" @click="onLogin">
                    {{ $t('Login.Sign In') }}
                  </NButton>
                </div>

                <div class="text-right margin-bottom-12">
                  <span class="pointer" @click="onEnterForgetPwd">{{
                    $t('Login.Forget Password')
                  }}</span>
                </div>
              </template>

              <!--表单 【忘记密码】-->
              <template v-if="state.pageMode === 'Forget Password'">
                <NFormItem class="margin-top-42" path="userName">
                  <NInput
                    clearable
                    v-model:value="formData.userName"
                    :placeholder="$t('Login.UserName/Email Placeholder')"
                  >
                    <template #suffix>
                      <NIcon>
                        <EditOutlined></EditOutlined>
                      </NIcon>
                    </template>
                  </NInput>
                </NFormItem>

                <div class="margin-bottom-24 flex between-center">
                  <n-button
                    class="flex-1 margin-right-24"
                    type="info"
                    @click="onForgetPasswordSubmit"
                  >
                    {{ $t('Common.Submit') }}
                  </n-button>
                  <n-button class="flex-1" type="info" @click="onEnterLogin">
                    {{ $t('Common.Back') }}
                  </n-button>
                </div>

                <div class="font-13 text-9 margin-top-64 margin-bottom-22">
                  {{ $t('Login.Forget Password Tips') }}
                </div>
              </template>
            </NForm>
          </div>
        </NCard>
      </div>

      <!--页脚-->
      <div class="line-height-20 padding-bottom-20 text-center width-100p">
        {{ $t('Basic.ICP') }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'src/styles/colors';

.login-page {
  background-image: linear-gradient($BACKGROUND, #fff);
  min-width: 306px;
  min-height: 500px;

  .n-icon {
    color: $COLOR_1;
  }

  :deep(img) {
    width: 100%;
  }
}
</style>
