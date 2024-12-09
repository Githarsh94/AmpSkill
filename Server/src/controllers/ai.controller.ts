import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);


async function run(prompt : string) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
}

export const aiController= {
    generateQuestion: async (req : Request, res: Response) => {
        console.log(`Request received from: ${req.ip}, Request type: ${req.method}, prompt= ${req.query.prompt}`);
        const prompt = req.query.prompt as string;
        const difficulty = req.query.difficulty as string;
        const Questions = req.query.Questions as string;
        if (!prompt) {
            return res.status(400).send({ error: 'No prompt provided' });
        }
        
        try {
            const geminiResponse = await run(prompt + ` return ${Questions} ${difficulty} level questions in the format of objects in Array and the answers of all questions shouldnt be the same option. The format should be like:
                {
                    "s_no": 1,
                    "question": "......",
                    "Op1": "first option",
                    "Op2": "second option",
                    "Op3": "third option",
                    "Op4": "fourth option",
                    "ans": "correct option in the form of Op1 or Op2 or Op3 or Op4"
                }  give me the array of objects only and nothing else.`);
            // res.send(geminiResponse);
        const formattedResponse = geminiResponse.replace(/```json|```/g, '');
        res.send(JSON.parse(formattedResponse));
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'An error occurred while processing your request' });
        }
    }
}