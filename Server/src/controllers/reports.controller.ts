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
                    subjectName: scoreCard?.subjectName,
                    title: scoreCard?.title,
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
    },
    fetchSolutionReportOfTest: async (req: Request, res: Response) => {
        const {email,testCode} = req.body;
        try{
            const test = await Test.findOne({ testCode });
            if (!test) {
                return res.status(404).json({ message: 'Test not found' });
            }

            const batch = await Batch.findOne({ students: [email] });
            if (!batch) {
                return res.status(404).json({ message: 'You have not been assigned to any batch yet.' });
            }

            const assignedTest = test.batches.some(batchItem => batchItem.batchName === batch.batchName);
            if (!assignedTest) {
                return res.status(404).json({ message: 'This test has not been assigned to your batch.' });
            }

            const testSession = await TestSession.findOne({ studentEmail: email, testCode });
            if (!testSession) {
                return res.status(404).json({ message: 'You have not attempted this test.' });
            }

            const questions= test.questions;
            const userMarkedAnswers = testSession.answers;
            const data={
                questions,
                userMarkedAnswers
            }
            return res.status(200).json(data);
        }
        catch(error){
            res.status(500).json({ message: 'Internal Server error', error });
        }
    },
    fetchQuestionReportOfTest: async(req: Request, res: Response)=>{
        const {email,testCode} = req.body;
        try{
            const test = await Test.findOne({ testCode });
            if (!test) {
                return res.status(404).json({ message: 'Test not found' });
            }
            const noOfQuestions = test.questions.length;
            const questions = test.questions;
            const batch = await Batch.findOne({ students: [email] });
            if (!batch) {
                return res.status(404).json({ message: 'You have not been assigned to any batch yet.' });
            }

            const assignedTest = test.batches.some(batchItem => batchItem.batchName === batch.batchName);
            if (!assignedTest) {
                return res.status(404).json({ message: 'This test has not been assigned to your batch.' });
            }

            const testSession = await TestSession.findOne({ studentEmail: email, testCode });
            if (!testSession) {
                return res.status(404).json({ message: 'You have not attempted this test.' });
            }

            const userMarkedAnswers = testSession.answers;
            const topper = await ScoreCard.findOne({ testCode ,rank: 1 });
            if(!topper){
                return res.status(404).json({ message: 'Topper not found' });
            }
            const topperEmail = topper.email;
            const topperSession = await TestSession.findOne({ studentEmail: topperEmail, testCode });
            if (!topperSession) {
                return res.status(404).json({ message: 'Topper has not attempted this test.' });
            }
            const topperMarkedAnswers = topperSession.answers;
            const data ={
                userMarkedAnswers,
                topperMarkedAnswers,
                questions,
                noOfQuestions
            }
            return res.status(200).json(data);
        }
        catch(error){
            res.status(500).json({ message: 'Internal Server error', error });
        }
    },
    fetchTopperList: async(req: Request, res: Response)=>{
        const {testCode} = req.body;
        try{
            const top10Toppers = await ScoreCard.find({ testCode }).sort({ rank: 1 }).limit(10);
            const data = top10Toppers.map(topper => ({
                email: topper.email,
                score: topper.score,
                timeTaken: topper.timeTaken,
                rank: topper.rank,
                avgSpeedPerQue: topper.avgTimeTakenPerQue,
                percentage: topper.percentage
            }));
            return res.status(200).json(data);
        }
        catch(error){
            res.status(500).json({ message: 'Internal Server error', error });
        }
    }
}