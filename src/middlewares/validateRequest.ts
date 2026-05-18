import { NextFunction, Request, Response } from "express";

const validateRequest =
    (schema: any) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                cookies: req.cookies,
            });
            if (parsed.body) req.body = parsed.body;
            if (parsed.query) {
                for (const key in parsed.query) {
                    req.query[key] = parsed.query[key];
                }
            }
            if (parsed.cookies) req.cookies = parsed.cookies;
            return next();
        } catch (error) {
            next(error);
        }
    };

export default validateRequest;
