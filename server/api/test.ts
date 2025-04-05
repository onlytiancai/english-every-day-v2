import { mean } from "lodash";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const sentences = Array.from({ length: 2000 }, (_, i) => ({
        content: `Sample sentence ${i + 1}`,
        meaning: `Sample meaning ${i + 1}`,
    }));

    await prisma.sentence.createMany({
        data: sentences,
    });

    return { message: "2000 sentences inserted successfully" };
});
