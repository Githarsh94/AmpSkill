'use client';
import styles from '../styles/dashboard.module.css';
import PieChart from '../components/PieChart';
import { ChartConfig } from './ui/chart';

export default function ScoreCard(){
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
        { type: "Correct", questions: 71, fill: "var(--color-Correct)" },
        { type: "Incorrect", questions: 6, fill: "var(--color-Incorrect)" },
        { type: "Skipped", questions: 2, fill: "var(--color-Skipped)" },
      ]
    return(
        <div className={styles.ScoreCardContainer}>
             {/* Test Info Section */}
             <div className={styles.ScoreCardTestCard}>
                <div>Test Title</div>
                <div className={styles.ScoreCardLine}></div>
                <div className={styles.ScoreCardTestSummary}>
                    <div className={styles.summaryItem}>Total Candidates: 120</div>
                    <div className={styles.summaryItem}>Total Questions: 75</div>
                    <div className={styles.summaryItem}>Maximum Marks: 300</div>
                    <div className={styles.summaryItem}>Total Time: 180</div>
                </div>
             </div>

            {/* Candidate Statistics */}
            <div className={styles.ScoreCardStatisticsSection}>
                {/* Left Panel */}
                <div className={styles.statisticsCard}>
                    <h2 className={`${styles.statisticsTitle} text-2xl`}>Candidate Statistics</h2>
                    <div className={styles.statisticsCardTop}>
                        <div className={styles.rankCard}>
                            <div className={styles.rankNumber}>6</div>
                            <div className={styles.rankLabel}>My Rank</div>
                        </div>
                        <div className={styles.rankCard}>
                            <div className={styles.rankNumber}>262</div>
                            <div className={styles.rankLabel}>My Marks</div>
                        </div>
                        <div className={styles.rankCard}>
                            <div className={styles.rankNumber}>96.12</div>
                            <div className={styles.rankLabel}>My Percentile</div>
                        </div>
                    </div>
                    <div className={styles.ScoreCardLine}></div>
                    <div className={styles.statisticsCardMarks}>
                        <p>Right Marks</p>
                        <p>268</p>
                    </div>
                    <div className={styles.ScoreCardLine}></div>
                    <div className={styles.statisticsCardMarks}>
                        <p>Wrong Marks</p>
                        <p>6</p>
                    </div>
                    <div className={styles.ScoreCardLine}></div>
                    <div className={styles.statisticsCardMarks}>
                        <p>Left Question Marks</p>
                        <p>0</p>
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
                            <td>73</td>
                            <td>2</td>
                            <td>82.00</td>
                            <td>262.00 / 00:06:53</td>
                            <td>300.00 / 00:56:55</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}