import { getCurrentUserId } from '~/server/utils/auth';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    const giverId = await getCurrentUserId(event);
    const receiverId = parseInt(event.context.params.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create like record for today
    await prisma.dailyLike.create({
      data: {
        giverId,
        receiverId,
        likedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 400,
        message: 'You have already liked this user today',
      });
    }
    throw createError({
      statusCode: 500,
      message: `Failed to like user: ${error.message}`,
    });
  }
});
