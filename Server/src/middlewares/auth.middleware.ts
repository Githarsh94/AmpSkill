// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase/auth';

export const AuthMiddleware = {
    isAuthenticated: async (req: Request, res: Response, next: NextFunction) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    },
};
