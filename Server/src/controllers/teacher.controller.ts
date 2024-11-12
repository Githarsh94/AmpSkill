import { Request, Response } from 'express';
import { Test } from '../models/test.model';
import { User } from '../models/user.model';
import { Batch } from '../models/batch.model';
import crypto from 'crypto'; // For generating a random password

// Function to generate a random password
const generateRandomPassword = (length: number): string => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

export const TeacherController = {
    uploadTest: async (req: Request, res: Response) => {
        console.log(req.body);
        const {
            title,
            description,
            questions,
            batches,
            startTime,
            loginWindow,
            testDuration,
            isFullScreenEnforced,
            isTabSwitchPreventionEnabled,
            isCameraAccessRequired,
        } = req.body;

        console.log(title, description, questions,batches, startTime, loginWindow, testDuration, isFullScreenEnforced, isTabSwitchPreventionEnabled, isCameraAccessRequired);
        try {
            // Generate a random password for the test if it's not provided
            const password = req.body.password || generateRandomPassword(8);
            const testCode = generateRandomPassword(6);

            // Validate required fields
            if (!title || !description || !questions || !startTime || !loginWindow || !testDuration) {
                return res.status(400).json({ message: "Missing required test fields" });
            }

            // Validate that the questions array is not empty and in the correct format
            if (!Array.isArray(questions) || questions.length === 0) {
                return res.status(400).json({ message: "Test must contain at least one question" });
            }

            // Process each question to ensure it follows the schema
            const formattedQuestions = questions.map((q: any, index: number) => ({
                s_no: q.s_no || index + 1, // Assign sequential s_no if not provided
                question: q.Question,
                op1: q.Op1,
                op2: q.Op2,
                op3: q.Op3,
                op4: q.Op4,
                ans: q.ans || "", // Assuming ans will be provided or default to an empty string
            }));

            // Process batch details if available
            const formattedBatches = Array.isArray(batches) ? batches.map((batch: any) => ({
                batchName: batch.batchName,
                department: batch.department,
                branch: batch.branch,
                year: batch.year,
            })) : [];

            // Create the test document
            const newTest = new Test({
                title,
                description,
                questions: formattedQuestions,
                batches: formattedBatches,
                testCode,
                password,
                startTime: new Date(startTime),
                loginWindow: parseInt(loginWindow, 10),
                testDuration: parseInt(testDuration, 10),
                isFullScreenEnforced: Boolean(isFullScreenEnforced),
                isTabSwitchPreventionEnabled: Boolean(isTabSwitchPreventionEnabled),
                isCameraAccessRequired: Boolean(isCameraAccessRequired),
            });

            // Save the test to the database
            await newTest.save();

            res.status(201).json({
                message: "Test created successfully",
                test: {
                    title: newTest.title,
                    description: newTest.description,
                    testCode: newTest.testCode,
                    startTime: newTest.startTime,
                    loginWindow: newTest.loginWindow,
                    testDuration: newTest.testDuration,
                },
            });
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
    },

    updateBatch: async (req: Request, res: Response) => {
        const { batchName, department, branch, year, teacherEmail, updates } = req.body;
        try {
            const existingBatch = await Batch.findOne({ batchName, department, branch, year });
            if (!existingBatch) {
                return res.status(404).json({ message: 'Batch does not exist or access denied. Contact admin.' });
            }

            const isTeacherInBatch = existingBatch.teachers.some(teacherRecord => teacherRecord.teacher === teacherEmail);
            if (!isTeacherInBatch) {
                return res.status(403).json({ message: 'Access denied. You are not teaching this batch. Contact admin.' });
            }

            Object.keys(updates).forEach((key) => {
                (existingBatch as any)[key] = updates[key as keyof typeof updates];
            });

            await existingBatch.save();
            res.status(200).json({ message: 'Batch updated successfully', batch: existingBatch });
        }
        catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    },

    viewBatches: async (req: Request, res: Response) => {
        const { teacherEmail } = req.body;
        try {
            const batches = await Batch.find();
            if (!batches || batches.length === 0) {
                return res.status(404).json({ message: 'No batches found or access denied. Contact admin.' });
            }

            const teacherBatches = batches.filter(batch =>
                batch.teachers.some(teacherRecord => teacherRecord.teacher === teacherEmail)
            );

            if (teacherBatches.length > 0) {
                return res.status(200).json({ message: 'Batches found', batches: teacherBatches });
            } else {
                return res.status(403).json({ message: 'Access denied to any batch. Contact admin.' });
            }
        } catch (err) {
            return res.status(500).json({ message: (err as Error).message });
        }
    },

    getStudentsOfBatch: async (req: Request, res: Response) => {
        const { batchName, department, branch, year, teacherEmail } = req.body;

        try {
            const existingBatch = await Batch.findOne({ batchName, department, branch, year });
            if (!existingBatch) {
                return res.status(404).json({ message: 'Batch does not exist or access denied. Contact admin.' });
            }

            const isTeacherInBatch = existingBatch.teachers.some(teacherRecord => teacherRecord.teacher === teacherEmail);
            if (!isTeacherInBatch) {
                return res.status(403).json({ message: 'Access denied. You are not teaching this batch. Contact admin.' });
            }

            const students = await User.find({
                email: { $in: existingBatch.students },
                role: 'student'
            });

            return res.status(200).json({ students });
        } catch (err) {
            return res.status(500).json({ message: (err as Error).message });
        }
    },

    addSingleQues: async (req: Request, res: Response) => {
        const { testId, question, op1, op2, op3, op4, ans } = req.body;

        try {
            const test = await Test.findOne({ testCode: testId });
            if (!test) {
                return res.status(404).json({ message: 'Test not found' });
            }

            const nextSNo = test.questions.length > 0
                ? test.questions[test.questions.length - 1].s_no + 1
                : 1;

            const newQuestion = { s_no: nextSNo, question, op1, op2, op3, op4, ans };
            test.questions.push(newQuestion);

            await test.save();

            return res.status(200).json({ message: 'Question added successfully' });
        } catch (err) {
            return res.status(500).json({ message: (err as Error).message });
        }
    },

    updateSingleQues: async (req: Request, res: Response) => {
        const { testId, question, newQuestion, op1, op2, op3, op4, ans } = req.body;

        try {
            const test = await Test.findOne({ testCode: testId });
            if (!test) {
                return res.status(404).json({ message: 'Test not found' });
            }

            const questionToUpdate = test.questions.find(q => q.question === question);
            if (!questionToUpdate) {
                return res.status(404).json({ message: `Question not found` });
            }

            if (newQuestion) questionToUpdate.question = newQuestion;
            if (op1) questionToUpdate.op1 = op1;
            if (op2) questionToUpdate.op2 = op2;
            if (op3) questionToUpdate.op3 = op3;
            if (op4) questionToUpdate.op4 = op4;
            if (ans) questionToUpdate.ans = ans;

            await test.save();

            return res.status(200).json({ message: 'Question updated successfully', test });
        } catch (err) {
            return res.status(500).json({ message: (err as Error).message });
        }
    },
};