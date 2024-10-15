'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig';
import styles from '../../styles/signup.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserStore } from '@/store/user';

export default function Login() {
    const setEmail = useUserStore((state) => state.setEmail);
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<string | null>(null);
    const [formEmail, setFormEmail] = useState<string>("");
    const Router = useRouter();

    const handleGoogleLogin = async (role: string) => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            const userEmail = result.user.email; // Get the email

            const response = await fetch('https://amp-skill-backend.vercel.app/api/auth/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ idToken, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setEmail(userEmail!); // Store the email in context
            toast.success(data.message);
            setTimeout(() => {
                localStorage.setItem('sessionId', idToken);  // Store the session ID in localStorage
                localStorage.setItem('Role', role); // Store the role in localStorage
                localStorage.setItem('Email', userEmail!); // Store the email in localStorage
                Router.push(`/dashboard/${role}`);
            }, 2000);
        } catch (error: any) {
            console.error('Error during Google login:', error);
            toast.error(error.message);
        }
    };

    const handleManualLogin = async () => {
        if (!role) {
            toast.error('Please select a role.');
            return;
        }

        try {
            const response = await fetch('https://amp-skill-backend.vercel.app/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formEmail, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                setEmail(formEmail);
                toast.success('Login Successful');
                setTimeout(() => {
                    localStorage.setItem('sessionId', data.sessionId); // Store the session ID in localStorage
                    localStorage.setItem('Role', role); // Store the role in localStorage
                    localStorage.setItem('Email', formEmail); // Store the email in localStorage
                    Router.push(`/dashboard/${role}`);
                }, 2000);
            } else {
                throw new Error(data.message);
            }
        } catch (error: any) {
            console.error('Error during manual login:', error);
            toast.error(error.message);
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.signupBox}>
                <h1 className={styles.title}>AmpSkill</h1>
                <div className={styles.formContainer}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value.toLowerCase())}
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
                    <button className={styles.signupButton} onClick={handleManualLogin}>Login</button>
                    <span className={styles.orKeyword}>or</span>
                    <div className={styles.googleContainer}>
                        <button className={styles.googleButton} onClick={() => handleGoogleLogin('admin')}>
                            Login as Admin with Google
                        </button>
                        <button className={styles.googleButton} onClick={() => handleGoogleLogin('teacher')}>
                            Login as Teacher with Google
                        </button>
                        <button className={styles.googleButton} onClick={() => handleGoogleLogin('student')}>
                            Login as Student with Google
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
