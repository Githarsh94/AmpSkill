'use client';
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
interface MarkedAnswer {
    question_no: number;
    answer: string; // User's selected option (e.g., 'Op1', 'Op2', 'Op3', 'Op4')
}

interface SolutionReport {
    questions: IQuestion[];
    userMarkedAnswers: MarkedAnswer[];
}
export default function SolutionReports({ solutionReport, headerData }: { solutionReport: SolutionReport; headerData: HeaderOfAllTabs }) {

    const getOptionStyle = (
        optionKey: string,
        question: IQuestion,
        userAnswer: string | null
    ) => {
        if (`Op${optionKey.slice(-1)}` === question.ans) {
            return { color: 'green', fontWeight: 'bold', symbol: '✔️' }; // Correct answer
        } else if (`Op${optionKey.slice(-1)}` === userAnswer) {
            return { color: 'red', fontWeight: 'bold', symbol: '❌' }; // Incorrect user answer
        }
        return { color: 'black', symbol: '' }; // Neutral
    };

    return (
        <div className={styles.ScoreCardContainer}>
            <div className={styles.ScoreCardTestCard}>
                <div className={`text-4xl`}>{headerData?.title}</div>
                <div className={styles.ScoreCardLine}></div>
                <div className={styles.ScoreCardTestSummary}>
                    <div className={styles.summaryItem}>Total Candidates: {headerData?.totalCandidates}</div>
                    <div className={styles.summaryItem}>Total Questions: {headerData?.totalQuestions}</div>
                    <div className={styles.summaryItem}>Maximum Marks: {headerData?.maximumMarks}</div>
                    <div className={styles.summaryItem}>Total Time: {headerData?.totalTime} (Mins)</div>
                </div>
            </div>
            <div className={styles.QuestionsBox}>
                {solutionReport?.questions.map((question) => {
                    const userAnswerObj = solutionReport.userMarkedAnswers.find(
                        (marked) => marked.question_no === question.s_no
                    );
                    const userAnswer = userAnswerObj ? userAnswerObj.answer : null;

                    return (
                        <div key={question.s_no} className={styles.reportQue}>
                            <div className={styles.questionText}>
                                {question.s_no}. {question.question}
                            </div>
                            <div className={styles.optionsBox}>
                                {['op1', 'op2', 'op3', 'op4'].map((optionKey, idx) => {
                                    const optionText = question[optionKey as keyof IQuestion];
                                    const style = getOptionStyle(optionKey, question, userAnswer);
                                    return (
                                        <div
                                            key={optionKey}
                                            className={styles.reportsOption}
                                            style={{
                                                color: style.color,
                                                fontWeight: style.fontWeight,
                                            }}
                                        >
                                            <span style={{ display: 'inline-block', width: '20px' }}>
                                                {style.symbol}
                                            </span>
                                            <span>
                                                ({String.fromCharCode(65 + idx)}) {optionText || 'No Text Available'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
