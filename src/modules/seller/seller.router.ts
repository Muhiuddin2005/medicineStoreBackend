import { Router } from "express";
import { SellerController } from "./seller.controller.js";
import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { sellerValidation } from "./seller.validation.js";
import { upload } from "../../middlewares/upload.js";

const sellerRouter = Router();
sellerRouter.post('/medicines', auth('SELLER'), upload.single('image'), validateRequest(sellerValidation.addMedicineSchema), SellerController.addMedicine);
sellerRouter.get('/medicines', auth('SELLER'), SellerController.getSellerMedicines);
sellerRouter.put('/medicines/:id', auth('SELLER'), validateRequest(sellerValidation.updateMedicineSchema), SellerController.updateMedicine);
sellerRouter.delete('/medicines/:id', auth('SELLER'), SellerController.removeMedicine);
sellerRouter.get('/orders', auth('SELLER'), SellerController.getSellerOrders);
sellerRouter.patch('/orders/:id', auth('SELLER'), validateRequest(sellerValidation.updateOrderStatusSchema), SellerController.updateOrderStatus);

export default sellerRouter;
