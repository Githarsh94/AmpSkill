'use client';
import { useState, useEffect } from "react";
import { fetchTest,submitTest,markTheAnswer, getTestDuration } from "../../Services/student";
import toast from 'react-hot-toast';

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
const testPage = (testCode: string,email: string) => {
    const [testFlag, setTestFlag] = useState<ITest | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    if (email !== "") {
        return (
            <div>
                Forbidden page
            </div>
        )
    }
    //write the logic to start the Test and setting up the test data into the state
    const startTest = async ()=>{
        try{
            const fetchedTest= await fetchTest(email,testCode);
            setTestFlag(fetchedTest);
            setCurrentQuestionIndex(fetchedTest.questions[0].s_no);
            fetchTimeLeft();
            await document.documentElement.requestFullscreen();
        }
        catch(err){
            console.log(err);
            throw new Error('Failed to start test');
        }
    }
    //logic to submit the test
    const endTest = async ()=>{
        try{
            const response = await submitTest(email,testCode);
            toast.success(response.message);
            setTestFlag(null);
            document.exitFullscreen();
        }
        catch(err){
            console.log(err);
            throw new Error('Failed to submit test');
        }
    }
    //mark the answer
    const enterTheAnswer = async (s_no: number,answer: string)=>{
        try{
            const response = await markTheAnswer(email,testCode,s_no,answer);
            toast.success(response.message);
        }
        catch(err){
            console.log(err);
            throw new Error('Failed to mark the answer');
        }
    }
    //fetch the time left
    const fetchTimeLeft = async ()=>{
        try{
            const response = await getTestDuration(email,testCode);
            setTimeLeft(response.duration);
            if (response.duration === 0) {
                endTest();
              } else {
                setTimeLeft(response.duration * 60);
              }
        }
        catch(err){
            console.log(err);
            throw new Error('Failed to fetch time left');
        }
    }
    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
            toast.error("You exited fullscreen. Test will be ended.");
            setTimeout(()=>endTest(), 5000);
        }
    };
    
    const handleVisibilityChange = () => {
        if (document.hidden) {
            toast.error("You switched tabs. Test will be ended.");
            setTimeout(()=>endTest(), 5000);
        }
    };
    //for timer logic to run
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

    if (!testFlag) {
        return (
            <div>
              <h1></h1>
              <div className="instructionsMain">
                <h1></h1>
                <div className="instructions">

                </div>
              </div>
                <div className="instructionBottom">
                    <button onClick={startTest}>Start Test</button>
                </div>
            </div>
        );
    }
    return (
        <div>
            <div className="quizPageTop">
                <h1>{testFlag.title}</h1>
                <div className="timer">
                    <h2>Time Left: {timeLeft}</h2>
                </div>
            </div>
            <div className="quizPageMain">
                <h1>Question {currentQuestionIndex + 1}</h1>
                <h2>{testFlag.questions[currentQuestionIndex].question}</h2>
                <div className="options">
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
            <div className="quizPageBottom">
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
