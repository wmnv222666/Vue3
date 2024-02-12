<script setup>
import bgLeft from '@/assets/login/bg-left-business_medium.svg'
import bgMiddle from '@/assets/login/bg-middle-walker_medium.svg'
import bgRight from '@/assets/login/bg-right-done_medium.svg'
import { computed, reactive, watch, ref } from 'vue'
import router from '@/router'
import { useStore } from 'vuex'
import i18n from '@/locales/i18n'
import { useMessage } from 'naive-ui'
import { LockOutlined } from '@vicons/antd'
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

// 表单
const formData = reactive({
  pwd: null,
  confirmPwd: null
})

const formRef = ref(null)

// 计算属性

const lang = computed(() => store.state.lang)

watch(lang, () => {
  formRef.value.restoreValidation()
})

// 方法

const onSubmit = async () => {
  await formRef.value.validate()

  if (formData.pwd !== formData.confirmPwd) {
    return Message.warning($t('Login.Password and Confirm Password inconsistent'))
  }

  Message.success($t('Login.Reset Password Success'))

  router.push({ name: 'Login' })
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
        <NCard class="width-308 bg-global-bg radius-8" style="min-height: 430px">
          <div class="text-text text-center font-18 padding-top-48">
            <div class="line-height-26 margin-bottom-12">
              {{ $t('Login.Reset Password') }}
            </div>

            <div class="border-hover width-32p margin-center"></div>
          </div>

          <div class="padding-8">
            <NForm ref="formRef" :model="formData" label-placement="left">
              <NFormItem class="margin-top-42" path="pwd">
                <NInput
                  clearable
                  type="password"
                  show-password-on="click"
                  v-model:value="formData.pwd"
                  :placeholder="$t('Login.Please Enter New Password')"
                >
                  <template #prefix>
                    <NIcon>
                      <LockOutlined></LockOutlined>
                    </NIcon>
                  </template>
                </NInput>
              </NFormItem>

              <NFormItem path="confirmPwd">
                <NInput
                  clearable
                  type="password"
                  show-password-on="click"
                  v-model:value="formData.confirmPwd"
                  :placeholder="$t('Login.Please Confirm New Password')"
                >
                  <template #prefix>
                    <NIcon>
                      <LockOutlined></LockOutlined>
                    </NIcon>
                  </template>
                </NInput>
              </NFormItem>

              <div class="flex between-center">
                <n-button class="flex-1" type="info" @click="onSubmit">
                  {{ $t('Common.Submit') }}
                </n-button>
              </div>
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
