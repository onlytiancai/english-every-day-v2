import { defineEventHandler, getQuery } from 'h3'
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const method = event.method
  const query = getQuery(event)

  // Record a learned sentence
  if (method === 'POST') {
    const body = await readBody(event)
    return await prisma.userLearningRecord.create({
      data: {
        userId: body.userId,
        sentenceId: body.sentenceId
      }
    })
  }

  // Get user's learning statistics
  if (method === 'GET') {
    const userId = Number(query.userId)
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    const learningStats = await prisma.userLearningRecord.groupBy({
      by: ['learnedAt'],
      where: {
        userId,
        learnedAt: {
          gte: weekAgo,
          lte: today
        }
      },
      _count: {
        sentenceId: true
      }
    })

    return learningStats
  }
})