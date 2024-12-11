'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../../styles/dashboard.module.css';
import Profile from '../../../components/Profile';
import TestCreation from '@/components/Teacher-Tests';
import { fetchTeacherProfile } from '../../../Services/teacher';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';
import TeacherBatches from '@/components/Teacher-Batches';

export default function TeacherDashboard() {
    const [activeComponent, setActiveComponent] = useState('Profile');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const email = useUserStore((state) => state.profile.user.email);
    const setUser = useUserStore((state) => state.setUser);
    const setUserAndDetails = useUserStore((state) => state.setUserAndDetails);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!email) return;

        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const userProfile = await fetchTeacherProfile(email);
                setUser(userProfile);
            } catch (error) {
                //console.error(error);
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
            case 'Batches':
                return <div><TeacherBatches /></div>;
            case 'Tests':
                return <div><TestCreation /></div>;
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
                    onClick={() => setActiveComponent('Batches')}
                >
                    <img
                        src="/images/batch-processing.png"
                        alt="Batches"
                        className={styles.icon}
                    />
                    {isSidebarExpanded && <span>Batches</span>}
                </button>
                <button
                    className={styles.sidebarButton}
                    onClick={() => setActiveComponent('Tests')}
                    disabled={isLoading}
                >
                    <img
                        src="/images/tests.png"
                        alt="Assign Teachers"
                        className={styles.icon}
                    />
                    {isSidebarExpanded && <span>Tests</span>}
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
                    <h1>AmpSkill Teacher Dashboard</h1>
                </header>
                {renderComponent()}
            </div>

            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
        </div>
    );
}
