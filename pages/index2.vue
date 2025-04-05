<template>
  <div class="container">
    <div v-if="isWeChat">
      <div v-if="!userInfo">
        <a :href="loginWechatUrl">微信登录</a>
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
    <div v-if="debugMessages.length" class="debug-messages">
      <h3>Debug Information</h3>
      <ul>
        <li v-for="(message, index) in debugMessages" :key="index">{{ message }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { CheckCircleOutlined } from '@ant-design/icons-vue';
import { useRuntimeConfig } from '#imports';
import { useRoute, useRouter } from 'vue-router';
import { fetchSentences } from '@/utils/fetchSentences';

const loginWechatUrl = ref('');
const sentences = ref([]);
const config = useRuntimeConfig();
const userInfo = ref(null);
const errorMessage = ref('');
const debugMessages = ref([]);
const route = useRoute();
const router = useRouter();

const isWeChat = typeof navigator !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent);

function logDebug(message) {
  console.log(message);
  debugMessages.value.push(message);
}

onMounted(async () => {
  const code = route.query.code;
  const token = localStorage.getItem('token');
  const storedUserInfo = localStorage.getItem('userInfo');

  logDebug(`index loaded: code=${code}, token=${token}, storedUserInfo=${storedUserInfo}`);
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo);
  }

  if (token && storedUserInfo) {
    try {
      sentences.value = await fetchSentences(token);
    } catch (error) {
      logDebug(`Fetching sentences error: ${error}`);
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      userInfo.value = null;
      errorMessage.value = 'Token invalid, please log in again';
    }
  } else if (code) {
    logDebug(`enter wechat callback: code=${code}`);
    try {
      const response = await fetch(`/api/wechat-login?code=${code}`);
      const data = await response.json();
      logDebug(`get wechat login: ${JSON.stringify(data)}`);
      if (data.success) {
        userInfo.value = data.userInfo;
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
        sentences.value = await fetchSentences(data.token);
      } else {
        errorMessage.value = data.error;
      }
    } catch (error) {
      logDebug(`WeChat login error: ${error}`);
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

.debug-messages {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  margin-top: 20px;
  word-wrap: break-word;
  text-align: left;
}

.debug-messages h3 {
  margin-top: 0;
}
</style>