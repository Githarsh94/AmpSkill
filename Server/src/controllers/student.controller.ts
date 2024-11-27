// src/controllers/student.controller.ts
import { Request, Response } from 'express';
import { Test } from '../models/test.model';
import { User } from '../models/user.model';
import { Batch } from '../models/batch.model';
import { TestSession } from '../models/testSession.model';
import {ScoreCard} from '../models/ScoreCard.model';
// import { ScoreCard } from '../models/scoreCard.model';

export const StudentController = {
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
    availableTests: async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            // Step 1: Find the batch of the student
            const batch = await Batch.findOne({ students: email });

            if (!batch) {
                return res.status(404).json({ message: 'Batch not found for the given student email.' });
            }

            // Step 2: Retrieve tests for the batch
            const tests = await Test.find({
                'batches.batchName': batch.batchName,
                'batches.department': batch.department,
                'batches.branch': batch.branch,
                'batches.year': batch.year,
            });

            if (tests.length === 0) {
                return res.status(200).json({ message: 'No tests available for your batch at this time.', tests: [] });
            }

            // Step 3: Return available tests
            res.status(200).json({ message: 'Available tests retrieved successfully.', tests });
        } catch (error) {
            console.error('Error retrieving available tests:', error);
            res.status(500).json({ message: 'An error occurred while retrieving available tests.' });
        }
    },
    startTest: async (req: Request, res: Response) => {
        const { email, testCode } = req.body;
        try {
            // Fetch the test details from the database
            const test = await Test.findOne({ testCode });
            if (!test) {
                return res.status(404).json({ message: 'Test not found.' });
            }

            const testDuration = test.testDuration; // Test duration in minutes
            const startTimeofTest = test.startTime; // Scheduled start time of the test
            const loginWindow = test.loginWindow; // Login window duration in minutes

            const currentTime = new Date(); // Current time when the student requests to start the test

            // Debugging Logs
            // console.log(`Current Time: ${currentTime}`);
            // console.log(`Test Start Time: ${startTimeofTest}`);
            // console.log(`Login Window (minutes): ${loginWindow}`);

            // Calculate the end time of the login window
            const loginWindowEndTime = new Date(startTimeofTest.getTime() + loginWindow * 60000);
            // console.log(`Login Window End Time: ${loginWindowEndTime}`);

            // Validate that the current time falls within the login window
            if (currentTime < startTimeofTest || currentTime > loginWindowEndTime) {
                console.log('Validation failed: Current time is outside the login window.');
                return res.status(403).json({
                    message: 'Test is not available to start at this time. Please check the schedule and login window.',
                });
            }

            // Calculate the test end time based on the duration
            const endTime = new Date(currentTime.getTime() + testDuration * 60000);

            // Debugging Log for End Time
            // console.log(`Calculated Test End Time: ${endTime}`);
            const testSession = await TestSession.findOne({ studentEmail: email, testCode: testCode });
            if (!testSession) {
                // Create a new test session
                const newTestSession = new TestSession({
                    testCode: testCode,
                    studentEmail: email,
                    startTime: currentTime,
                    endTime: endTime,
                    totalQuestions: test.questions.length,
                });

                // Save the test session to the database
                await newTestSession.save();
                res.status(201).json({
                    message: 'Test session started successfully.',
                    test: {
                        title: test.title, questions: test.questions, testDuration: testDuration, isFullScreenEnforced: test.isFullScreenEnforced
                        , isTabSwitchPreventionEnabled: test.isTabSwitchPreventionEnabled,
                        isCameraAccessRequired: test.isCameraAccessRequired
                    }
                });
                return;
            }
            res.status(201).json({
                message: 'Test resumed successfully.',
                test: {
                    title: test.title, questions: test.questions, testDuration: testDuration, isFullScreenEnforced: test.isFullScreenEnforced
                    , isTabSwitchPreventionEnabled: test.isTabSwitchPreventionEnabled,
                    isCameraAccessRequired: test.isCameraAccessRequired
                }
            });

        } catch (error) {
            console.error('Error starting test:', error);
            res.status(500).json({ message: 'An error occurred while starting the test.' });
        }
    },
    submitTest: async (req: Request, res: Response) => {
        const { email, testCode } = req.body;
        try {
            //find the test session of the student
            const testSession = await TestSession.findOne({ studentEmail: email, testCode: testCode });
            if (!testSession) {
                return res.status(404).json({ message: 'Test session not found.' });
            }
            //check if the test session is already completed
            if (testSession.isCompleted) {
                return res.status(200).json({ message: 'Test session already completed.' });
            }
            //mark the test session as completed
            testSession.isCompleted = true;
            //update the marks
            testSession.score = testSession.correctAnswers * 4 - testSession.incorrectAnswers;

            // Create a test ScoreCard
            const incorrectAns = testSession.incorrectAnswers;
            const correctAns = testSession.correctAnswers;
            const totalQuestions = testSession.totalQuestions;
            const score = testSession.score;
            const skippedAns = totalQuestions - (correctAns + incorrectAns);
            const timeTaken = (testSession.endTime.getTime() - testSession.startTime.getTime()) / 60000;
            const timeTakenPerQue = timeTaken / totalQuestions;
            const maximumMarks = totalQuestions * 4;
            const percentage = (score / maximumMarks) * 100;
            const testSessions = await TestSession.find({ testCode }).sort({ score: -1 });
            const rank = testSessions.findIndex((session: any) => session.studentEmail === email) + 1;
            const test = await Test.findOne({testCode});
            const totalTime = test?.testDuration;
            // Create a new TestScoreCard document
            const newTestScoreCard = new ScoreCard({
                email: email,
                testCode: testCode,
                rank: rank,
                maximumMarks: maximumMarks,
                score: score,
                timeTaken: timeTaken,
                incorrectAnswers: incorrectAns,
                correctAnswers: correctAns,
                skippedAnswers: skippedAns,
                percentage: percentage,
                avgTimeTakenPerQue: timeTakenPerQue,
                totalTime: totalTime,
                totalQuestions: totalQuestions,
            });
            console.log(newTestScoreCard);
            // Save the new TestScoreCard to the database
            await newTestScoreCard.save();
            console.log("saved");
            // Update ranks of all TestScoreCards for the test
            const testScoreCards = await ScoreCard.find({ testCode }).sort({ score: -1 });
            for (let i = 0; i < testScoreCards.length; i++) {
                console.log("ranked");
                testScoreCards[i].rank = i + 1;
                await testScoreCards[i].save();
            }
            
            //save this test session to db
            await testSession.save();
            res.status(200).json({ message: 'Test submitted successfully.', testSession });
        }
        catch (error) {
            console.error('Error submitting test:', error);
            res.status(500).json({ message: 'An error occurred while submitting the test.' });
        }
    },
    getTestDuration: async (req: Request, res: Response) => {
        const { email, testCode } = req.body;
        try {
            //find the test session of the student
            const testSession = await TestSession.findOne({ studentEmail: email, testCode: testCode });
            if (!testSession) {
                return res.status(404).json({ message: 'Test session not found.' });
            }
            const endTime = testSession.endTime;
            const currentTime = new Date();
            // Calculate the remaining duration in milliseconds
            const durationInMs = endTime.getTime() - currentTime.getTime();
            if (durationInMs <= 0) {
                return res.status(200).json({ message: 'Test has already ended.', duration: 0 });
            }
            // Convert milliseconds to minutes
            const durationInMinutes = Math.ceil(durationInMs / (1000 * 60));

            res.status(200).json({ message: 'Test duration retrieved successfully.', duration: durationInMinutes });
        }
        catch (error) {
            console.error('Error getting test duration:', error);
            res.status(500).json({ message: 'An error occurred  while getting the test duration.' });
        }
    },
    markTheAnswer: async (req: Request, res: Response) => {
        const { email, testCode, question_no, answer } = req.body;
        try {
            // Find the test session of the student
            const testSession = await TestSession.findOne({ studentEmail: email, testCode: testCode });
            if (!testSession) {
                return res.status(404).json({ message: 'Test session not found.' });
            }

            // Check if the test session is already completed
            if (testSession.isCompleted) {
                return res.status(400).json({ message: 'Test session is already completed.' });
            }

            // Find the question in the test
            const test = await Test.findOne({ testCode });
            if (!test) {
                return res.status(404).json({ message: 'Test not found.' });
            }

            const question = test.questions.find(q => q.s_no === question_no);
            if (!question) {
                return res.status(404).json({ message: 'Question not found.' });
            }

            const correctAnswer = question.ans;

            // Check if the question has already been answered
            const existingAnswerIndex = testSession.answers.findIndex(
                a => a.question_no === question_no
            );

            if (existingAnswerIndex !== -1) {
                // Question already answered, adjust the counts
                const previousAnswer = testSession.answers[existingAnswerIndex].answer;

                if (previousAnswer === correctAnswer) {
                    // Previous answer was correct, decrease correctAnswers
                    testSession.correctAnswers--;
                } else {
                    // Previous answer was incorrect, decrease incorrectAnswers
                    testSession.incorrectAnswers--;
                }

                // Replace the existing answer with the new one
                testSession.answers[existingAnswerIndex].answer = answer;
            } else {
                // New answer, add it to the answers array
                testSession.answers.push({ question_no, answer });
            }

            // Update the counts based on the new answer
            if (answer === correctAnswer) {
                testSession.correctAnswers++;
            } else {
                testSession.incorrectAnswers++;
            }

            // Save the updated test session to the database
            await testSession.save();

            res.status(200).json({ message: 'Answer marked successfully.', testSession });
        } catch (error) {
            console.error('Error marking the answer:', error);
            res.status(500).json({ message: 'An error occurred while marking the answer.' });
        }
    },
    getAllTests: async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            // Step 1: Find the batch of the student
            const batch = await Batch.findOne({ students: email });

            if (!batch) {
                return res.status(404).json({ message: 'Batch not found for the given student email.' });
            }
            // Step 2: Retrieve all tests for the batch
            const tests = await Test.find({
                'batches.batchName': batch.batchName,
                'batches.department': batch.department,
                'batches.branch': batch.branch,
                'batches.year': batch.year,
            });
            const currentTime = new Date();

            const activeTests = [];
            const upcomingTests = [];
            const completedTests = [];
            const missedTests = [];

            for (const test of tests) {
                const testSession = await TestSession.findOne({ studentEmail: email, testCode: test.testCode });

                if (testSession) {
                    if (testSession.isCompleted) {
                        completedTests.push({
                            ...test.toObject(),
                            score: testSession.score,
                            correctAnswers: testSession.correctAnswers,
                            incorrectAnswers: testSession.incorrectAnswers,
                            totalQuestions: testSession.totalQuestions
                        });
                    } else if (currentTime >= testSession.startTime && currentTime <= testSession.endTime) {
                        activeTests.push(test);
                    } else if (currentTime > testSession.endTime) {
                        missedTests.push(test);
                    }
                } else {
                    if (currentTime < test.startTime) {
                        upcomingTests.push(test);
                    } else if (currentTime > test.startTime && currentTime < new Date(test.startTime.getTime() + test.loginWindow * 60000)) {
                        activeTests.push(test);
                    } else {
                        missedTests.push(test);
                    }
                }
            }

            res.status(200).json({
                message: 'Tests retrieved successfully.',
                activeTests,
                upcomingTests,
                completedTests,
                missedTests,
            });
        } catch (error) {
            console.error('Error retrieving tests:', error);
            res.status(500).json({ message: 'An error occurred while retrieving tests.' });
        }
    }
};
