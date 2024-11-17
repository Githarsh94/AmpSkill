'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from '../styles/dashboard.module.css';
import { assignTeachers, unassignTeachers, getAllTeachers } from '../Services/admin';

const AssignTeachers = () => {
    const [batchName, setBatchName] = useState('');
    const [department, setDepartment] = useState('');
    const [branch, setBranch] = useState('');
    const [year, setYear] = useState<number | ''>('');
    const [teacherEmails, setTeacherEmails] = useState<string[]>([]);
    const [subjectNames, setSubjectNames] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUnassigning, setIsUnassigning] = useState(false);
    const [teachers, setTeachers] = useState<{ email: string, name: string }[]>([]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await getAllTeachers();
                setTeachers(response.teachers);
            } catch (error) {
                console.error('Failed to fetch teachers:', error);
                toast.error('Failed to fetch teachers');
            }
        };

        fetchTeachers();
    }, []);

    const handleUnassignTeachers = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUnassigning(true);
        try {
            const teachers = teacherEmails.map((teacher, index) => ({
                teacher,
                subject: subjectNames[index],
            }));
            await unassignTeachers({ batchName, department, branch, year: Number(year), teachers });
            toast.success('Teachers unassigned successfully!');
            resetForm();
        } catch (error) {
            console.error('Failed to unassign teachers:', error);
            toast.error((error as Error).message);
        } finally {
            setIsUnassigning(false);
        }
    };

    const handleAssignTeachers = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const teachers = teacherEmails.map((teacher, index) => ({
                teacher,
                subject: subjectNames[index],
            }));
            await assignTeachers({ batchName, department, branch, year: Number(year), teachers });
            toast.success('Teachers assigned successfully!');
            resetForm();
        } catch (error) {
            console.error('Failed to assign teachers:', error);
            toast.error((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setBatchName('');
        setDepartment('');
        setBranch('');
        setYear('');
        setTeacherEmails([]);
        setSubjectNames([]);
    };

    const handleTeacherCheckboxChange = (email: string) => {
        setTeacherEmails(prevEmails =>
            prevEmails.includes(email)
                ? prevEmails.filter(e => e !== email)
                : [...prevEmails, email]
        );
    };

    const addSubject = () => {
        const subjectInput = (document.getElementById("subjects") as HTMLInputElement).value;
        if (!subjectInput) {
            toast.error('Please enter a subject name');
            return;
        }
        setSubjectNames([...subjectNames, subjectInput]);
        (document.getElementById("subjects") as HTMLInputElement).value = ''; // Clear input after adding
    }

    return (
        <div className={styles.batchContent}>
            <h2>Assign Teachers to Batch</h2>
            <form onSubmit={handleAssignTeachers} className={styles.form}>
                <input
                    type="text"
                    placeholder="Batch Name"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    required
                />
                <div className={styles.teachersContainer}>
                    <h3>Select Teachers</h3>
                    <div className='flex'>
                        {teachers.map(teacher => (
                            <div key={teacher.email} className={styles.teacherItem}>
                                <input
                                    type="checkbox"
                                    id={teacher.email}
                                    checked={teacherEmails.includes(teacher.email)}
                                    onChange={() => handleTeacherCheckboxChange(teacher.email)}
                                    className={styles.checkbox}
                                />
                                <label htmlFor={teacher.email} className={styles.teacherLabel}>
                                    {teacher.name} ({teacher.email})
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <input
                    id='subjects'
                    type="text"
                    placeholder="Subject Name"
                />
                <label>{subjectNames.join(', ')}</label>
                <div className={styles.buttonsContainer}>
                    <button
                        className={styles.addButtons}
                        onClick={(e) => {
                            e.preventDefault();
                            addSubject();
                        }}
                    >
                        Add Subject
                    </button>
                    <button
                        className={styles.addButtons}
                        onClick={(e) => {
                            e.preventDefault();
                            setSubjectNames([]);
                        }}
                    >
                        Clear Subjects
                    </button>
                </div>
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    {isLoading ? 'Assigning...' : 'Assign Teachers'}
                </button>
                <br /><br />
                <button type="button" className={styles.submitButton} disabled={isUnassigning} onClick={handleUnassignTeachers}>
                    {isLoading ? 'Unassigning...' : 'Unassign Teachers'}
                </button>
            </form>
        </div>
    );
};

export default AssignTeachers;
