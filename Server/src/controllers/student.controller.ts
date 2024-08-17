// src/controllers/student.controller.ts
import { Request, Response } from 'express';
import { Test } from '../models/test.model';

export const StudentController = {
    enterTest: async (req: Request, res: Response) => {
        const { testCode, password } = req.body;
        try {
            const test = await Test.findOne({ testCode, password });
            if (!test) {
                return res.status(404).json({ message: 'Invalid test code or password' });
            }
            res.status(200).json({ message: 'Test found', test });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },
};
