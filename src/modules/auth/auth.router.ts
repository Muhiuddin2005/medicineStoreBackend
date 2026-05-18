import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { authValidation } from "./auth.validation.js";

const authRouter = Router();

authRouter.post('/register', validateRequest(authValidation.registerValidationSchema), AuthController.register);
authRouter.post('/login', validateRequest(authValidation.loginValidationSchema), AuthController.login);
authRouter.get('/me', auth(), AuthController.getMe);
authRouter.patch('/me', auth(), AuthController.updateMe);

export default authRouter;
