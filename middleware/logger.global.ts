// middleware/logger.global.ts
import { defineNuxtRouteMiddleware, useRequestEvent } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to, from) => {
    const event = useRequestEvent();
    const req = event?.node.req ?? { method: 'UNKNOWN', url: 'UNKNOWN' };
    const res = event?.node.res ?? { on: () => {}, statusCode: 'UNKNOWN' };

    // 记录请求信息
    const logRequest = () => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    };

    // 记录响应信息
    const logResponse = () => {
        console.log(`[${new Date().toISOString()}] Response Status: ${res.statusCode}`);
    };

    logRequest();

    // 监听响应完成事件
    res.on('finish', logResponse);
});    