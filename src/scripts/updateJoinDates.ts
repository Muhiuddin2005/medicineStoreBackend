import { prisma } from "../lib/prisma.js";

async function updateJoinDates() {
    try {
        const targetDate = new Date("2026-01-01T00:00:00.000Z");
        const result = await prisma.user.updateMany({
            data: {
                createdAt: targetDate
            }
        });
        console.log(`Successfully updated ${result.count} users join date to 1/1/26!`);
    } catch (error) {
        console.error("Failed to update join dates:", error);
    } finally {
        await prisma.$disconnect();
    }
}

updateJoinDates();
