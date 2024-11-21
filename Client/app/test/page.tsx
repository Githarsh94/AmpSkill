'use client';
import { useState, useEffect } from "react";
import { fetchTest, submitTest, markTheAnswer, getTestDuration } from "../../Services/student";
import toast from 'react-hot-toast';
import { useSearchParams } from "next/navigation";
import styles from '../../styles/quiz.module.css';

interface Question {
    s_no: number;
    answer: string;
}

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

interface ITest {
    title: string;
    questions: IQuestion[];
    testDuration: number;
    isFullScreenEnforced: boolean;
    isTabSwitchPreventionEnabled: boolean;
    isCameraAccessRequired: boolean;
}
const testPage = () => {
    const searchParams = useSearchParams();
    const [testFlag, setTestFlag] = useState<ITest | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const testCode = searchParams.get('testCode');
    const email = searchParams.get('email');

    if (email === "") {
        return (
            <div>
                Forbidden page
            </div>
        )
    }
    //write the logic to start the Test and setting up the test data into the state
    const startTest = async () => {
        try {
            const fetchedTest = await fetchTest(email as string, testCode as string);
            setTestFlag(fetchedTest);
            setCurrentQuestionIndex(fetchedTest.questions[0].s_no);
            fetchTimeLeft();
            await document.documentElement.requestFullscreen();
        }
        catch (err) {
            console.log(err);
            throw new Error('Failed to start test');
        }
    }
    //logic to submit the test
    const endTest = async () => {
        try {
            const response = await submitTest(email as string, testCode as string);
            toast.success(response.message);
            setTestFlag(null);
            document.exitFullscreen();
        }
        catch (err) {
            console.log(err);
            throw new Error('Failed to submit test');
        }
    }
    //mark the answer
    const enterTheAnswer = async (s_no: number, answer: string) => {
        try {
            const response = await markTheAnswer(email as string, testCode as string, s_no, answer);
            toast.success(response.message);
        }
        catch (err) {
            console.log(err);
            throw new Error('Failed to mark the answer');
        }
    }
    //fetch the time left
    const fetchTimeLeft = async () => {
        try {
            const response = await getTestDuration(email as string, testCode as string);
            setTimeLeft(response.duration);
            if (response.duration === 0) {
                endTest();
            } else {
                setTimeLeft(response.duration * 60);
            }
        }
        catch (err) {
            console.log(err);
            throw new Error('Failed to fetch time left');
        }
    }
    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
            toast.error("You exited fullscreen. Test will be ended.");
            setTimeout(() => endTest(), 5000);
        }
    };

    const handleVisibilityChange = () => {
        if (document.hidden) {
            toast.error("You switched tabs. Test will be ended.");
            setTimeout(() => endTest(), 5000);
        }
    };
    if (testFlag) {
        useEffect(() => {
            if (timeLeft > 0) {
                const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
                return () => clearInterval(timer);
            } else if (timeLeft === 0) {
                endTest();
            }
        }, [timeLeft]);

        //logic to keep on checking for fullscreen and tab switch
        useEffect(() => {
            document.addEventListener("fullscreenchange", handleFullscreenChange);
            document.addEventListener("visibilitychange", handleVisibilityChange);
            return () => {
                document.removeEventListener("fullscreenchange", handleFullscreenChange);
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            };
        }, []);
    }
    if (!testFlag) {
        return (
            <div className={styles.instructionsPage}>
                <h1>Instruction Page</h1>
                <div className={styles.instructionsMain}>
                    <h1></h1>
                    <div className={styles.instructions}>
                        <div>
                            <b>General Guidelines <br /></b>
                            The test will start at [start time] and is available for a login window of [login window duration] minutes.<br />
                            You cannot log in after the login window closes.<br />
                            The test duration is [test duration] minutes, and the timer starts once you begin.<br />
                        </div>
                        <div>
                            <b>Test Rules<br /></b>
                            Do not exit fullscreen or switch tabs during the test if they are enabled.<br />
                            Violations may result in automatic submission of your test.<br />
                            You can answer questions in any order.<br />
                            Answers can be modified until the test is submitted.<br />
                            Click the "Submit Test" button when finished or if you wish to end early.<br />
                            The test will automatically be submitted when the timer reaches zero.<br />
                        </div>
                        <div>
                            <b>Scoring Details<br /></b>
                            Each correct answer awards [4 marks] but [1 mark] is deducted for each incorrect answer, No marks are awarded or deducted for unanswered questions.<br />
                        </div>
                        <div>
                            <b>Technical Instructions<br /></b>
                            A stable internet connection is required to save answers and monitor your session.<br />
                            Avoid refreshing the page unnecessarily.<br />
                        </div>
                        <div>
                            <b>Code of Conduct<br /></b>
                            Any attempt to tamper with the platform may result in disqualification.
                        </div>
                        <div>
                            <b>Acknowledgment<br /></b>
                            By clicking "Start Test," you confirm that you have read and understood the instructions and agree to abide by the rules.
                        </div>
                    </div>
                </div>
                <div className={styles.instructionsBottom}>
                    <button onClick={startTest}>Start Test</button>
                </div>
            </div>
        );
    }
    return (
        <div>
            <div className={styles.quizPageTop}>
                <h1>{testFlag.title}</h1>
                <div className={styles.timer}>
                    <h2>Time Left: {timeLeft}</h2>
                </div>
            </div>
            <div className={styles.quizPageMain}>
                <h1>Question {currentQuestionIndex + 1}</h1>
                <h2>{testFlag.questions[currentQuestionIndex].question}</h2>
                <div className={styles.options}>
                    <label>
                        <input type="radio" name="option" value="op1" onChange={() => enterTheAnswer(currentQuestionIndex, 'op1')} />
                        {testFlag.questions[currentQuestionIndex].op1}
                    </label>
                    <label>
                        <input type="radio" name="option" value="op2" onChange={() => enterTheAnswer(currentQuestionIndex, 'op2')} />
                        {testFlag.questions[currentQuestionIndex].op2}
                    </label>
                    <label>
                        <input type="radio" name="option" value="op3" onChange={() => enterTheAnswer(currentQuestionIndex, 'op3')} />
                        {testFlag.questions[currentQuestionIndex].op3}
                    </label>
                    <label>
                        <input type="radio" name="option" value="op4" onChange={() => enterTheAnswer(currentQuestionIndex, 'op4')} />
                        {testFlag.questions[currentQuestionIndex].op4}
                    </label>
                </div>
            </div>
            <div className={styles.quizPageBottom}>
                <button
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    disabled={testFlag && currentQuestionIndex <= 0}
                >
                    Back
                </button>
                <button
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    disabled={testFlag && currentQuestionIndex >= testFlag.questions.length - 1}
                >
                    Next
                </button>
                <button onClick={endTest}>Submit</button>
            </div>
        </div>
    )
}

export default testPage;
