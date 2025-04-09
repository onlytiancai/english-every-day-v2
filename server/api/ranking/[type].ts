import prisma from '~/lib/prisma';
import { getCurrentUserId } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const userId = await getCurrentUserId(event);
  const type = event.context.params.type;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  try {
    // 获取今日点赞记录
    const todayLikes = await prisma.dailyLike.findMany({
      where: {
        giverId: userId,
        likedAt: {
          gte: today
        }
      },
      select: {
        receiverId: true
      }
    });

    // 创建已点赞用户ID集合
    const likedUserIds = new Set(todayLikes.map(like => like.receiverId));

    const where = type === 'daily' 
      ? { learnedAt: { gte: today } }
      : { learnedAt: { gte: weekStart } };

    const rankings = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        userinfo: true,
        _count: {
          select: {
            learningRecords: {
              where
            }
          }
        }
      },
      orderBy: {
        learningRecords: {
          _count: 'desc'
        }
      },
      take: 10
    });

    return rankings.map(user => {
      const userInfo = user.userinfo ? JSON.parse(user.userinfo) : {};
      return {
        id: user.id,
        name: user.name,
        avatar: userInfo.headimgurl || '',
        sentenceCount: user._count.learningRecords,
        hasLikedToday: likedUserIds.has(user.id) // 添加点赞状态
      };
    });

  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch ${type} ranking: ${error.message}`
    });
  }
});
