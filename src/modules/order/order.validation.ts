import { z } from "zod";

const createOrderSchema = z.object({
    body: z.object({
        items: z.array(
            z.object({
                medicineId: z.number({ message: "Medicine ID is required and must be a number" }).int(),
                quantity: z.number({ message: "Quantity is required and must be a number" }).int().positive(),
                price: z.number({ message: "Price is required and must be a number" }).positive(),
            })
        ).min(1, { message: "Order must contain at least one item" }),
        totalPrice: z.number({ message: "Total price is required and must be a positive number" }).positive(),
        shippingAddress: z.string({ message: "Shipping address is required" })
    }),
});

export const orderValidation = {
    createOrderSchema,
};
