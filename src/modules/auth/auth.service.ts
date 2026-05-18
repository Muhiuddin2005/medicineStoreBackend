import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_for_jwt";

const registerUser = async (data: any) => {
    const { name, email, password, role } = data;

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error("User with this email already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || "CUSTOMER"
        }
    });

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};

const loginUser = async (data: any) => {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("Invalid email or password!");
    }

    if (!user.status) {
        throw new Error("Your account has been restricted by an admin.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password!");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};

const getCurrentUser = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new Error("User not found!");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const updateCurrentUser = async (userId: number, data: { name?: string; password?: string }) => {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.update({
        where: { id: userId },
        data: updateData
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const authService = {
    registerUser,
    loginUser,
    getCurrentUser,
    updateCurrentUser
};
