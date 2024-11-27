import { Request, Response } from 'express';
import { TestSession } from './../models/testSession.model';

export const ReportsController =  {
    fetchTestScoreCard: async(req: Request, res: Response) => {
        const {email,testCode} = req.body;
        // const testSession = await TestSession.findOne({email,testCode});
        // if(!testSession){
        //     return res.status(404).json({message:'Test not found'});
        // }
    }
    
}