import { Schema, model, Document } from 'mongoose';
//Rank : required ....fetch from testSession
//Maximum Marks 
//Score
//Time Taken
//IncorrectQue
//CorrectQue
//SkippedQue
//Percentage
//AvgTimeTakenPerQue
//subjectName
//title
interface IScoreCard extends Document {
    email: string;
    testCode: string;
    subjectName: string;
    title: string;
    rank: number;
    maximumMarks: number;
    score: number;
    timeTaken: number;
    incorrectAnswers: number;
    correctAnswers: number;
    skippedAnswers: number;
    percentage: number;
    avgTimeTakenPerQue: number;
    totalTime: number;
    totalQuestions: number;
}

const ScoreCardSchema = new Schema<IScoreCard>({
    email: { type: String, required: true },
    testCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    title: { type: String, required: true },
    rank: { type: Number, required: true },
    maximumMarks: { type: Number, required: true },
    score: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    incorrectAnswers: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    skippedAnswers: { type: Number, required: true },
    percentage: { type: Number, required: true },
    avgTimeTakenPerQue: { type: Number, required: true },
    totalTime: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
});

export const ScoreCard = model<IScoreCard>('ScoreCard', ScoreCardSchema);