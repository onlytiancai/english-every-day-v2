import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@ant-design-vue/nuxt',
    "@prisma/nuxt"
  ],
  antd: {
    // Options
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  pages: true,
  css: [
    'bootstrap/dist/css/bootstrap.min.css'
  ],
  runtimeConfig: {
    wechatAppId: process.env.WECHAT_APP_ID,
    wechatAppSecret: process.env.WECHAT_APP_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    public: {
      wechatAppId: process.env.WECHAT_APP_ID,
      returnUrl: process.env.RETURN_URL,
    }
  }
});
