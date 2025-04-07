import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/'
  },
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
      wechatAppId: process.env.NUXT_PUBLIC_WECHAT_APP_ID,
      returnUrl: process.env.NUXT_PUBLIC_RETURN_URL,
    }
  },
  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
      },
    },
  },
});
