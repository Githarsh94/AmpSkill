import { Request, Response } from 'express';
import { ScoreCard } from '../models/scoreCard.model';
import { Test } from '../models/test.model';
import { Batch } from '../models/batch.model';
import { TestSession } from '../models/testSession.model';

export const ReportsController = {
    fetchTestScoreCard: async (req: Request, res: Response) => {
        const { email, testCode } = req.body;

        try {
            const test = await Test.findOne({ testCode });
            if (!test) {
                return res.status(404).json({ message: 'Test not found' });
            }

            const batch = await Batch.findOne({ students: [email] });
            if (!batch) {
                return res.status(404).json({ message: 'You have not been assigned to any batch yet.' });
            }

            const assignedTest = await Test.findOne({ testCode, 'batches.batchName': batch.batchName });
            if (!assignedTest) {
                return res.status(404).json({ message: 'This test has not been assigned to your batch.' });
            }

            const testSession = await TestSession.findOne({ studentEmail: email, testCode });
            if (!testSession) {
                return res.status(404).json({ message: 'You have not attempted this test.' });
            }

            const scoreCard = await ScoreCard.findOne({ email, testCode });

            // also have topper's score and time taken from the same batch and test
            const topper = await ScoreCard.findOne({ testCode ,rank: 1 });
            if(!topper){
                return res.status(404).json({ message: 'Topper not found' });
            }
            const allStudentsScore = await ScoreCard.find({ testCode });
            const totalCandidates = allStudentsScore.length;
            const data ={
                scoreCard: {
                    email: scoreCard?.email,
                    testCode: scoreCard?.testCode,
                    rank: scoreCard?.rank,
                    maximumMarks: scoreCard?.maximumMarks,
                    score: scoreCard?.score,
                    timeTaken: scoreCard?.timeTaken,
                    incorrectAnswers: scoreCard?.incorrectAnswers,
                    correctAnswers: scoreCard?.correctAnswers,
                    skippedAnswers: scoreCard?.skippedAnswers,
                    percentage: scoreCard?.percentage,
                    avgTimeTakenPerQue: scoreCard?.avgTimeTakenPerQue,
                    totalTime: scoreCard?.totalTime,
                    totalQuestions: scoreCard?.totalQuestions
                },
                topperScore: topper.score,
                topperTimeTaken: topper.timeTaken,
                totalCandidates: totalCandidates
            }
            return res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

}