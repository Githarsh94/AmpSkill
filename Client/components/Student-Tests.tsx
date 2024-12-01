'use client'

import { useEffect, useState } from 'react';
import styles from '../styles/dashboard.module.css';
import { useUserStore } from '@/store/user';
import { fetchAllTests, fetchTestScoreCard } from '@/Services/student';
import { useRouter } from 'next/navigation';


interface ScoreCard {
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

interface StudentTestsProps {
    setActiveComponent: (component: string) => void;
    setTestCode: (testCode: string) => void;
}

export default function StudentTests({ setActiveComponent, setTestCode }: StudentTestsProps) {
    const [shownTests, setShownTests] = useState('Active');
    const [activeTests, setActiveTests] = useState([]);
    const [completedTests, setCompletedTests] = useState([]);
    const [upcomingTests, setUpcomingTests] = useState([]);
    const [missedTests, setMissedTests] = useState([]);
    const [showReport, setShowReport] = useState(false);
    const [reportData, setReportData] = useState<ScoreCard | null>(null);
    const email = useUserStore((state) => state.profile.user.email);
    const router = useRouter();

    useEffect(() => {

        const fetchTests = async () => {
            try {
                const tests = await fetchAllTests(email);
                // toast.success(tests.message);
                setActiveTests(tests.activeTests);
                setCompletedTests(tests.completedTests);
                setUpcomingTests(tests.upcomingTests);
                setMissedTests(tests.missedTests);
            } catch (error) {
                console.error('Failed to fetch tests:', error);
            }
        };

        fetchTests();
    }, [email]);


    const fetchReport = async (testCode: string) => {
        setTestCode(testCode);
        setActiveComponent('Reports');
    };

    const handleOpentest = (testCode: string) => {
        router.push(`/test?testCode=${testCode}&email=${email}`);
    }

    return (
        <div className={styles.studentTests}>
            <div className='text-[30px]'>Test Summary</div>
            <div className={styles.titleUnderline}></div>
            <div className={styles.studentTestsFilterOuter}>
                <nav className={styles.studentTestsFilterInner}>
                    <div className='flex flex-col'>
                        <button className={styles.filterButtons} onClick={() => setShownTests('Active')}>Active</button>
                        {shownTests === 'Active' && <div className={styles.activeUnderline}></div>}
                    </div>
                    <div className='flex flex-col'>
                        <button className={styles.filterButtons} onClick={() => setShownTests('Completed')}>Completed</button>
                        {shownTests === 'Completed' && <div className={styles.activeUnderline}></div>}
                    </div>
                    <div className='flex flex-col'>
                        <button className={styles.filterButtons} onClick={() => setShownTests('Upcoming')}>Upcoming</button>
                        {shownTests === 'Upcoming' && <div className={styles.activeUnderline}></div>}
                    </div>
                    <div className='flex flex-col'>
                        <button className={styles.filterButtons} onClick={() => setShownTests('Missed')}>Missed</button>
                        {shownTests === 'Missed' && <div className={styles.activeUnderline}></div>}
                    </div>
                </nav>
            </div>
            <div className={styles.shownTests}>
                {shownTests === 'Active' && (
                    activeTests.length > 0 ? activeTests.map((test: any) => (
                        <div key={test._id} className={styles.testCard} onClick={() => handleOpentest(test.testCode)}>
                            <div className='font-bold'>Title - {test.title}</div>
                            <div>Date - {new Date(test.startTime).toLocaleDateString()}</div>
                            <div>
                                Time - {test.startTime.split('T')[1].split('.')[0]} ({test.testDuration}) mins
                            </div>
                            <div>Maximum Marks :- {test.questions.length * 4}</div>
                        </div>
                    )) : <div className='text-[20px]'>No Active tests available</div>
                )}
                {shownTests === 'Completed' && (
                    completedTests.length > 0 ? completedTests.map((test: any) => {

                        return (
                            <div key={test._id} className="bg-white shadow-md rounded-lg p-4">
                                <div className="">
                                    <div className="text-lg font-bold">{test.title}</div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(test.startTime).toLocaleDateString()}
                                        <span className="ml-2">{new Date(test.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center mt-4">
                                    <div>
                                        <div className="text-2xl font-bold">{test.totalQuestions * 4}</div>
                                        <div className="text-sm text-gray-500">Maximum Marks</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{test.score}</div>
                                        <div className="text-sm text-gray-500">Scored Marks</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{test.correctAnswers}</div>
                                        <div className="text-sm text-green-500">Right Answers</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{test.incorrectAnswers}</div>
                                        <div className="text-sm text-red-500">Wrong Answers</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{test.totalQuestions - test.correctAnswers - test.incorrectAnswers}</div>
                                        <div className="text-sm text-orange-500">Skipped</div>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                                        onClick={() => fetchReport(test.testCode)}
                                    >
                                        View Report
                                    </button>
                                </div>

                                {showReport && reportData && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                        <div className="bg-[#ead2ef] p-6 rounded-lg shadow-lg relative w-3/4 max-w-2xl">
                                            <button
                                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                                onClick={() => setShowReport(false)}
                                            >
                                                X
                                            </button>
                                            <div className="text-lg font-bold mb-4">Test Report</div>
                                            <div className="grid grid-cols-2 gap-4 p-4">
                                                <div className="bg-white rounded-lg p-2 text-center font-bold">Maximum Marks: {reportData.maximumMarks}</div>
                                                <div className="bg-white rounded-lg p-2 text-center font-bold">Score: {reportData.score}</div>
                                                <div className="bg-white rounded-lg p-2 text-center font-bold">Time Taken: {reportData.timeTaken.toFixed(3)} mins</div>
                                                <div className="bg-white rounded-lg p-2 text-center font-bold">Total Time: {reportData.totalTime} mins</div>
                                                <div className="bg-white rounded-lg p-2 text-center font-bold text-red-500">Incorrect Answers: {reportData.incorrectAnswers}</div>
                                                <div className="bg-white rounded-lg p-2 text-center font-bold text-green-500">Correct Answers: {reportData.correctAnswers}</div>
                                                <div className="bg-white rounded-lg p-2 text-center font-bold">Skipped Answers: {reportData.skippedAnswers}</div>
                                                <div className="bg-white rounded-lg p-2 text-center font-bold">Percentage: {reportData.percentage}%</div>
                                                <div className="bg-white rounded-lg p-2 text-center font-bold">Avg Time per Question: {reportData.avgTimeTakenPerQue.toFixed(3)} mins</div>
                                                <div className="bg-white rounded-lg p-2 text-center font-bold">Total Questions: {reportData.totalQuestions}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }) : <div className="text-2xl text-center">No Completed Tests Available</div>
                )}
                {shownTests === 'Upcoming' && (
                    upcomingTests.length > 0 ? upcomingTests.map((test: any) => (
                        <div key={test._id} className={styles.testCard}>
                            <div className='font-bold'>Title - {test.title}</div>
                            <div>Date - {new Date(test.startTime).toLocaleDateString()}</div>
                            <div>Time - {new Date(test.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({test.testDuration}) mins</div>
                            <div>Maximum Marks :- {test.questions.length * 4}</div>
                        </div>
                    )) : <div className='text-[20px]'>No Upcoming tests available</div>
                )}
                {shownTests === 'Missed' && (
                    missedTests.length > 0 ? missedTests.map((test: any) => (
                        <div key={test._id} className={styles.testCard}>
                            <div className='font-bold'>Title - {test.title}</div>
                            <div>Date - {new Date(test.startTime).toLocaleDateString()}</div>
                            <div>Time - {new Date(test.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({test.testDuration}) mins</div>
                            <div>Maximum Marks :- {test.questions.length * 4}</div>
                        </div>
                    )) : <div className='text-[20px]'>No Missed tests available</div>
                )}
            </div>
        </div>
    );
}
