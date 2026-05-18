import { prisma } from "../../lib/prisma.js";

const getAllUsers = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { id: "desc" }
    });

    const total = await prisma.user.count();
    const safeUsers = users.map(user => {
        const { password, ...profile } = user;
        return profile;
    });

    return {
        data: safeUsers,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const toggleUserStatus = async (userId: number, targetStatus: boolean) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: { status: targetStatus }
    });

    const { password, ...safeUser } = user;
    return safeUser;
};

const getAllMedicines = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const total = await prisma.medicine.count();
    const medicines = await prisma.medicine.findMany({ skip, take: limit });
    return { data: medicines, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

const getAllOrders = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const total = await prisma.order.count();
    const orders = await prisma.order.findMany({ 
        skip, 
        take: limit, 
        include: { 
            customer: {
                select: { name: true }
            },
            items: true 
        } 
    });
    return { data: orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

const createCategory = async (name: string) => {
    return await prisma.category.create({ data: { name } });
};

const updateCategory = async (id: number, data: { name?: string }) => {
    return await prisma.category.update({ where: { id }, data });
};

const deleteCategory = async (id: number) => {
    return await prisma.category.delete({ where: { id } });
};

export const adminService = {
    getAllUsers,
    toggleUserStatus,
    getAllMedicines,
    getAllOrders,
    createCategory,
    updateCategory,
    deleteCategory
};
