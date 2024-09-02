// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import { Batch } from '../models/batch.model';
import { User } from '../models/user.model';

export const AdminController = {
    assignTeachersToBatch: async (req: Request, res: Response) => {
        const { batchName, department, branch, year, teachers } = req.body;

        try {
            // Find the batch by multiple criteria
            const batch = await Batch.findOne({ batchName, department, branch, year });

            if (!batch) {
                return res.status(404).json({ message: 'Batch not found' });
            }

            // Ensure teachers array is correctly typed
            if (Array.isArray(teachers) && teachers.every(t => t.teacher && t.subject)) {
                const nonExistingTeachers = [];
                const nonTeachers = [];
                const existingTeachers = [];
                for (const obj of teachers) {
                    const user = await User.findOne({ email: obj.teacher });
                    if (!user) {
                        nonExistingTeachers.push(obj.teacher);
                    } else if (user.role !== 'teacher') {
                        nonTeachers.push(obj.teacher);
                    } else {
                        const existingTeacher = batch.teachers.find(t => t.teacher === obj.teacher && t.subject === obj.subject);
                        if (existingTeacher) {
                            existingTeachers.push(`${obj.teacher} - ${obj.subject}`);
                        }
                    }
                }
                if (nonExistingTeachers.length > 0) {
                    return res.status(400).json({ message: `The following teachers are not users of the platform: ${nonExistingTeachers.join(', ')} `});
                }
                if (nonTeachers.length > 0) {
                    return res.status(400).json({ message: `The following email ids don't have a teacher role: ${nonTeachers.join(', ')} `});
                }
                if (existingTeachers.length > 0) {
                    return res.status(400).json({ message: `The following teachers are already assigned to the respective subjects: ${existingTeachers.join(', ')} `});
                }
                // Update the teachers field
                batch.teachers.push(...teachers.map(t => ({ teacher: t.teacher, subject: t.subject })));
            } else {
                return res.status(400).json({ message: 'Invalid teachers format' });
            }

            // Save the updated batch document
            await batch.save();

            return res.status(200).json({ message: 'Teachers assigned successfully' });
        } catch (error) {
            return res.status(500).json({ message: (error as Error).message });
        }
    },
    addBatch: async (req: Request, res: Response) => {
        const { batchName, department, branch, year, students, teachers } = req.body;
        try {
            const existingBatch = await Batch.findOne({ batchName, department, branch, year });
            if (existingBatch) {
                return res.status(400).json({ message: 'A batch with the same properties already exists' });
            }
            const nonExistingStudents = [];
            const nonStudents = [];
            for (const email of students) {
                const user = await User.findOne({ email });
                if (!user) {
                    nonExistingStudents.push(email);
                } else if (user.role !== 'student') {
                    nonStudents.push(email);
                }
            }
            if (nonExistingStudents.length > 0) {
                return res.status(400).json({ message: `The following students are not users of the platform: ${nonExistingStudents.join('')}` });
            }
            if (nonStudents.length > 0) {
                return res.status(400).json({ message: `The following email ids don't have a student role: ${nonStudents.join('')}` });
            }
            const nonExistingTeachers = [];
            const nonTeachers = [];
            for (const obj of teachers) {
                const user = await User.findOne({ email: obj.teacher });
                if (!user) {
                    nonExistingTeachers.push(obj.teacher);
                } else if (user.role !== 'teacher') {
                    nonTeachers.push(obj.email);
                }
            }
            if (nonExistingTeachers.length > 0) {
                return res.status(400).json({ message: `The following teachers are not users of the platform: ${nonExistingTeachers.join(', ')}` });
            }
            if (nonTeachers.length > 0) {
                return res.status(400).json({ message: `The following email ids don't have a teacher role: ${nonTeachers.join(', ')}` });
            }
            const newBatch = new Batch({
                batchName,
                department,
                branch,
                year,
                students,
                teachers,
                createdAt: new Date(),
            });
            await newBatch.save();
            res.status(201).json({ message: 'Batch created successfully' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },
    profile: async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) res.status(404).json({ message: 'User does not exist.' });
            else res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
};
