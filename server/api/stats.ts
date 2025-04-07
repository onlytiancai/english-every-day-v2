import prisma from "~/server/lib/prisma";
import { getCurrentUserId } from '../utils/auth';

export default defineEventHandler(async (event) => {
  const userId = await getCurrentUserId(event);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const [todaySentences, weekSentences, todayLikes, weekLikes] = await Promise.all([
    prisma.userLearningRecord.count({
      where: {
        userId,
        learnedAt: {
          gte: today
        }
      }
    }),
    prisma.userLearningRecord.count({
      where: {
        userId,
        learnedAt: {
          gte: weekStart
        }
      }
    }),
    prisma.dailyLike.count({
      where: {
        receiverId: userId,
        likedAt: {
          gte: today
        }
      }
    }),
    prisma.dailyLike.count({
      where: {
        receiverId: userId,
        likedAt: {
          gte: weekStart
        }
      }
    })
  ]);

  return {
    todaySentences,
    weekSentences,
    todayLikes,
    weekLikes
  };
});
