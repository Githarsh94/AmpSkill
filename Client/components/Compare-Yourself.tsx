import styles from '../styles/dashboard.module.css';

interface HeaderOfAllTabs {
    title: string;
    totalCandidates: number;
    totalQuestions: number;
    maximumMarks: number;
    totalTime: number;
}

interface CompareYourselfProps {
    topperList: any[];
    headerData: HeaderOfAllTabs;
}

export default function CompareYourself({ topperList, headerData }: CompareYourselfProps) {
    return (
        <div className={styles.ScoreCardContainer}>
            <div className={styles.ScoreCardTestCard}>
                <div>{headerData?.title}</div>
                <div className={styles.ScoreCardLine}></div>
                <div className={styles.ScoreCardTestSummary}>
                    <div className={styles.summaryItem}>Total Candidates: {headerData?.totalCandidates}</div>
                    <div className={styles.summaryItem}>Total Questions: {headerData?.totalQuestions}</div>
                    <div className={styles.summaryItem}>Maximum Marks: {headerData?.maximumMarks}</div>
                    <div className={styles.summaryItem}>Total Time: {headerData?.totalTime} (Mins)</div>
                </div>
            </div>
            
            <div className={styles.ScoreCardTopperList}>
                <table className={styles.topperTable}>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Score</th>
                            <th>Time Taken</th>
                            <th>Rank</th>
                            <th>Avg Speed Per Question</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topperList.map((topper: any, index: number) => (
                            <tr key={index}>
                                <td>{topper.email}</td>
                                <td>{topper.score.toFixed(3)}</td>
                                <td>{topper.timeTaken.toFixed(3)}</td>
                                <td>{topper.rank}</td>
                                <td>{topper.avgSpeedPerQue.toFixed(3)}</td>
                                <td>{topper.percentage.toFixed(3)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}