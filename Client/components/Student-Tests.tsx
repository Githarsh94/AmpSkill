'use client'

import { useEffect, useState } from 'react';
import styles from '../styles/dashboard.module.css';
import { useUserStore } from '@/store/user';
import { fetchAllTests } from '@/Services/student';
import { toast } from 'react-toastify';
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
                    completedTests.length > 0 ? completedTests.map((test: any) => (
                        <div key={test._id} className={styles.testCard}>
                            <div className='font-bold'>Title - {test.title}</div>
                            <div>Date - {new Date(test.startTime).toLocaleDateString()}</div>
                            <div>Time - {new Date(test.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({test.testDuration}) mins</div>
                            <div>Maximum Marks :- {test.questions.length * 4}</div>
                        </div>
                    )) : <div className='text-[20px]'>No Completed tests available</div>
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

