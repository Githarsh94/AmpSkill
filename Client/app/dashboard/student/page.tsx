'use client';

import { useRouter } from 'next/navigation';
import styles from '../../../styles/dashboard.module.css';

export default function StudentDashboard() {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/login');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Student Dashboard</h1>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={() => router.push('/student/view-assignments')}>
                    View Assignments
                </button>
                {/* Add more buttons for other functionalities */}
            </div>
            <button className={`${styles.button} ${styles.logoutButton}`} onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}
