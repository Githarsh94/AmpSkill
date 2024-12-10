'use client'

import { useEffect, useState } from 'react';
import styles from '../styles/dashboard.module.css';
import { useUserStore } from '@/store/user';
import { useTestStore } from '@/store/tests';
import { fetchAllTests } from '@/Services/student';
import { useRouter } from 'next/navigation';

interface IQuestion {
    s_no: number;
    question: string;
    op1: string;
    op2: string;
    op3: string;
    op4: string;
    ans: string;
}
interface IBatch {
    batchName: string;
    department: string;
    branch: string;
    year: string;
}
interface Test {
    title: string;
    description: string;
    questions: IQuestion[]; // Array of questions
    batches: IBatch[]; // Array of batch objects
    testCode: string;
    password: string;
    startTime: Date; // Start time of the test
    loginWindow: number; // Login window duration in minutes
    testDuration: number; // Test duration in minutes
    isFullScreenEnforced: boolean;
    isTabSwitchPreventionEnabled: boolean;
    isCameraAccessRequired: boolean;
    subjectName: string;
}
interface ArrayContent {
    test: Test;
    score: number;
    correctAnswers: number;
    incorrectAnswers: number;
    totalQuestions: number;
}


interface StudentTestsProps {
    setActiveComponent: (component: string) => void;
    setTestCode: (testCode: string) => void;
}

export default function StudentTests({ setActiveComponent, setTestCode }: StudentTestsProps) {
    const [shownTests, setShownTests] = useState('Active');
    const activeTests = useTestStore((state) => state.activeTests);
    const completedTests = useTestStore((state) => state.completedTests);
    const upcomingTests = useTestStore((state) => state.upcomingTests);
    const missedTests = useTestStore((state) => state.missedTests);
    const setActiveTests = useTestStore((state) => state.setActiveTests);
    const setCompletedTests = useTestStore((state) => state.setCompletedTests);
    const setUpcomingTests = useTestStore((state) => state.setUpcomingTests);
    const setMissedTests = useTestStore((state) => state.setMissedTests);

    const email = useUserStore((state) => state.profile.user.email);
    const router = useRouter();
    useEffect(() => {

        const fetchTests = async () => {
            try {
                const tests = await fetchAllTests(email);
                // toast.success(tests.message);

                if (JSON.stringify(tests.activeTests) !== JSON.stringify(activeTests)) {
                    setActiveTests(tests.activeTests);
                }

                if (JSON.stringify(tests.completedTests) !== JSON.stringify(completedTests)) {
                    setCompletedTests(tests.completedTests);
                }

                if (JSON.stringify(tests.upcomingTests) !== JSON.stringify(upcomingTests)) {
                    setUpcomingTests(tests.upcomingTests);
                }

                if (JSON.stringify(tests.missedTests) !== JSON.stringify(missedTests)) {
                    setMissedTests(tests.missedTests);
                }
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
                                    >View Report
                                    </button>
                                </div>
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
