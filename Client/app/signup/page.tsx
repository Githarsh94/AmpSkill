'use client';

import { useState } from 'react';
import { auth } from '../../lib/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import styles from '../../styles/signup.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUp() {
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<string | null>(null);

    const handleGoogleSignUp = async (role: string) => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            const response = await fetch('https://amp-skill-backend.vercel.app/api/auth/google-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken, role }),
            });

            const data = await response.json();
            if (!response.ok) {
                console.error(data.message);
                throw new Error(data.message);
            }
            toast.success(data.message);
            // Optionally redirect to login page
        } catch (error: any) {
            console.error('Error during Google sign-up:', error);
            toast.error(error.message);
        }
    };

    const handleManualSignUp = async () => {
        if (!role) {
            toast.error('Please select a role.');
            return;
        }

        try {
            const response = await fetch('https://amp-skill-backend.vercel.app/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();
            if (!response.ok) {
                console.error(data.message);
                throw new Error(data.message);
            }
            toast.success('Account created successfully. Please log in.');
        } catch (error: any) {
            console.error('Error during manual sign-up:', error);
            toast.error(error.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.signupBox}>
                <h1 className={styles.title}>AmpSkill</h1>
                <div className={styles.formContainer}>
                    <input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                    />
                    <div className={styles.roleSelection}>
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="admin"
                                checked={role === 'admin'}
                                onChange={() => setRole('admin')}
                            />
                            Admin
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="teacher"
                                checked={role === 'teacher'}
                                onChange={() => setRole('teacher')}
                            />
                            Teacher
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="student"
                                checked={role === 'student'}
                                onChange={() => setRole('student')}
                            />
                            Student
                        </label>
                    </div>
                    <button className={styles.signupButton} onClick={handleManualSignUp}>Sign Up</button>
                    <span className={styles.orKeyword}>or</span>
                    <div className={styles.googleContainer}>
                        <button className={styles.googleButton} onClick={() => handleGoogleSignUp('admin')}>
                            Sign Up as Admin with Google
                        </button>
                        <button className={styles.googleButton} onClick={() => handleGoogleSignUp('teacher')}>
                            Sign Up as Teacher with Google
                        </button>
                        <button className={styles.googleButton} onClick={() => handleGoogleSignUp('student')}>
                            Sign Up as Student with Google
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.imageContainer}>
                <img src="/images/signup-look.jpg" alt="Illustration" className={styles.signupImage} />
            </div>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}