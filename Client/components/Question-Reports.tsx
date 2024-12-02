import styles from '../styles/dashboard.module.css';

interface HeaderOfAllTabs {
    title: string;
    totalCandidates: number;
    totalQuestions: number;
    maximumMarks: number;
    totalTime: number;
}

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
    answer: string;
}

interface QuestionReport {
    userMarkedAnswers: markedAnswer[];
    topperMarkedAnswers: markedAnswer[];
    noOfQuestions: number;
    questions: IQuestion[];
}

function getQuestionStatus(userAnswer: string, correctAnswer: string): string {
    if (userAnswer === correctAnswer) return  '✔️';
    if (userAnswer === '') return '➖';
    return '❌';
}

function mapOptionToLetter(option: string): string {
    switch (option) {
        case 'Op1':
            return 'A';
        case 'Op2':
            return 'B';
        case 'Op3':
            return 'C';
        case 'Op4':
            return 'D';
        default:
            return '';
    }
}

export default function QuestionReports({ questionReport, headerData }: { questionReport: QuestionReport; headerData: HeaderOfAllTabs }) {
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
            <table className={styles.ScoreCardTable}>
                <thead>
                    <tr>
                        <th>Question No</th>
                        <th>User's Status</th>
                        <th>User's Marks</th>
                        <th>User's Answer</th>
                        <th>Topper's Marks</th>
                        <th>Topper's Answer</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: questionReport.noOfQuestions }, (_, index) => {
                        const question = questionReport.questions[index];
                        const userAnswer = questionReport.userMarkedAnswers.find(answer => answer.question_no === question.s_no)?.answer || '';
                        const topperAnswer = questionReport.topperMarkedAnswers.find(answer => answer.question_no === question.s_no)?.answer || '';
                        const status = getQuestionStatus(userAnswer, question.ans);
                        const userMarks = status === 'Tick' ? 4 : status === 'Cross' ? -1 : 0; // 4 marks for correct, -1 for incorrect, 0 for skipped
                        const topperMarks = topperAnswer === question.ans ? 4 : topperAnswer === '' ? 0 : -1; // Verify topper's answer

                        return (
                            <tr key={index}>
                                <td>{question.s_no}</td>
                                <td>{status}</td>
                                <td>{userMarks}</td>
                                <td>{mapOptionToLetter(userAnswer)}</td>
                                <td>{topperMarks}</td>
                                <td>{mapOptionToLetter(topperAnswer)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}