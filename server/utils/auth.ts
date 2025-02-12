import jwt from 'jsonwebtoken'
import { useRuntimeConfig } from '#imports'

export interface JWTPayload {
  openid: string
  unionid?: string
  iat?: number
  exp?: number
}

/**
 * 验证 JWT token
 * @param token JWT token 字符串
 * @returns Promise<boolean> token 是否有效
 */
export async function verifyToken(token: string): Promise<boolean> {
  const config = useRuntimeConfig()
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload
    return !!decoded.openid
  } catch (error) {
    console.error('Token 验证失败:', error)
    return false
  }
}

/**
 * 生成 JWT token
 * @param payload token 载荷数据
 * @returns Promise<string> 生成的 token
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  const config = useRuntimeConfig()
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '24h' // token 24小时有效期
  })
}