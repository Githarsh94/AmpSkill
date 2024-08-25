'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../../styles/dashboard.module.css';
import { useProfile } from '../../../context/ProfileContext';
import Profile from '../../../components/Profile';
import AddBatch from '../../../components/AddBatch';
import AssignTeacher from '../../../components/AssignTeacher';
import { fetchAdminProfile, assignTeacher } from '../../../Services/admin';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [activeComponent, setActiveComponent] = useState('Profile');
    const { email } = useAuth();
    const { setUser } = useProfile();
    const [isLoading, setIsLoading] = useState(false);
    const router= useRouter();

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const userProfile = await fetchAdminProfile(email!);
                setUser(userProfile);
                toast.success('Profile loaded successfully!');
            } catch (error) {
                console.error(error);
                toast.error((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [email, setUser]);

    const handleAssignTeacher = async () => {
        setIsLoading(true);
        try {
            await assignTeacher({ /* your payload here */ });
            toast.success('Teacher assigned successfully!');
        } catch (error) {
            console.error('Failed to assign teacher:', error);
            toast.error((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'Profile':
                return <Profile />;
            case 'AddBatch':
                return <AddBatch />;
            case 'AssignTeacher':
                return <AssignTeacher />;
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
                    onClick={() => setActiveComponent('AddBatch')}
                >
                    Add Batch
                </button>
                <button
                    className={styles.sidebarButton}
                    onClick={() => setActiveComponent('AssignTeacher')}
                    disabled={isLoading}
                >
                    Assign Teachers
                </button>
                <button className={styles.sidebarButton} onClick={() => router.push('/login')}>
                    Logout
                </button>
            </div>

            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>AmpSkill Admin Dashboard</h1>
                </header>
                {renderComponent()}
            </div>

            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
        </div>
    );
}
