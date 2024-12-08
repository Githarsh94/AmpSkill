'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../../styles/dashboard.module.css';
import Profile from '../../../components/Profile';
import { fetchStudentProfile } from '../../../Services/student';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';
import StudentTests from '@/components/Student-Tests';
import TestsReports from '@/components/TestsReports';

export default function StudentDashboard() {
    const [activeComponent, setActiveComponent] = useState('Profile');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const email = useUserStore((state) => state.profile.user.email);
    const setUser = useUserStore((state) => state.setUser);
    const setUserAndDetails = useUserStore((state) => state.setUserAndDetails);
    const [isLoading, setIsLoading] = useState(false);
    const [testCode, setTestCode] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!email) return;
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const userProfile = await fetchStudentProfile(email!);
                setUser(userProfile);
            } catch (error) {
                // console.error(error);
                toast.error((error as Error).message);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [email]);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'Profile':
                return <Profile />;
            case 'Tests':
                return <StudentTests setActiveComponent={setActiveComponent} setTestCode={setTestCode} />;
            case 'Reports':
                return <div><TestsReports testCode={testCode} /></div>;
            default:
                return <Profile />;
        }
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.sidebar} ${isSidebarExpanded ? styles.expanded : styles.collapsed
                }`}
            >
                <button
                    className={styles.hamburgerButton}
                    onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                >
                    &#9776; {/* Hamburger icon */}
                </button>
                <button
                    className={`${styles.sidebarButton} mt-10`}
                    onClick={() => setActiveComponent('Profile')}
                    disabled={isLoading}
                >
                    <img
                        src="/images/user.png"
                        alt="Profile"
                        className={styles.icon}
                    />
                    {isSidebarExpanded && <span>Profile</span>}
                </button>
                <button
                    className={styles.sidebarButton}
                    onClick={() => setActiveComponent('Tests')}
                    disabled={isLoading}
                >
                    <img
                        src="/images/tests.png"
                        alt="Tests"
                        className={styles.icon}
                    />
                    {isSidebarExpanded && <span>Tests</span>}
                </button>
                <button
                    className={styles.sidebarButton}
                    onClick={() => setActiveComponent('Reports')}
                    disabled={isLoading}
                >
                    <img
                        src="/images/report.png"
                        alt="Reports"
                        className={styles.icon}
                    />
                    {isSidebarExpanded && <span>Reports</span>}
                </button>
                <button className={styles.sidebarButton} onClick={() => {
                    localStorage.removeItem('sessionId');
                    localStorage.removeItem('Role');
                    localStorage.removeItem('Email');
                    setUserAndDetails({
                        user: {
                            name: '',
                            email: '',
                            role: '',
                            createdAt: '',
                            picture: '',
                        },
                        userDetails: {
                            no_of_batches: 0,
                            no_of_teachers: 0,
                            no_of_students: 0,
                        },
                    });
                    router.push('/login')
                }
                }>
                    <img
                        src="/images/logout.png"
                        alt="Logout"
                        className={styles.icon}
                    />
                    {isSidebarExpanded && <span>Logout</span>}
                </button>
            </div>

            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>AmpSkill Student Dashboard</h1>
                </header>
                {renderComponent()}
            </div>

            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
        </div>
    );
}
