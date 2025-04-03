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

    const learningRecords = await prisma.userLearningRecord.findMany({
      where: {
      userId,
      learnedAt: {
        gte: weekAgo,
        lte: today
      }
      },
      select: {
      learnedAt: true,
      sentenceId: true
      }
    })

    const groupedRecords = learningRecords.reduce((acc, record) => {
      const date = record.learnedAt.toISOString().split('T')[0]
      if (!acc[date]) {
      acc[date] = { learnedAt: date, _count: { sentenceId: 0 } }
      }
      acc[date]._count.sentenceId += 1
      return acc
    }, {} as Record<string, { learnedAt: string; _count: { sentenceId: number } }>)

    const learningStats = Object.values(groupedRecords)

    return learningStats
  }
})