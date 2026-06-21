import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

const getAllCategories = async () => {
    return await prisma.category.findMany({
        include: { _count: { select: { medicines: true } } }
    });
};

export const categoryService = {
    getAllCategories
};
