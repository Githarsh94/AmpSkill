// src/middlewares/role.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';

export const RoleMiddleware = {
    isAdmin: async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.findById((req as any).user.id);
        if (user?.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    },

    isTeacher: async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.findById((req as any).user.id);
        if (user?.role !== 'teacher') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    },

    isStudent: async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.findById((req as any).user.id);
        if (user?.role !== 'student') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    },
};
