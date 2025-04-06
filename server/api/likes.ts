import { defineEventHandler, getQuery } from 'h3'
import prisma from "~/server/lib/prisma";

export default defineEventHandler(async (event) => {
  const method = event.method
  
  // Give a like to user
  if (method === 'POST') {
    const body = await readBody(event)
    return await prisma.dailyLike.create({
      data: {
        giverId: body.giverId,
        receiverId: body.receiverId
      }
    })
  }

  // Get user's received likes
  if (method === 'GET') {
    const query = getQuery(event)
    const userId = Number(query.userId)
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    return await prisma.dailyLike.groupBy({
      by: ['likedAt'],
      where: {
        receiverId: userId,
        likedAt: {
          gte: weekAgo,
          lte: today
        }
      },
      _count: true
    })
  }
})