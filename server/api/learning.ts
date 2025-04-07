import { defineEventHandler, getQuery, getRequestHeaders } from 'h3'
import prisma from "~/lib/prisma";
import _ from 'lodash'
import { getCurrentUserId, verifyToken } from '../utils/auth';

export default defineEventHandler(async (event) => {
  // Add token verification
  const headers = getRequestHeaders(event);
  const token = headers.authorization?.split(' ')[1];
  if (!token) {
    throw createError({
      statusCode: 401,
      message: '未授权访问'
    });
  }

  const isValid = await verifyToken(token);
  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: 'Token 无效'
    });
  }

  const method = event.method
  const query = getQuery(event)

  // Record a learned sentence
  if (method === 'POST') {
    const body = await readBody(event)
    const userId = await getCurrentUserId(event);

    return await prisma.userLearningRecord.create({
      data: {
      userId: Number(userId),
      sentenceId: Number(body.sentenceId)
      }
    });
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

    interface LearningRecord {
      learnedAt: Date;
      sentenceId: number;
    }

    interface GroupedRecord {
      learnedAt: string;
      _count: {
      sentenceId: number;
      };
    }

    const groupedRecords: GroupedRecord[] = _.chain(learningRecords as LearningRecord[])
      .groupBy((record: LearningRecord) => record.learnedAt.toISOString().split('T')[0])
      .map((records: LearningRecord[], date: string): GroupedRecord => ({
      learnedAt: date,
      _count: { sentenceId: records.length }
      }))
      .value();

    const learningStats = groupedRecords

    return learningStats
  }
})