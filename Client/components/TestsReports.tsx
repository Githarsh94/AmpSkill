'use client'
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/user';
import { fetchTestScoreCard } from '../Services/student';

import styles from '../styles/dashboard.module.css';
import ScoreCard from './ScoreCard';
import SolutionReports from './Solution-Reports';

interface ScoreCard{
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
interface CompleteScoreCard{
    scoreCard: ScoreCard,
    topperScore: number,
    topperTimeTaken: number,
    totalCandidates: number
}

interface HeaderOfAllTabs{
    title: string;
    totalCandidates: number;
    totalQuestions: number;
    maximumMarks: number;
    totalTime: number;
}
export default function TestsReports(testCode: any) {
    // console.log("testCode "+ testCode.testCode);
    const [activeTab, setActiveTab] = useState('Score Card'); // Default active tab
    const [reportData, setReportData] = useState<CompleteScoreCard | null>(null);
    const [headerData, setHeaderData] = useState<HeaderOfAllTabs | null>(null);
    const email = useUserStore((state) => state.profile.user.email);
    useEffect(() => {
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
                // console.log(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [reportData]);

    const navButtons = ['Score Card', 'Solution Report', 'Question Report', 'Compare Yourself'];
    return (
        <div className={styles.reportsContainer}>
            {/* Header Section */}
            <div className={styles.reportsHeader}>
                <h1 className="text-[30px] ">Reports</h1>
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
            <div className={styles.tabContent}>
                {activeTab === 'Score Card' && reportData && <div><ScoreCard reportData={reportData}/></div>}
                {activeTab === 'Solution Report' && headerData && <div><SolutionReports testCode={testCode.testCode} headerData ={headerData}/></div>}
                {activeTab === 'Question Report' && <div>Question Report Content</div>}
                {activeTab === 'Compare Yourself' && <div>Compare Yourself Content</div>}
            </div>

        </div>
    );
}
