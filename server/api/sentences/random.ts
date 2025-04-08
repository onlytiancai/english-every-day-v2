import prisma from "~/lib/prisma";
import { getCurrentUserId, verifyToken } from '../../utils/auth';
import { getRequestHeaders } from 'h3'

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

  const userId = await getCurrentUserId(event);

  // Get a random sentence that user hasn't learned
  const randomSentence = await prisma.$queryRaw`
    SELECT * FROM Sentence 
    WHERE id NOT IN (
      SELECT sentenceId 
      FROM UserLearningRecord 
      WHERE userId = ${userId}
    )
    ORDER BY RANDOM() 
    LIMIT 1
  `;

  if (!randomSentence || !randomSentence[0]) {
    throw createError({
      statusCode: 404,
      message: '没有更多未学习的句子'
    });
  }

  return {
    id: randomSentence[0].id.toString(),
    english: randomSentence[0].content,
    chinese: '这是一个测试句子',
    explanation: '这是一个测试句子的解释',
    mp3: `http://media.ihuhao.com/nce2-sentences/${randomSentence[0].id}.mp3`
  }
})
