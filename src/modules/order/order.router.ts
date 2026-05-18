import { Router } from "express";
import { OrderController } from "./order.controller.js";
import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { orderValidation } from "./order.validation.js";

const orderRouter = Router();

orderRouter.post('/', auth('CUSTOMER'), validateRequest(orderValidation.createOrderSchema), OrderController.createOrder);
orderRouter.get('/', auth('CUSTOMER'), OrderController.getCustomerOrders);
orderRouter.get('/:id', auth('CUSTOMER'), OrderController.getOrderById);
orderRouter.patch('/:id/cancel', auth('CUSTOMER'), OrderController.cancelOrder);

export default orderRouter;
