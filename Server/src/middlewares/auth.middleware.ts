// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { User, IUser } from '../models/user.model';

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const idToken = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const firebaseUser = await admin.auth().getUser(decodedToken.uid);

        // Fetch user from MongoDB
        const user = await User.findOne({ uid: firebaseUser.uid });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Use type assertion here to tell TypeScript that req.user exists and is of type IUser
        (req as Request & { user: IUser }).user = user;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};
