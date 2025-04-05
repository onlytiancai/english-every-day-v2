# GitHub Copilot Instructions

## Project Overview
This project is a Nuxt3 project using TypeScript, Vue3, Prisma, and TailwindCSS.

## Technologies Used
- TypeScript
- Nuxt3
- Vue3
- Prisma
- TailwindCSS

## vue
- use nuxt3 useFetch or $fetch to send http request
- use nuxt3 built-in Auto-imports to auot import components, composables, helper functions and Vue APIs

## UI

- use @ant-design/icons-vue and bootstrap 5 if needed

## 数据库结构

参考路径 prisma\schema.prisma

## 常用代码

获取当前用户 id

    import { getCurrentUserId } from '../utils/auth';

访问数据库

    import prisma from "~/lib/prisma";
    return {
        user: await prisma.user.findFirst(),
    };
