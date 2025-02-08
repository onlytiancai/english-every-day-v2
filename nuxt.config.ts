import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@ant-design-vue/nuxt'
  ],
  antd:{
    // Options
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  pages: true,
  css: [
    'bootstrap/dist/css/bootstrap.min.css'
  ]
});
