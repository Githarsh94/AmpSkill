'use client';

import { useState, useEffect, useRef } from "react";
import { fetchTest, submitTest, markTheAnswer, getTestDuration } from "../../Services/student";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../styles/quiz.module.css';

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

export default function TestPage() {
    const [testFlag, setTestFlag] = useState<ITest | null>(null);
    const [timeLeft, setTimeLeft] = useState(Number.MAX_VALUE);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [testCode, setTestCode] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [warningCount, setWarningCount] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    const warningCountRef = useRef(warningCount);

    //fetching the test code and email from the query params
    useEffect(() => {
        const queryParams = window.location.search;
        setTestCode(new URLSearchParams(queryParams).get('testCode'));
        setEmail(new URLSearchParams(queryParams).get('email'));
    }, []);

    //keep checking for warnings
    useEffect(() => {
        if (warningCount >= 5) {
            toast.error("You have reached the maximum number of warnings. Test will be ended.");
            setTimeout(() => endTest(), 5000);
        }
    }, [warningCount]);

    //logic for timer
    useEffect(() => {
        if (testFlag && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (testFlag && timeLeft === 0) {
            endTest();
        }
    }, [timeLeft, testFlag]);

    // logic to keep on checking for fullscreen and tab switch
    useEffect(() => {
        if (testFlag) {
            document.addEventListener("fullscreenchange", handleFullscreenChange);
            document.addEventListener("visibilitychange", handleVisibilityChange);
            return () => {
                document.removeEventListener("fullscreenchange", handleFullscreenChange);
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            };
        }
    }, [testFlag]);


    if (!email) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">403 Forbidden</h1>
                    <p className="text-lg text-gray-700 mb-6">You do not have permission to access this page.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }
    //write the logic to start the Test and setting up the test data into the state
    const startTest = async () => {
        try {
            console.log(email, testCode);
            const fetchedTest = await fetchTest(email as string, testCode as string);
            setTestFlag(fetchedTest);
            setCurrentQuestionIndex(fetchedTest.questions[0].s_no - 1);
            fetchTimeLeft();
            await document.documentElement.requestFullscreen();
        }
        catch (err) {
            console.log(err);
            throw new Error('Failed to start test');
        }
    }

    const endTest = async () => {
        try {
            const response = await submitTest(email as string, testCode as string);
            toast.success(response.message);
            setTestFlag(null);
            document.exitFullscreen();
            setTimeout(() => window.location.href = '/dashboard/student', 3000);
        }
        catch (err) {
            console.log(err);
            throw new Error('Failed to submit test');
        }
    }

    const enterTheAnswer = async (s_no: number, answer: string) => {
        try {
            setSelectedAnswers((prev) => ({ ...prev, [s_no]: answer }));
            const response = await markTheAnswer(email as string, testCode as string, s_no, answer);
            toast.success(response.message);
        }
        catch (err) {
            console.log(err);
            throw new Error('Failed to mark the answer');
        }
    }

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

    const handleFullscreenChange = async () => {
        if (!document.fullscreenElement) {
            warningCountRef.current += 1;
            toast.error("You exited fullscreen. This is warning " + warningCountRef.current);
            setWarningCount(warningCountRef.current);

            const fullscreenButton = document.createElement("button");
            fullscreenButton.innerText = "You have exited full screen. Please go back to full screen to continue.";
            fullscreenButton.style.position = "fixed";
            fullscreenButton.style.top = "50%";
            fullscreenButton.style.left = "50%";
            fullscreenButton.style.transform = "translate(-50%, -50%)";
            fullscreenButton.style.padding = "10px 20px";
            fullscreenButton.style.backgroundColor = "#007bff";
            fullscreenButton.style.color = "#fff";
            fullscreenButton.style.border = "none";
            fullscreenButton.style.borderRadius = "5px";
            fullscreenButton.style.zIndex = "1000";

            const overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            overlay.style.zIndex = "999";
            overlay.style.backdropFilter = "blur(5px)";
            overlay.appendChild(fullscreenButton);

            fullscreenButton.onclick = async () => {
                document.body.removeChild(overlay);
                await document.documentElement.requestFullscreen();
            };

            document.body.appendChild(overlay);
        }
    };

    const handleVisibilityChange = () => {
        if (document.hidden) {
            warningCountRef.current += 1;
            toast.error("You switched tabs. This is warning " + warningCountRef.current);
            setWarningCount(warningCountRef.current);
        }
    };

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
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </div>
        );
    }
    return (
        <div className={styles.quizPage}>
            <div className={styles.quizPageTop}>
                <h1>{testFlag.title}</h1>
                <div className={styles.warningCounter}>
                    <h2>Warning Count: {warningCount}</h2>
                </div>
                <div className={styles.timer}>
                    <h2>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</h2>
                </div>
            </div>
            <div className={styles.quizPageMain}>
                <h1>Question {currentQuestionIndex + 1}
                    <br />
                    <span>{testFlag.questions[currentQuestionIndex].question}</span>
                </h1>
                <div className={styles.options}>
                    <label>
                        <input
                            type="radio"
                            name="option"
                            value="Op1"
                            checked={selectedAnswers[currentQuestionIndex] === 'Op1'}
                            onChange={() => enterTheAnswer(currentQuestionIndex, 'Op1')}
                        />
                        {testFlag.questions[currentQuestionIndex].op1}
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="option"
                            value="Op2"
                            checked={selectedAnswers[currentQuestionIndex] === 'Op2'}
                            onChange={() => enterTheAnswer(currentQuestionIndex, 'Op2')}
                        />
                        {testFlag.questions[currentQuestionIndex].op2}
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="option"
                            value="Op3"
                            checked={selectedAnswers[currentQuestionIndex] === 'Op3'}
                            onChange={() => enterTheAnswer(currentQuestionIndex, 'Op3')}
                        />
                        {testFlag.questions[currentQuestionIndex].op3}
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="option"
                            value="Op4"
                            checked={selectedAnswers[currentQuestionIndex] === 'Op4'}
                            onChange={() => enterTheAnswer(currentQuestionIndex, 'Op4')}
                        />
                        {testFlag.questions[currentQuestionIndex].op4}
                    </label>
                </div>
            </div>
            <div className={styles.quizPageBottom}>
                <button
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                    disabled={testFlag && currentQuestionIndex <= 0}
                >
                    Back
                </button>
                <button onClick={endTest}>Submit</button>
                <button
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    disabled={testFlag && currentQuestionIndex >= testFlag.questions.length - 1}
                >
                    Next
                </button>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    )
}
