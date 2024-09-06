'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../../styles/dashboard.module.css';
import Profile from '../../../components/Profile';
import { fetchStudentProfile } from '../../../Services/student';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';

export default function StudentDashboard() {
    const [activeComponent, setActiveComponent] = useState('Profile');
    const email = useUserStore((state) => state.user.email);
    const setUser = useUserStore((state) => state.setUser);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const userProfile = await fetchStudentProfile(email!);
                setUser(userProfile);
            } catch (error) {
                console.error(error);
                toast.error((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [email, setUser]);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'Profile':
                return <Profile />;
            case 'Assignments':
                return <div>Assignments</div>;
            case 'Tests':
                return <div>Tests</div>;
            default:
                return <Profile />;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <button
                    className={styles.sidebarButton}
                    onClick={() => setActiveComponent('Profile')}
                    disabled={isLoading}
                >
                    {isLoading ? 'Fetching...' : 'Profile'}
                </button>
                <button
                    className={styles.sidebarButton}
                    onClick={() => setActiveComponent('Assignments')}
                >
                    Assignments
                </button>
                <button
                    className={styles.sidebarButton}
                    onClick={() => setActiveComponent('Tests')}
                    disabled={isLoading}
                >
                    Tests
                </button>
                <button className={styles.sidebarButton} onClick={() => {
                    localStorage.removeItem('sessionId');
                    localStorage.removeItem('Role');
                    localStorage.removeItem('Email');
                    router.push('/login')
                }
                }>
                    Logout
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
