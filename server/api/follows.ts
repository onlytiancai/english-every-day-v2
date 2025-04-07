import { defineEventHandler } from 'h3'
import prisma from "~/server/lib/prisma";

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'POST') {
    const body = await readBody(event)
    return await prisma.follow.create({
      data: {
        followerId: body.followerId,
        followingId: body.followingId
      }
    })
  }

  if (method === 'GET') {
    const query = getQuery(event)
    const userId = Number(query.userId)
    const type = query.type // 'followers' or 'following'

    if (type === 'followers') {
      return await prisma.follow.findMany({
        where: { followingId: userId },
        include: { follower: true }
      })
    } else {
      return await prisma.follow.findMany({
        where: { followerId: userId },
        include: { following: true }
      })
    }
  }
})