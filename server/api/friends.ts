import prisma from "~/lib/prisma";
import { getCurrentUserId } from '../utils/auth';

export default defineEventHandler(async (event) => {
  console.log('Friends API: Starting request');
  const userId = await getCurrentUserId(event);
  console.log(`Friends API: Got current user ID: ${userId}`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  console.log(`Friends API: Querying friends for date range:`, {
    today: today.toISOString(),
    weekStart: weekStart.toISOString()
  });

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

  // 获取关注的用户列表及其学习记录
  const friends = await prisma.follow.findMany({
    where: {
      followerId: userId
    },
    select: {
      following: {
        select: {
          id: true,
          name: true,
          userinfo: true,
          learningRecords: {
            where: {
              OR: [
                { learnedAt: { gte: today } },  // 今天的记录
                { learnedAt: { gte: weekStart } }  // 本周的记录
              ]
            }
          }
        }
      }
    }
  });

  console.log(`Friends API: Found ${friends.length} friends`);

  // 处理数据格式
  const result = friends.map(({ following }) => {
    const userInfo = following.userinfo ? JSON.parse(following.userinfo) : {};
    const todayCount = following.learningRecords.filter(
      record => record.learnedAt >= today
    ).length;
    const weekCount = following.learningRecords.length;

    console.log(`Friends API: Processing friend ${following.id}:`, {
      todayCount,
      weekCount
    });

    return {
      id: following.id.toString(),
      name: following.name,
      avatar: userInfo.headimgurl || '',
      todayCount,
      weekCount,
      isFollowing: true,
      hasLikedToday: likedUserIds.has(following.id) // 添加点赞状态
    };
  });

  console.log('Friends API: Request completed successfully');
  return result;
});
