import { NextFunction, Request, Response } from "express";
import { sellerService } from "./seller.service.js";

const addMedicine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = { ...req.body };
        if (req.file) {
            payload.imageUrl = req.file.path;
        }
        
        const result = await sellerService.addMedicine(Number(req.user!.id), payload);
        res.status(201).json({ success: true, message: "Medicine added successfully", data: result });
    } catch (error) {
        next(error);
    }
};

const updateMedicine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await sellerService.updateMedicine(Number(req.user!.id), Number(req.params.id), req.body);
        res.status(200).json({ success: true, message: "Medicine updated successfully", data: result });
    } catch (error) {
        next(error);
    }
};

const removeMedicine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await sellerService.removeMedicine(Number(req.user!.id), Number(req.params.id));
        res.status(200).json({ success: true, message: "Medicine successfully removed", data: result });
    } catch (error) {
        next(error);
    }
};

const getSellerOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await sellerService.getSellerOrders(Number(req.user!.id));
        res.status(200).json({ success: true, message: "Seller orders retrieved successfully", data: result });
    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await sellerService.updateOrderStatus(Number(req.user!.id), Number(req.params.id), req.body.status);
        res.status(200).json({ success: true, message: "Order status successfully updated", data: result });
    } catch (error) {
        next(error);
    }
};

const getSellerMedicines = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await sellerService.getSellerMedicines(Number(req.user!.id));
        res.status(200).json({ success: true, message: "Medicines retrieved", data: result });
    } catch (error) {
        next(error);
    }
};

export const SellerController = {
    addMedicine,
    updateMedicine,
    removeMedicine,
    getSellerOrders,
    updateOrderStatus,
    getSellerMedicines
};
