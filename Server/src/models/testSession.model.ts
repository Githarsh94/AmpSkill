//We will create the test session for the student when the student starts its test session. 
import { Document, Schema, model } from 'mongoose';

interface ans{
    question_no: number;
    answer: string;
}
interface ITestSession extends Document {
    testCode: string;
    studentEmail: string;
    startTime: Date;
    endTime: Date;
    isCompleted: boolean;
    answers: ans[];
    totalQuestions: number;
    attemptedQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    score: number;
}
const TestSessionSchema = new Schema<ITestSession>({
    testCode: { type: String, required: true },
    studentEmail: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date,required: true},
    isCompleted: { type: Boolean, default: false },
    answers: { type: [{ question_no: Number, answer: String }], default: [] },
    totalQuestions: { type: Number, required: true },
    attemptedQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    incorrectAnswers: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
})
export const TestSession = model<ITestSession>('TestSession', TestSessionSchema);