import { getCurrentUserId } from '~/server/utils/auth';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    const userId = await getCurrentUserId(event);
    const targetId = parseInt(event.context.params.id);

    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetId,
      },
    });

    return { success: true };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to follow user: ${error.message}`,
    });
  }
});
