import { defineEventHandler, readBody } from 'h3';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import { resolve } from 'path';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authHeader = event.req.headers['authorization'];

  if (!authHeader) {
    return { error: 'No token provided' };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const filePath = resolve('public/sentences.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { error: 'Invalid token' };
  }
});
