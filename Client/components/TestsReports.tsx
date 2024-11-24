'use client'
import { useState } from 'react';
import styles from '../styles/dashboard.module.css';
import ScoreCard from './ScoreCard';

export default function TestsReports() {
    const [activeTab, setActiveTab] = useState('Score Card'); // Default active tab

    const navButtons = ['Score Card', 'Solution Report', 'Question Report', 'Compare Yourself'];
    return (
        <div className={styles.reportsContainer}>
            {/* Header Section */}
            <div className={styles.reportsHeader}>
                <h1 className="text-[30px] ">Reports</h1>
                <div className={styles.reportsNav}>
                     {navButtons.map((tab) => (
                        <div
                            key={tab}
                            className={`${styles.navButtonWrapper} ${
                                activeTab === tab ? styles.activeNavButtonWrapper : ''
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            <button className={styles.navButton}>{tab}</button>
                            {activeTab === tab && <div className={styles.activeUnderline}></div>}
                        </div>
                    ))}
                </div>
            </div>
            {/* Conditional Content Based on Active Tab */}
            <div className={styles.tabContent}>
                {activeTab === 'Score Card' && <div><ScoreCard/></div>}
                {activeTab === 'Solution Report' && <div>Solution Report Content</div>}
                {activeTab === 'Question Report' && <div>Question Report Content</div>}
                {activeTab === 'Compare Yourself' && <div>Compare Yourself Content</div>}
            </div>
           
        </div>
    );
}
