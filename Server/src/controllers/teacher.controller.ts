// src/controllers/teacher.controller.ts
import { Request, Response } from 'express';
import { Test } from '../models/test.model';
import { User } from '../models/user.model';
import { Batch } from '../models/batch.model';
import xlsx from 'xlsx';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import express from 'express';
const fs=require('fs');
import crypto from 'crypto'; // For generating a random password

// Function to generate a random password
const generateRandomPassword = (length: number): string => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

// Define the custom interface for the request
interface CustomRequest extends express.Request {
    fileValidationError?: string;
}
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (
        req: CustomRequest,
        file: Express.Multer.File,
        callback: DestinationCallback
    ): void => {
        callback(null, 'uploads'); // Files will be stored in the 'uploads' directory
    },

    filename: (
        req: CustomRequest,
        file: Express.Multer.File,
        callback: FileNameCallback
    ): void => {
        const extname = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extname);
        callback(null, `${basename}-${Date.now()}${extname}`); // e.g., filename-1234567890.xlsx
    }
});

// File filter function to validate file types
const fileFilter = (
    req: CustomRequest, // Use CustomRequest here
    file: Express.Multer.File,
    callback: FileFilterCallback
): void => {
    const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'text/csv' // .csv
    ];

    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true); // No error, accept the file
    } else {
        req.fileValidationError = 'Invalid file type. Only Excel and CSV files are allowed.';
        callback(null, false); // No error, but reject the file
    }
};

// Initialize multer with storage and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter }).single('myFile');

export const TeacherController = {
    
    uploadTest: async (req: CustomRequest, res: express.Response) => {
        upload(req, res, async (err) => {
            try {
                if (err) {
                    console.error('File upload error:', err);
                    return res.status(400).send(err.message);
                }
    
                if (req.fileValidationError) {
                    return res.status(400).send(req.fileValidationError);
                }
    
                if (!req.file) {
                    return res.status(400).send('No file selected!');
                }
    
                const {title, description, startTime, loginWindow, testDuration, batches } = req.body;
    
                // Parse the batches array from the string received in the request body
                let parsedBatches;
                try {
                    parsedBatches = JSON.parse(batches);
                } catch (parseError) {
                    console.error('Error parsing batches:', parseError);
                    return res.status(400).json({ message: 'Invalid batches format' });
                }
                
                for (const batch of parsedBatches) {
                    const { batchName, department, branch, year } = batch;
                    const foundBatch = await Batch.findOne({ batchName, department, branch, year });

                    if (!foundBatch) {
                        // console.warn(`Batch ${batchName} ${department} ${branch} ${year} not found.`);
                        return res.status(404).json({ message: `Batch ${batchName} ${department} ${branch} ${year} not found.` });
                    }
                }
                let testCode= generateRandomPassword(6);
                // Check if a test with the same testCode already exists
                let existingTest = await Test.findOne({ testCode });
                while (existingTest) {
                    testCode= generateRandomPassword(6);
                    existingTest = await Test.findOne({ testCode });
                }
    
                // Generate a random password
                const randomPassword = generateRandomPassword(12); // Adjust length as needed
    
                // Read the Excel or CSV file contents
                const workbook = xlsx.readFile(req.file.path);
                const sheetName = workbook.SheetNames[0]; // Assume the first sheet
                const worksheet = workbook.Sheets[sheetName];
                const data = xlsx.utils.sheet_to_json(worksheet);
    
                // Process the data from the Excel or CSV file
                // console.log('Data from file:', data);
    
                // Extract questions from file data (assuming data is in the correct format)
                const questions = data.map((item: any, index: number) => ({
                    s_no: index + 1,
                    question: item.Question,
                    op1: item.Op1,
                    op2: item.Op2,
                    op3: item.Op3,
                    op4: item.Op4,
                    ans: item.Ans,
                }));
    
                // Create and save the test document
                const newTest = new Test({
                    title,
                    description,
                    questions,
                    batches: parsedBatches,
                    testCode,
                    startTime: new Date(startTime),
                    loginWindow,
                    testDuration,
                    password: randomPassword, // Include the random password
                });
    
                await newTest.save();
    
                // Delete the file after processing if not needed anymore
                fs.unlinkSync(req.file.path);
    
                // Send a response indicating successful upload and processing
                return res.status(200).json({ message: 'File uploaded and test created successfully' });
            } catch (error) {
                console.error('Error processing the request:', error);
    
                // Delete the file in case of an error
                if (req.file && req.file.path) {
                    fs.unlinkSync(req.file.path);
                }
    
                return res.status(500).json({ message: 'Error processing the request.' });
            }
        });
    },
    
    profile: async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            // console.log(user);
            if (!user) throw new Error("User doesn't exist");
            else res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },
    updateBatch: async (req: Request, res: Response)=>{
        const { batchName, department, branch, year, teacherEmail, updates } = req.body as {
            batchName: string;
            department: string;
            branch: string;
            year: number;
            teacherEmail: string;
            updates: Partial<{
                batchName: string;
                department: string;
                branch: string;
                year: number;
                students: string[];
                teachers: { teacher: string; subject: string }[];
            }>;
        };
        try{
             // Retrieve the batch
             const existingBatch = await Batch.findOne({ batchName, department, branch, year });

             if (!existingBatch) {
                 return res.status(404).json({ message: 'Batch does not exist or access denied. Contact admin.' });
             }
 
             // Check if the teacher is in the batch's teachers array
             const isTeacherInBatch = existingBatch.teachers.some(teacherRecord => teacherRecord.teacher === teacherEmail);
 
             if (!isTeacherInBatch) {
                 return res.status(403).json({ message: 'Access denied. You are not teaching this batch. Contact admin.' });
             }
             console.log(isTeacherInBatch);
            //  Apply the updates if the teacher is in the batch
             Object.keys(updates).forEach((key) => {
                 (existingBatch as any)[key] = updates[key as keyof typeof updates];
             });
 
            //  Save the updated batch
             await existingBatch.save();
            res.status(200).json({ message: 'Batch updated successfully', batch: existingBatch });

        }
        catch(err){
            res.status(500).json({ message: (err as Error).message });
        }
    },
    viewBatches: async (req: Request, res: Response) => {
        const { teacherEmail } = req.body;

        try {
            // Retrieve all batches
            const batches = await Batch.find();

            if (!batches || batches.length === 0) {
                return res.status(404).json({ message: 'No batches found or access denied. Contact admin.' });
            }

            // Filter the batches to include only those where the teacher teaches
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
    getStudentsOfBatch: async (req: Request, res: Response)=>{
        const { batchName, department, branch, year, teacherEmail } = req.body;

        try {
            // Find the specific batch
            const existingBatch = await Batch.findOne({ batchName, department, branch, year });

            if (!existingBatch) {
                return res.status(404).json({ message: 'Batch does not exist or access denied. Contact admin.' });
            }

            // Check if the teacher is in the batch's teachers array
            const isTeacherInBatch = existingBatch.teachers.some(teacherRecord => teacherRecord.teacher === teacherEmail);

            if (!isTeacherInBatch) {
                return res.status(403).json({ message: 'Access denied. You are not teaching this batch. Contact admin.' });
            }

            // If the teacher has access, return the students of the batch
            return res.status(200).json({ students: existingBatch.students });
        } catch (err) {
            return res.status(500).json({ message: (err as Error).message });
        }
    },
    addSingleQues: async (req: Request, res: Response) => {
        const { testId, question, op1, op2, op3, op4, ans } = req.body;
    
        try {
            // Find the test document by testCode
            const test = await Test.findOne({ testCode: testId });
    
            if (!test) {
                return res.status(404).json({ message: 'Test not found' });
            }
    
            // Calculate the next s_no
            const nextSNo = test.questions.length > 0 
                ? test.questions[test.questions.length - 1].s_no + 1 
                : 1;
    
            // Create a new question object
            const newQuestion = {
                s_no: nextSNo,
                question,
                op1,
                op2,
                op3,
                op4,
                ans
            };
    
            // Add the new question to the questions array
            test.questions.push(newQuestion);
    
            // Save the updated test document
            await test.save();
    
            return res.status(200).json({ message: 'Question added successfully' });
        } catch (err) {
            return res.status(500).json({ message: (err as Error).message });
        }
    },

    updateSingleQues: async (req: Request, res: Response) => {
        const { testId, question, newQuestion,op1, op2, op3, op4, ans } = req.body;
    
        try {
            // Find the test document by testCode
            const test = await Test.findOne({ testCode: testId });
    
            if (!test) {
                return res.status(404).json({ message: 'Test not found' });
            }
    
            // Find the question by its s_no
            const questionToUpdate = test.questions.find(q => q.question === question);
    
            if (!questionToUpdate) {
                return res.status(404).json({ message: `Question not found` });
            }
    
            // Update the question details
            if (newQuestion) questionToUpdate.question = newQuestion;
            if (op1) questionToUpdate.op1 = op1;
            if (op2) questionToUpdate.op2 = op2;
            if (op3) questionToUpdate.op3 = op3;
            if (op4) questionToUpdate.op4 = op4;
            if (ans) questionToUpdate.ans = ans;
    
            // Save the updated test document
            await test.save();
    
            return res.status(200).json({ message: 'Question updated successfully', test });
        } catch (err) {
            return res.status(500).json({ message: (err as Error).message });
        }   
    },
    
};
