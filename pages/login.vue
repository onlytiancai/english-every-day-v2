<template>
  <div class="container min-h-screen flex items-center justify-center">
    <div class="text-center">
      <a :href="loginWechatUrl" class="btn btn-success btn-lg">微信登录</a>
      <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getWechatLoginUrl, handleAuthentication } from '~/utils/auth';

const router = useRouter();
const errorMessage = ref('');
const loginWechatUrl = ref(getWechatLoginUrl());

onMounted(async () => {
  const { isAuthenticated: authStatus, error } = await handleAuthentication(console.log);
  if (authStatus) {
    await router.push('/');
  }
  if (error) {
    errorMessage.value = error;
  }
});
</script>
