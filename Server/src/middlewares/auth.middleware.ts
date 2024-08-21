// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebaseAdmin';

export const AuthMiddleware = {
    isAuthenticated: async (req: Request, res: Response, next: NextFunction) => {
        const user = auth.getUser;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    },
};
