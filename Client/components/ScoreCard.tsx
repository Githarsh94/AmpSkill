'use client';
import { useEffect, useState } from 'react';
import styles from '../styles/dashboard.module.css';
import PieChart from '../components/PieChart';
import { ChartConfig } from './ui/chart';
import { useUserStore } from '@/store/user';
import { fetchTestScoreCard } from '../Services/student';

interface ScoreCard{
    email: string;
    testCode: string;
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
export default function ScoreCard({ testCode }: { testCode: string }) {
    // console.log("testCode " + testCode.testCode);
    const [reportData, setReportData] = useState<CompleteScoreCard | null>(null);
    const email = useUserStore((state) => state.profile.user.email);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTestScoreCard(email, testCode);
                setReportData(data);
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [testCode]);
    const chartConfig = {
        Analysis: {
            label: "Analysis",
        },
        Correct: {
            label: "Correct",
            color: "#28A745",
        },
        Incorrect: {
            label: "Incorrect",
            color: "#F44336",
        },
        Skipped: {
            label: "Skipped",
            color: "#1A73CC",
        },
    } satisfies ChartConfig
    const chartData = [
        { type: "Correct", questions: reportData?.scoreCard.correctAnswers, fill: "var(--color-Correct)" },
        { type: "Incorrect", questions: reportData?.scoreCard.incorrectAnswers, fill: "var(--color-Incorrect)" },
        { type: "Skipped", questions: reportData?.scoreCard.skippedAnswers, fill: "var(--color-Skipped)" },
    ]
    return (
        <div className={styles.ScoreCardContainer}>
            {/* Test Info Section */}
            <div className={styles.ScoreCardTestCard}>
                <div>Test Title</div>
                <div className={styles.ScoreCardLine}></div>
                <div className={styles.ScoreCardTestSummary}>
                    <div className={styles.summaryItem}>Total Candidates: {reportData?.totalCandidates}</div>
                    <div className={styles.summaryItem}>Total Questions: {reportData?.scoreCard.totalQuestions}</div>
                    <div className={styles.summaryItem}>Maximum Marks: {reportData?.scoreCard.maximumMarks}</div>
                    <div className={styles.summaryItem}>Total Time: {reportData?.scoreCard.totalTime}</div>
                </div>
            </div>

            {/* Candidate Statistics */}
            <div className={styles.ScoreCardStatisticsSection}>
                {/* Left Panel */}
                <div className={styles.statisticsCard}>
                    <h2 className={`${styles.statisticsTitle} text-2xl`}>Candidate Statistics</h2>
                    <div className={styles.statisticsCardTop}>
                        <div className={styles.rankCard}>
                            <div className={styles.rankNumber}>{reportData?.scoreCard.rank}</div>
                            <div className={styles.rankLabel}>My Rank</div>
                        </div>
                        <div className={styles.rankCard}>
                            <div className={styles.rankNumber}>{reportData?.scoreCard.score}</div>
                            <div className={styles.rankLabel}>My Marks</div>
                        </div>
                        <div className={styles.rankCard}>
                            <div className={styles.rankNumber}>{reportData?.scoreCard.percentage.toFixed(2)}</div>
                            <div className={styles.rankLabel}>My Percentage</div>
                        </div>
                    </div>
                    <div className={styles.ScoreCardLine}></div>
                    <div className={styles.statisticsCardMarks}>
                        <p>Right Marks</p>
                        <p>{reportData?.scoreCard.correctAnswers ? reportData?.scoreCard.correctAnswers * 4 : 0}</p>
                    </div>
                    <div className={styles.ScoreCardLine}></div>
                    <div className={styles.statisticsCardMarks}>
                        <p>Wrong Marks</p>
                        <p>{reportData?.scoreCard.incorrectAnswers ? reportData?.scoreCard.incorrectAnswers * -1: 0}</p>
                    </div>
                    <div className={styles.ScoreCardLine}></div>
                    <div className={styles.statisticsCardMarks}>
                        <p>Left Question Marks</p>
                        <p>{reportData?.scoreCard.skippedAnswers ? reportData?.scoreCard.skippedAnswers * 4 : 0}</p>
                    </div>
                </div>

                {/* Right Panel */}
                <div className={styles.statisticsCard}>
                    <PieChart chartConfig={chartConfig} chartData={chartData} year={2022} />
                </div>
            </div>

            {/* Overview Section */}
            <div className={styles.overviewSection}>
                <h2 className={`styles.overviewTitle text-2xl`}>Overview</h2>
                <table className={styles.overviewTable}>
                    <thead>
                        <tr>
                            <th>Subject Name</th>
                            <th>Attempts</th>
                            <th>Incorrect</th>
                            <th>Percentage</th>
                            <th>Score/Time</th>
                            <th>How Did Topper Do?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Physics</td>
                            <td>{(reportData?.scoreCard.correctAnswers ?? 0) + (reportData?.scoreCard.incorrectAnswers ?? 0)}</td>
                            <td>{reportData?.scoreCard.incorrectAnswers}</td>
                            <td>{reportData?.scoreCard.percentage.toFixed(2)}</td>
                            <td>{reportData?.scoreCard.score} / {reportData?.scoreCard.timeTaken}</td>
                            <td>{reportData?.topperScore} / {reportData?.topperTimeTaken}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}