// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import { Batch } from '../models/batch.model';
import { User } from '../models/user.model';

export const AdminController = {
    assignTeachersToBatch: async (req: Request, res: Response) => {
        const { batchId, teacherIds } = req.body;
        try {
            const batch = await Batch.findById(batchId);
            if (!batch) {
                return res.status(404).json({ message: 'Batch not found' });
            }
            batch.teachers = teacherIds;
            await batch.save();
            res.status(200).json({ message: 'Teachers assigned successfully' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },
    profile: async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) throw new Error("User doesn't exist");
            else res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

};
