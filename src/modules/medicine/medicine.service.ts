import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

const getAllMedicines = async ({
    search,
    category,
    page,
    limit,
    manufacturer,
    minPrice,
    maxPrice,
    skip,
    sortBy,
    sortOrder
}: {
    search?: string | undefined;
    category?: string | undefined;
    manufacturer?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}) => {
    const andConditions: Prisma.MedicineWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } }
            ]
        });
    }

    if (category) {
        andConditions.push({
            category: {
                name: { equals: category, mode: "insensitive" }
            }
        });
    }

    if (manufacturer) {
        andConditions.push({
            manufacturer: { contains: manufacturer, mode: "insensitive" }
        });
    }

    if (minPrice !== undefined) {
        andConditions.push({ price: { gte: minPrice } });
    }

    if (maxPrice !== undefined) {
        andConditions.push({ price: { lte: maxPrice } });
    }

    const where: Prisma.MedicineWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const medicines = await prisma.medicine.findMany({
        where,
        take: limit,
        skip,
        orderBy: { [sortBy]: sortOrder },
        include: { 
            category: true,
            seller: {
                select: { name: true }
            }
        }
    });

    const total = await prisma.medicine.count({ where });

    return {
        data: medicines,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const getMedicineById = async (id: number) => {
    const result = await prisma.medicine.findUniqueOrThrow({
        where: { id },
        include: {
            category: true,
            seller: {
                select: { id: true, name: true, email: true }
            },
            reviews: {
                include: {
                    customer: {
                        select: { id: true, name: true }
                    }
                }
            }
        }
    });

    return result;
};

export const medicineService = {
    getAllMedicines,
    getMedicineById
};
