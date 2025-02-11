<template>
  <div class="container">
    <Header />
    <div>
      <a :href="debugstr">{{debugstr}}</a></div>
    <ul class="icon-list">
      <li v-for="(sentence, index) in sentences" :key="index">
        <router-link :to="{ name: 'step1', query: { index: index.toString() } }" class="styled-link">
          <CheckCircleOutlined class="icon" />
          <span class="link-text">Day {{ index + 1 }}</span>
        </router-link>
      </li>
    </ul>
    <Footer />
  </div>
</template>

<script setup>
import { CheckCircleOutlined } from '@ant-design/icons-vue';
import { useRuntimeConfig } from '#imports';

const sentences = ref([]);
const debugstr = ref('')
const config = useRuntimeConfig();

const isWeChat = typeof navigator !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent);

onMounted(async () => {
  if (isWeChat) {
    const wechatAppId = config.public.wechatAppId;
    const redirectUri = encodeURIComponent(window.location.href);
    const wechatAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechatAppId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
    debugstr.value = wechatAuthUrl
    //window.location.href = wechatAuthUrl;
  } else {
    const response = await fetch('/sentences.json');
    sentences.value = await response.json();
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
</style>