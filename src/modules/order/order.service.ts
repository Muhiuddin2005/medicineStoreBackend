import { prisma } from "../../lib/prisma.js";

const createOrder = async (customerId: number, payload: { items: { medicineId: number, quantity: number, price: number }[], totalPrice: number, shippingAddress: string }) => {
    const result = await prisma.$transaction(async (tx) => {
        for (const item of payload.items) {
            const medicine = await tx.medicine.findUniqueOrThrow({
                where: { id: item.medicineId }
            });
            if (medicine.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${medicine.name}. Only ${medicine.stock} units available.`);
            }
        }
        const order = await tx.order.create({
            data: {
                customerId,
                totalPrice: payload.totalPrice,
                shippingAddress: payload.shippingAddress,
                status: "PLACED",
                items: {
                    create: payload.items.map(item => ({
                        medicineId: item.medicineId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: true
            }
        });
        for (const item of payload.items) {
            await tx.medicine.update({
                where: { id: item.medicineId },
                data: {
                    stock: { decrement: item.quantity }
                }
            });
        }

        return order;
    });

    return result;
};

const getCustomerOrders = async (customerId: number) => {
    return await prisma.order.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: {
                    medicine: {
                        select: { id: true, name: true, price: true }
                    }
                }
            }
        }
    });
};

const getOrderById = async (customerId: number, orderId: number) => {
    return await prisma.order.findFirstOrThrow({
        where: { 
            id: orderId,
            customerId: customerId 
        },
        include: {
            items: {
                include: {
                    medicine: true
                }
            }
        }
    });
};

const cancelOrder = async (customerId: number, orderId: number) => {
    return await prisma.$transaction(async (tx) => {
        const order = await tx.order.findFirstOrThrow({
            where: { 
                id: orderId,
                customerId: customerId 
            },
            include: {
                items: true
            }
        });

        if (order.status !== "PLACED") {
            throw new Error("You can only cancel orders that are currently PLACED.");
        }

        for (const item of order.items) {
            await tx.medicine.update({
                where: { id: item.medicineId },
                data: {
                    stock: { increment: item.quantity }
                }
            });
        }

        return await tx.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED", cancelledAt: new Date() }
        });
    });
};

export const orderService = {
    createOrder,
    getCustomerOrders,
    getOrderById,
    cancelOrder
};
