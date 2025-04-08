import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    // Get client IP and validate
    const clientIp = getRequestIP(event);
    if (clientIp !== '127.0.0.1' && clientIp !== '::ffff:127.0.0.1') {
        throw createError({
            statusCode: 403,
            message: `${clientIp} - Access denied. This endpoint is only accessible from localhost`
        });
    }

    // Read CSV file
    const csvFilePath = resolve(process.cwd(), 'scripts/output.csv');
    const fileContent = readFileSync(csvFilePath, 'utf-8');
    
    // Parse CSV content
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
    });

    // Transform records to sentence format
    const sentences = records.map((record: any, index: number) => ({
        id: index + 1, // Start from 1, excluding header
        content: record.Sentence,
        meaning: '', // Empty meaning as it's not in CSV
    }));

    // Clear existing data
    await prisma.userLearningRecord.deleteMany();
    await prisma.sentence.deleteMany();

    // Reset auto-increment
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'Sentence'`;

    // Insert new sentences
    await prisma.sentence.createMany({
        data: sentences,
    });

    return { 
        message: `${sentences.length} sentences imported successfully`,
        firstSentence: sentences[0],
        lastSentence: sentences[sentences.length - 1]
    };
});
