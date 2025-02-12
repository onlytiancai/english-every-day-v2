import { defineEventHandler, getRequestHeaders, getRouterParam } from 'h3';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { verifyToken } from '../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const headers = getRequestHeaders(event);
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      throw createError({
        statusCode: 401,
        message: '未授权访问'
      });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      throw createError({
        statusCode: 401,
        message: 'Token 无效'
      });
    }

    // 读取句子数据
    const filePath = resolve('public/sentences.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const sentences = JSON.parse(data);

    // 检查是否请求特定句子
    const index = getRouterParam(event, 'index');
    if (index) {
      const idx = parseInt(index);
      if (isNaN(idx) || idx < 0 || idx >= sentences.length) {
        throw createError({
          statusCode: 400,
          message: '无效的索引参数'
        });
      }
      return { sentence: sentences[idx] };
    }

    // 返回所有句子
    return sentences;
  } catch (error: any) {
    console.error('获取句子失败:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '服务器内部错误'
    });
  }
});
