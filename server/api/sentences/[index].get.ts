import { resolve } from 'path'
import { promises as fs } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    // 验证 JWT token
    const token = event.node.req.headers.authorization?.split(' ')[1]
    if (!token) {
      throw createError({
        statusCode: 401,
        message: '未授权访问'
      })
    }

    const verified = await verifyToken(token)
    if (!verified) {
      throw createError({
        statusCode: 401,
        message: 'Token 无效'
      })
    }

    // 获取路径参数
    const index = parseInt(event.context.params?.index || '0')
    if (isNaN(index)) {
      throw createError({
        statusCode: 400,
        message: '无效的索引参数'
      })
    }
    
    // 从 JSON 文件读取句子数据
    const filePath = resolve('public/sentences.json')
    const data = await fs.readFile(filePath, 'utf-8')
    const sentences = JSON.parse(data)

    // 检查索引是否有效
    if (index < 0 || index >= sentences.length) {
      throw createError({
        statusCode: 404,
        message: '句子不存在'
      })
    }

    return {
      sentence: sentences[index]
    }
  } catch (error: any) {
    console.error('获取句子失败:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '服务器内部错误'
    })
  }
}) 