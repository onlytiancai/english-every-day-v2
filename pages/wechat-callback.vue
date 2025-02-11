<template>
  <div class="container">
    <Header />
    <div v-if="userInfo">
      <img :src="userInfo.headimgurl" alt="WeChat Avatar" />
      <p>{{ userInfo.nickname }}</p>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useRuntimeConfig } from '#imports';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const userInfo = ref(null);

onMounted(async () => {
  const code = route.query.code;
  if (code) {
    try {
      const response = await fetch(`/api/wechat-login?code=${code}`);
      const data = await response.json();
      if (data.success) {
        userInfo.value = data.userInfo;
      }
    } catch (error) {
      console.error('WeChat login error:', error);
    }
  }
});
</script>

<style scoped>
@import '@/assets/css/common.css';
</style>
