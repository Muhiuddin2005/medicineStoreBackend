import { prisma } from "../../lib/prisma.js";
import type { OrderStatus } from "@prisma/client";

const addMedicine = async (sellerId: number, data: any) => {
    return await prisma.medicine.create({
        data: {
            ...data,
            sellerId
        }
    });
};

const updateMedicine = async (sellerId: number, medicineId: number, data: any) => {
    const medicine = await prisma.medicine.findUniqueOrThrow({
        where: { id: medicineId }
    });

    if (medicine.sellerId !== sellerId) {
        throw new Error("Forbidden! You do not own this medicine to update it.");
    }

    return await prisma.medicine.update({
        where: { id: medicineId },
        data
    });
};

const removeMedicine = async (sellerId: number, medicineId: number) => {
    const medicine = await prisma.medicine.findUniqueOrThrow({
        where: { id: medicineId }
    });

    if (medicine.sellerId !== sellerId) {
        throw new Error("Forbidden! You do not own this medicine to delete it.");
    }

    return await prisma.medicine.delete({
        where: { id: medicineId }
    });
};

const getSellerOrders = async (sellerId: number) => {
    const orderItems = await prisma.orderItem.findMany({
        where: {
            medicine: {
                sellerId
            }
        },
        include: {
            order: {
                include: {
                    customer: {
                        select: { id: true, name: true, email: true }
                    }
                }
            },
            medicine: {
                select: { id: true, name: true, price: true }
            }
        }
    });
    return orderItems;
};

const updateOrderStatus = async (sellerId: number, orderId: number, status: OrderStatus) => {
    const validOrderItem = await prisma.orderItem.findFirst({
        where: {
            orderId: orderId,
            medicine: {
                sellerId
            }
        }
    });

    if (!validOrderItem) {
        throw new Error("Forbidden! You do not have permissions for this order.");
    }

    const updateData: any = { status };
    const now = new Date();
    if (status === "PROCESSING") {
        updateData.processingAt = now;
    } else if (status === "SHIPPED") {
        updateData.shippedAt = now;
    } else if (status === "DELIVERED") {
        updateData.deliveredAt = now;
    } else if (status === "CANCELLED") {
        updateData.cancelledAt = now;
    }

    return await prisma.order.update({
        where: { id: orderId },
        data: updateData
    });
};

const getSellerMedicines = async (sellerId: number) => {
    return await prisma.medicine.findMany({
        where: { sellerId },
        include: { category: true },
        orderBy: { id: 'desc' }
    });
};

export const sellerService = {
    addMedicine,
    updateMedicine,
    removeMedicine,
    getSellerOrders,
    updateOrderStatus,
    getSellerMedicines
};
