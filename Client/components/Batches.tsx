'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from '../styles/dashboard.module.css';
import { addBatch, fetchBatches, deleteBatch } from '../Services/admin';

interface IBatch {
    batchName: string;
    department: string;
    branch: string;
    year: number;
    students: string[];
    teachers: { teacher: string, subject: string }[];
}

const AddBatch = () => {
    const [batchName, setBatchName] = useState('');
    const [department, setDepartment] = useState('');
    const [branch, setBranch] = useState('');
    const [year, setYear] = useState<number | ''>('');
    const [students, setStudents] = useState<string[]>([]);
    const [teachers, setTeachers] = useState<{ teacher: string, subject: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [teacherEmails, setTeacherEmails] = useState<string[]>([]);
    const [subjectNames, setSubjectNames] = useState<string[]>([]);
    const [batches, setBatches] = useState<IBatch[]>([]);

    useEffect(() => {
        const loadBatches = async () => {
            try {
                const batches = await fetchBatches();
                setBatches(batches);
            } catch (error) {
                console.error('Failed to fetch batches:', error);
                toast.error((error as Error).message);
            }
        };
        loadBatches();
    }, []);

    const handleAddBatch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await addBatch({ batchName, department, branch, year: Number(year), students, teachers });
            toast.success('Batch added successfully!');
            resetForm();
        } catch (error) {
            console.error('Failed to add batch:', error);
            toast.error((error as Error).message);
        } finally {
            setIsLoading(false);
            fetchBatches().then((batches) => setBatches(batches));
        }
    };

    const handleDeleteBatch = async (batchName: string, department: string, branch: string, year: number) => {
        try {
            await deleteBatch(batchName, department, branch, year);
            fetchBatches().then((batches) => setBatches(batches));
            toast.success('Batch deleted successfully');
        } catch (error) {
            console.error('Failed to delete batch:', error);
            toast.error((error as Error).message);
        }
    };

    const resetForm = () => {
        setBatchName('');
        setDepartment('');
        setBranch('');
        setYear('');
        setStudents([]);
        setTeachers([]);
        setTeacherEmails([]);
        setSubjectNames([]);
    };

    useEffect(() => {
        const updatedTeachers = teacherEmails.map((teacher, index) => ({
            teacher,
            subject: subjectNames[index],
        }));
        setTeachers(updatedTeachers);
    }, [teacherEmails, subjectNames]);

    const addStudent = () => {
        const studentInput = (document.getElementById("students") as HTMLInputElement).value;
        if (!studentInput) {
            toast.error('Please enter a student email');
            return;
        }
        setStudents([...students, studentInput]);
        (document.getElementById("students") as HTMLInputElement).value = ''; // Clear input after adding
    }

    const addTeacher = () => {
        const teacherInput = (document.getElementById("teachers") as HTMLInputElement).value;
        if (!teacherInput) {
            toast.error('Please enter a teacher email');
            return;
        }
        setTeacherEmails([...teacherEmails, teacherInput]);
        (document.getElementById("teachers") as HTMLInputElement).value = ''; // Clear input after adding
    }

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
            <div className={styles.batchList}>
                <h2>Batches</h2>
                {batches.map((batch, index) => (
                    <div key={index} className={styles.batchItem}>
                        <p>Batch Name: {batch.batchName}</p>
                        <p>Department: {batch.department}</p>
                        <p>Branch: {batch.branch}</p>
                        <p>Year: {batch.year}</p>
                        <p>Students: {batch.students.join(', ')}</p>
                        <p>Teachers:</p>
                        <ul>
                            {batch.teachers.map((teacher, index) => (
                                <li key={index}>
                                    Teacher: {teacher.teacher}, Subject: {teacher.subject}
                                </li>
                            ))}
                        </ul>
                        <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteBatch(batch.batchName, batch.department, batch.branch, batch.year)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            <h2>Add Batch</h2>
            <form onSubmit={handleAddBatch} className={styles.form}>
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
                <input
                    id='students'
                    type="text"
                    placeholder="Student Email"
                />
                <label>{students.join(', ')}</label>
                <div className={styles.buttonsContainer}>
                    <button
                        className={styles.addButtons}
                        onClick={(e) => {
                            e.preventDefault();
                            addStudent();
                        }}
                    >
                        Add Student
                    </button>
                    <button
                        className={styles.addButtons}
                        onClick={(e) => {
                            e.preventDefault();
                            setStudents([]);
                        }
                        }
                    >Clear Students</button>
                </div>

                <input
                    id='teachers'
                    type="text"
                    placeholder="Teacher Email"
                />
                <label>{teacherEmails.join(', ')}</label>
                <div className={styles.buttonsContainer}>
                    <button
                        className={styles.addButtons}
                        onClick={(e) => {
                            e.preventDefault();
                            addTeacher();
                        }}
                    >Add Teacher
                    </button>
                    <button
                        className={styles.addButtons}
                        onClick={(e) => {
                            e.preventDefault();
                            setTeacherEmails([]);
                        }
                        }
                    >Clear Teachers</button>
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
                        }
                        }
                    >
                        Clear Subjects
                    </button>
                </div>
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Batch'}
                </button>
            </form>
        </div>
    );
};

export default AddBatch;