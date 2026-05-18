import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicine.service.js";
import paginationSortingHelper from "../../helpers/paginationSortingHelper.js";

const getAllMedicines = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, category, manufacturer, minPrice, maxPrice } = req.query;
        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

        const result = await medicineService.getAllMedicines({
            search: search ? (search as string).trim() : undefined,
            category: category ? (category as string).trim() : undefined,
            manufacturer: manufacturer ? (manufacturer as string).trim() : undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            page,
            limit,
            skip,
            sortBy,
            sortOrder
        });

        res.status(200).json({ 
            success: true, 
            message: "Medicines retrieved successfully", 
            data: result.data, 
            meta: result.pagination 
        });
    } catch (error) {
        next(error);
    }
};

const getMedicineById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await medicineService.getMedicineById(Number(req.params.id));
        res.status(200).json({ 
            success: true, 
            message: "Medicine details retrieved successfully", 
            data: result 
        });
    } catch (error) {
        next(error);
    }
};

export const MedicineController = {
    getAllMedicines,
    getMedicineById
};
