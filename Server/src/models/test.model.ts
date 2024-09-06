import { Schema, model, Document } from 'mongoose';

// Interface for the question structure
interface IQuestion {
    s_no: number;
    question: string;
    op1: string;
    op2: string;
    op3: string;
    op4: string;
    ans: string;
}
// Interface for the test document
interface ITest extends Document {
    title: string;
    description: string;
    questions: IQuestion[]; // Array of questions
    batches: IBatch[]; // Array of batch objects
    testCode: string;
    password: string;
    startTime: Date; // Start time of the test
    loginWindow: number; // Login window duration in minutes
    testDuration: number; // Test duration in minutes
}

// Define the schema for the question structure
const questionSchema = new Schema<IQuestion>({
    s_no: { type: Number, required: true },
    question: { type: String, required: true },
    op1: { type: String, required: true },
    op2: { type: String, required: true },
    op3: { type: String, required: true },
    op4: { type: String, required: true },
    ans: { type: String, required: true },
});

// Interface for the batch structure
interface IBatch {
    batchName: string;
    department: string;
    branch: string;
    year: string;
}

// Define the schema for the batch structure
const batchSchema = new Schema<IBatch>({
    batchName: { type: String },
    department: { type: String },
    branch: { type: String},
    year: { type: String },
});

// Define the schema for the test document
const testSchema = new Schema<ITest>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: { type: [questionSchema], default: [] }, // Array of question objects
    batches: { type: [batchSchema], default: [] }, // Array of batch objects
    testCode: { type: String, required: true },
    password: { type: String, required: true },
    startTime: { type: Date, required: true }, // Start time of the test
    loginWindow: { type: Number, required: true }, // Login window duration in minutes
    testDuration: { type: Number, required: true }, // Test duration in minutes
});

// Export the model
export const Test = model<ITest>('Test', testSchema);