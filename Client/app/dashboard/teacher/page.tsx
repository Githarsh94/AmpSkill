'use client';

import { useState } from 'react';
import styles from '@/styles/dashboard.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TeacherDashboard() {
    const [isLoading, setIsLoading] = useState(false);

    const handleViewBatches = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/teacher/view-batches', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                // Process the data (e.g., display batches)
                toast.success('Batches fetched successfully!');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error('Failed to fetch batches.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        // Your logout logic here
        toast.success('Logged out successfully');
    };

    return (
        <div className={styles.container}>
            <h1>Teacher Dashboard</h1>
            <button className={styles.actionButton} onClick={handleViewBatches} disabled={isLoading}>
                {isLoading ? 'Fetching...' : 'View Assigned Batches'}
            </button>
            <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
            </button>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
        </div>
    );
}
