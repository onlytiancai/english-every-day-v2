// server/middleware/api-logger.ts
export default defineEventHandler((event) => {
    const { req, res } = event.node
    const startTime = Date.now()
    
    res.on('finish', () => {
      const duration = Date.now() - startTime
      console.log({
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
        // 可以添加更多信息如用户IP等
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
      })
    })
  })