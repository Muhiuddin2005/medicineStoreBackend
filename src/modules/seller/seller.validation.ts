import { z } from "zod";

const addMedicineSchema = z.object({
    body: z.object({
        name: z.string({ message: "Medicine name is required" }),
        description: z.string({ message: "Description is required" }),
        price: z.coerce.number().positive("Price must be a positive number"),
        stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
        categoryId: z.coerce.number().int(),
        manufacturer: z.string({ message: "Manufacturer is required" }),
    }),
});

const updateMedicineSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.coerce.number().positive("Price must be a positive number").optional(),
        stock: z.coerce.number().int().min(0, "Stock cannot be negative").optional(),
        categoryId: z.coerce.number().int().optional(),
        manufacturer: z.string().optional()
    }),
});

const updateOrderStatusSchema = z.object({
    body: z.object({
        status: z.enum(["PLACED", "PROCESSING", "CANCELLED", "SHIPPED", "DELIVERED"] as const),
    }),
});

export const sellerValidation = {
    addMedicineSchema,
    updateMedicineSchema,
    updateOrderStatusSchema,
};
