'use client'

import { useEffect, useState } from 'react';
import styles from '../styles/dashboard.module.css';
import { useUserStore } from '@/store/user';
import { fetchAllTests } from '@/Services/student';
import { useRouter } from 'next/navigation';



export default function StudentTests() {
    const [shownTests, setShownTests] = useState('Active');
    const [activeTests, setActiveTests] = useState([]);
    const [completedTests, setCompletedTests] = useState([]);
    const [upcomingTests, setUpcomingTests] = useState([]);
    const [missedTests, setMissedTests] = useState([]);
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
                            <div>Time - {new Date(test.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({test.testDuration}) mins</div>
                            <div>Maximum Marks :- {test.questions.length * 4}</div>
                        </div>
                    )) : <div className='text-[20px]'>No Active tests available</div>
                )}
                {shownTests === 'Completed' && (
                    completedTests.length > 0 ? completedTests.map((test: any) => {
                        const totalQuestions = test.totalQuestions;
                        const rightAnswers = test.correctAnswers;
                        const wrongAnswers = test.incorrectAnswers;
                        const skippedAnswers = totalQuestions - rightAnswers - wrongAnswers;
                        const maxMarks = totalQuestions * 4;
                        const scoredMarks = test.score;

                        return (
                            <div key={test._id} className="bg-white shadow-md rounded-lg p-4">
                                {/* Title and Date */}
                                <div className="">
                                    <div className="text-lg font-bold">{test.title}</div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(test.startTime).toLocaleDateString()}
                                        <span className="ml-2">{new Date(test.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                {/* Scores Section */}
                                <div className="grid grid-cols-3 gap-4 text-center mt-4">
                                    <div>
                                        <div className="text-2xl font-bold">{maxMarks}</div>
                                        <div className="text-sm text-gray-500">Maximum Marks</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{scoredMarks}</div>
                                        <div className="text-sm text-gray-500">Scored Marks</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{rightAnswers}</div>
                                        <div className="text-sm text-green-500">Right Answers</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{wrongAnswers}</div>
                                        <div className="text-sm text-red-500">Wrong Answers</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{skippedAnswers}</div>
                                        <div className="text-sm text-orange-500">Skipped</div>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
                                        View Report
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

