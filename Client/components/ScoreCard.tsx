import styles from '../styles/dashboard.module.css';
import PieChart from '../components/PieChart';
import { ChartConfig } from './ui/chart';

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
export default function ScoreCard({ reportData }: { reportData: CompleteScoreCard }) {
    // console.log("testCode " + testCode.testCode);
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
                <div className={`text-4xl`}>{reportData?.scoreCard.title}</div>
                <div className={styles.ScoreCardLine}></div>
                <div className={styles.ScoreCardTestSummary}>
                    <div className={styles.summaryItem}>Total Candidates: {reportData?.totalCandidates}</div>
                    <div className={styles.summaryItem}>Total Questions: {reportData?.scoreCard.totalQuestions}</div>
                    <div className={styles.summaryItem}>Maximum Marks: {reportData?.scoreCard.maximumMarks}</div>
                    <div className={styles.summaryItem}>Total Time: {reportData?.scoreCard.totalTime} (Mins)</div>
                </div>
            </div>

            {/* Candidate Statistics */}
            <div className={styles.ScoreCardStatisticsSection}>
                {/* Left Panel */}
                <div className={styles.statisticsCard}>
                    <h2 className={`${styles.statisticsTitle} text-2xl text-center`}>Candidate Statistics</h2>
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
                        <p>Correct Question Marks</p>
                        <p>{reportData?.scoreCard.correctAnswers ? reportData?.scoreCard.correctAnswers * 4 : 0}</p>
                    </div>
                    <div className={styles.ScoreCardLine}></div>
                    <div className={styles.statisticsCardMarks}>
                        <p>Incorrect Question Marks</p>
                        <p>{reportData?.scoreCard.incorrectAnswers ? reportData?.scoreCard.incorrectAnswers * -1 : 0}</p>
                    </div>
                    <div className={styles.ScoreCardLine}></div>
                    <div className={styles.statisticsCardMarks}>
                        <p>Skipped Question Marks</p>
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
                            <th>Subject</th>
                            <th>Attempted Ques.</th>
                            <th>Incorrect</th>
                            <th>Percentage</th>
                            <th>Score</th>
                            <th>Time</th>
                            <th>Topper's Score</th>
                            <th>Topper's Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{reportData?.scoreCard.subjectName}</td>
                            <td>{(reportData?.scoreCard.correctAnswers ?? 0) + (reportData?.scoreCard.incorrectAnswers ?? 0)}</td>
                            <td>{reportData?.scoreCard.incorrectAnswers}</td>
                            <td>{reportData?.scoreCard.percentage.toFixed(2)}%</td>
                            <td>{reportData?.scoreCard.score}</td>
                            <td> {Math.floor((reportData?.scoreCard.timeTaken ?? 0) / 60)}h:{Math.floor((reportData?.scoreCard.timeTaken ?? 0) % 60)}m:{Math.floor(((reportData?.scoreCard.timeTaken ?? 0) % 1) * 60)}s</td>
                            <td>{reportData?.topperScore} </td>
                            <td>{Math.floor((reportData?.topperTimeTaken ?? 0) / 60)}h:{Math.floor((reportData?.topperTimeTaken ?? 0) % 60)}m:{Math.floor(((reportData?.topperTimeTaken ?? 0) % 1) * 60)}s</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}