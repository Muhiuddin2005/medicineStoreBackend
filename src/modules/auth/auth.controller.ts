import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service.js";

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new Error("You are not authorized!");
        }
        
        const result = await authService.getCurrentUser(Number(req.user.id));
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error("You are not authorized!");
        const result = await authService.updateCurrentUser(Number(req.user.id), req.body);
        res.status(200).json({ success: true, message: "Profile updated successfully", data: result });
    } catch (error) {
        next(error);
    }
};

export const AuthController = {
    register,
    login,
    getMe,
    updateMe
};
