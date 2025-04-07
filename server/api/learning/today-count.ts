import { PrismaClient } from '@prisma/client'
import { getCurrentUserId } from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const userId = getCurrentUserId(event)
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const count = await prisma.userLearningRecord.count({
    where: {
      userId: userId,
      learnedAt: {
        gte: today
      }
    }
  })

  return { count }
})
