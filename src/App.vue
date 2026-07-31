<template>
  <Loading />
  <router-view />
  <GlobalUI />
</template>

<script setup>
import Loading from '@/components/common/Loading.vue'
import GlobalUI from '~/components/common/GlobalUI.vue'
</script>
