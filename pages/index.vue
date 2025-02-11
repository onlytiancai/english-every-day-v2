<template>
  <div class="container">
    <Header />
    <div v-if="isWeChat">
      <div v-if="!userInfo">
        <a :href="loginWechatUrl">微信登录</a>
        {{ loginWechatUrl }}
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
      <div v-else>
        <img :src="userInfo.headimgurl" alt="WeChat Avatar" />
        <p>{{ userInfo.nickname }}</p>
        <ul class="icon-list">
          <li v-for="(sentence, index) in sentences" :key="index">
            <router-link :to="{ name: 'step1', query: { index: index.toString() } }" class="styled-link">
              <CheckCircleOutlined class="icon" />
              <span class="link-text">Day {{ index + 1 }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p>请在微信中打开</p>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { CheckCircleOutlined } from '@ant-design/icons-vue';
import { useRuntimeConfig } from '#imports';
import { useRoute, useRouter } from 'vue-router';

const loginWechatUrl = ref('');
const sentences = ref([]);
const config = useRuntimeConfig();
const userInfo = ref(null);
const errorMessage = ref('');
const route = useRoute();
const router = useRouter();

const isWeChat = typeof navigator !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent);

onMounted(async () => {
  const code = route.query.code;
  if (code) {
    try {
      const response = await fetch(`/api/wechat-login?code=${code}`);
      const data = await response.json();
      if (data.success) {
        userInfo.value = data.userInfo;
        const response = await fetch('/sentences.json');
        sentences.value = await response.json();
      } else {
        errorMessage.value = data.error;
      }
    } catch (error) {
      console.error('WeChat login error:', error);
      errorMessage.value = 'WeChat login error';
    }
  } else if (isWeChat) {
    const wechatAppId = config.public.wechatAppId;
    const redirectUri = encodeURIComponent(window.location.href);
    const wechatAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechatAppId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
    loginWechatUrl.value = wechatAuthUrl;
  }
});
</script>

<style scoped>
@import '@/assets/css/common.css';

.icon-list {
  list-style-type: none;
  padding: 0;
}

.styled-link {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
}

.styled-link:hover {
  background-color: #ecf0f1;
}

.icon {
  margin-right: 8px;
}

.link-text {
  display: inline-block;
}

.error-message {
  color: red;
  font-weight: bold;
}
</style>