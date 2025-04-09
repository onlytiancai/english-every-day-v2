<template>
  <div class="container min-h-screen flex items-center justify-center">
    <div class="text-center">
      <a :href="loginWechatUrl" class="btn btn-success btn-lg">微信登录</a>
      <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getWechatLoginUrl, loginWithWechat } from '~/utils/auth';

const router = useRouter();
const route = useRoute();
const errorMessage = ref('');
const loginWechatUrl = ref(getWechatLoginUrl());

onMounted(async () => {
  // Check if there's a code in URL
  const code = route.query.code as string;
  if (code) {
    const { success, error, userInfo } = await loginWithWechat(code, console.log);
    if (success) {
      await router.push('/');
      return;
    }
    errorMessage.value = error;
    return;
  }
});
</script>
