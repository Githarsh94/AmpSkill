// /app/dashboard/admin/page.tsx

'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../../styles/dashboard.module.css';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const { email } = useAuth(); // Access the email from the context
    const [user, setUser] = useState({ name: '', email: '', role: '', createdAt: '', picture: '' });
    const router = useRouter();
    const handleProfile = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/admin/dashboard/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            setUser(data)
            toast.success('Profile loaded successfully!');
        } catch (error) {
            console.error(error);
            toast.error((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignTeacher = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/admin/assign-teacher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ /* your payload here */ }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Teacher assigned successfully!');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Failed to assign teacher:', error);
            toast.error('Failed to assign teacher.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        router.push('/login');
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <button className={styles.sidebarButton} onClick={handleProfile} disabled={isLoading}>
                    {isLoading ? 'Fetching...' : 'Profile'}
                </button>
                <button className={styles.sidebarButton} onClick={handleAssignTeacher}>
                    Assign Teachers
                </button>
                <button className={styles.sidebarButton} onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>AmpSkill Admin Dashboard</h1>
                </header>
                <div className={styles.userInfo}>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Created At:</strong> {user.createdAt}</p>
                </div>
            </div>

            <div className={styles.profileSection}>
                <img src={user.picture} alt="Profile" className={styles.profileImage} />
                <div className={styles.datetimeContainer}>
                    {/* <p>{new Date().toLocaleString()}</p> */}
                </div>
            </div>

            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
        </div>
    );
}
