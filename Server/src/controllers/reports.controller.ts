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

            res.status(200).json(scoreCard);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

}