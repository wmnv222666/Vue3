<script setup>
import bgRight from '@/assets/home/bg-right-data_medium.svg'
import bgWelcome from '@/assets/home/bg-welcome.svg'
import NavMenu from '@/components/Common/NavMenu.vue'
</script>

<template>
  <div class="full-screen main-page flex column overflow">
    <NavMenu></NavMenu>

    <!--背景内容-->
    <div class="flex around-end flex-1 bg">
      <div class="width-60p flex column center-center">
        <div class="text-wrapper ff-open-sans">
          <h2 class="font-32 text-1">{{ $t('Home.Title 1') }}</h2>
          <h2 class="font-32 text-1">{{ $t('Home.Title 2') }}</h2>

          <div class="font-24 text-3 margin-top-24 margin-bottom-24">
            {{ $t('Home.Description 1') }}
          </div>

          <div>{{ $t('Home.Description 2') }}</div>
          <div>{{ $t('Home.Description 3') }}</div>
        </div>
        <NImage class="width-400" object-fit="cover" :src="bgWelcome"></NImage>
      </div>
      <div class="flex-1">
        <NImage class="width-400 margin-center flex" object-fit="cover" :src="bgRight"></NImage>
      </div>
    </div>

    <div class="flex-1"></div>
  </div>
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

  .bg {
    padding-top: 100px;
    min-width: 1366px;

    .text-wrapper {
      white-space: nowrap;
    }

    :deep(img) {
      width: 100%;
    }
  }
}
</style>
