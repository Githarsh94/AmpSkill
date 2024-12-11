'use client'
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/user';
import { fetchQuestionReport, fetchTestScoreCard, fetchSolutionReport, fetchTopperList } from '../Services/student';

import styles from '../styles/dashboard.module.css';
import ScoreCard from './ScoreCard';
import SolutionReports from './Solution-Reports';
import QuestionReports from './Question-Reports';
import CompareYourself from './Compare-Yourself';

//Score Card Interface
interface ScoreCard {
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
interface CompleteScoreCard {
    scoreCard: ScoreCard,
    topperScore: number,
    topperTimeTaken: number,
    totalCandidates: number
}

interface HeaderOfAllTabs {
    title: string;
    totalCandidates: number;
    totalQuestions: number;
    maximumMarks: number;
    totalTime: number;
}

//Interfacse for Solution Reports

interface IQuestion {
    s_no: number;
    question: string;
    op1: string;
    op2: string;
    op3: string;
    op4: string;
    ans: string; // Correct answer (e.g., 'Op1', 'Op2', 'Op3', 'Op4')
}

interface markedAnswer {
    question_no: number;
    answer: string; // User's selected option (e.g., 'Op1', 'Op2', 'Op3', 'Op4')
}

interface SolutionReport {
    questions: IQuestion[];
    userMarkedAnswers: markedAnswer[];
}
interface QuestionReport {
    userMarkedAnswers: markedAnswer[];
    topperMarkedAnswers: markedAnswer[];
    noOfQuestions: number;
    questions: IQuestion[];
}

const LoadingAnim = () => (
    <div className="flex justify-center items-center h-full">
        <div className='flex space-x-3 justify-center items-center dark:invert'>
            <span className='sr-only'>Loading...</span>
            <div className='h-8 w-8 bg-[#bd6ecd] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='h-8 w-8 bg-[#bd6ecd] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='h-8 w-8 bg-[#bd6ecd] rounded-full animate-bounce'></div>
        </div>
    </div>
);

export default function TestsReports(testCode: any) {
    const [activeTab, setActiveTab] = useState('Score Card'); // Default active tab
    const [reportData, setReportData] = useState<CompleteScoreCard | null>(null);
    const [headerData, setHeaderData] = useState<HeaderOfAllTabs | null>(null);
    const email = useUserStore((state) => state.profile.user.email);
    const [solutionReport, setSolutionReport] = useState<SolutionReport | null>(null);
    const [questionReport, setQuestionReport] = useState<QuestionReport | null>(null);
    const [topperList, setTopperList] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [testCodeNotFound, setTestCodeNotFound] = useState(false);

    useEffect(() => {
        if (!testCode.testCode) {
            setTestCodeNotFound(true);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const data = await fetchTestScoreCard(email, testCode.testCode);
                setReportData(data);
                setHeaderData({
                    title: data.scoreCard.title,
                    totalCandidates: data.totalCandidates,
                    totalQuestions: data.scoreCard.totalQuestions,
                    maximumMarks: data.scoreCard.maximumMarks,
                    totalTime: data.scoreCard.totalTime
                });
                const retrive_data = await fetchSolutionReport(email, testCode.testCode);
                if (retrive_data) {
                    setSolutionReport(retrive_data);
                }
                const get_data = await fetchQuestionReport(email, testCode.testCode);
                if (get_data) {
                    setQuestionReport(get_data);
                }
                const topper_data = await fetchTopperList(testCode.testCode);
                if (topper_data) {
                    setTopperList(topper_data);
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, [testCode.testCode]);

    const navButtons = ['Score Card', 'Solution Report', 'Question Report', 'Compare Yourself'];
    return (
        <div className={styles.reportsContainer}>
            {testCodeNotFound ? (
                <div className="flex justify-center items-center h-full">
                    <h1 className="text-[30px] text-center">Please access the reports through the completed tests tab</h1>
                </div>
            ) : (
                <>
                    {/* Header Section */}
                    <div className={styles.reportsHeader}>
                        <h1 className="text-[30px] text-center">Reports</h1>
                        <div className={styles.reportsNav}>
                            {navButtons.map((tab) => (
                                <div
                                    key={tab}
                                    className={`${styles.navButtonWrapper} ${activeTab === tab ? styles.activeNavButtonWrapper : ''
                                        }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    <button className={styles.navButton}>{tab}</button>
                                    {activeTab === tab && <div className={styles.activeUnderline}></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Conditional Content Based on Active Tab */}
                    <div className={loading ? "flex flex-col justify-center items-center h-[60vh]" : styles.tabContent}>
                        {loading ? (
                            <LoadingAnim />
                        ) : (
                            <>
                                {activeTab === 'Score Card' && reportData && <ScoreCard reportData={reportData} />}
                                {activeTab === 'Solution Report' && headerData && solutionReport && <SolutionReports solutionReport={solutionReport} headerData={headerData} />}
                                {activeTab === 'Question Report' && headerData && questionReport && <QuestionReports questionReport={questionReport} headerData={headerData} />}
                                {activeTab === 'Compare Yourself' && headerData && topperList && <CompareYourself topperList={topperList} headerData={headerData} />}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
