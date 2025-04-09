import { getCurrentUserId } from '~/server/utils/auth';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    const giverId = await getCurrentUserId(event);
    const receiverId = parseInt(event.context.params.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 检查今天是否已经点过赞
    const existingLike = await prisma.dailyLike.findFirst({
      where: {
        giverId,
        receiverId,
        likedAt: {
          gte: today
        }
      }
    });

    if (existingLike) {
      throw createError({
        statusCode: 400,
        message: 'You have already liked this user today',
      });
    }

    // 创建点赞记录
    await prisma.dailyLike.create({
      data: {
        giverId,
        receiverId,
        likedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    if (error.statusCode === 400) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: `Failed to like user: ${error.message}`,
    });
  }
});
