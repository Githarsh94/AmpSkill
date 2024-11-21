// src/middlewares/isStudent.middleware.ts
import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { User, IUser } from '../models/user.model';

export const isStudent = async (req: Request, res: Response, next: NextFunction) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const userRecord = await admin.auth().getUser(decodedToken.uid);

        const user = await User.findOne({ email: userRecord.email });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (user.role !== 'student') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
