// src/controllers/teacher.controller.ts
import { Request, Response } from 'express';
import { Test } from '../models/test.model';
import csv from 'csvtojson';
import xlsx from 'xlsx';

export const TeacherController = {
    addTest: async (req: Request, res: Response) => {
        const { batchId, title, description, questions, testCode, password } = req.body;
        try {
            const test = new Test({ title, description, questions, batch: batchId, testCode, password });
            await test.save();
            res.status(201).json({ message: 'Test added successfully' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    uploadQuestions: async (req: Request, res: Response) => {
        const { format } = req.body;
        const file = req.file;

        try {
            let questions = [];

            if (format === 'csv') {
                questions = await csv().fromFile(file!.path);
            } else if (format === 'xlsx') {
                const workbook = xlsx.readFile(file!.path);
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                questions = xlsx.utils.sheet_to_json(sheet);
            } else if (format === 'json') {
                questions = JSON.parse(file!.buffer.toString());
            }

            res.status(200).json({ questions });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },
};
