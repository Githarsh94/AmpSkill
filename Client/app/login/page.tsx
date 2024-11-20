'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig';
import styles from '../../styles/login.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserStore } from '@/store/user';

export default function Login() {
    const setEmail = useUserStore((state) => state.setEmail);
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<string | null>(null);
    const [formEmail, setFormEmail] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const Router = useRouter();

    const handleGoogleLogin = async (role: string) => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            const userEmail = result.user.email; // Get the email

            const response = await fetch(`/auth/google-login`, {
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
            localStorage.setItem('sessionId', idToken);  // Store the session ID in localStorage
            localStorage.setItem('Role', role); // Store the role in localStorage
            localStorage.setItem('Email', userEmail!); // Store the email in localStorage
            setTimeout(() => {
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
            const response = await fetch(`/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formEmail, password, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            setEmail(formEmail);
            toast.success(data.message);
            localStorage.setItem('sessionId', data.sessionId); // Store the session ID in localStorage
            localStorage.setItem('Role', role); // Store the role in localStorage
            localStorage.setItem('Email', formEmail); // Store the email in localStorage
            setTimeout(() => {
                Router.push(`/dashboard/${role}`);
            }, 2000);
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
                    <div className='flex min-w-[350px] '>
                        <input
                            type="email"
                            placeholder="Email"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value.toLowerCase())}
                            className={styles.input}
                        />
                        <img className='invisible '
                            src="https://fonts.gstatic.com/s/i/materialicons/visibility/v6/24px.svg"
                            onClick={() => setShowPassword(false)}
                            alt="Show Password"
                        />
                    </div>
                    <div className="flex min-w-[350px]">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                        {showPassword ? (
                            <img className='cursor-pointer'
                                src="https://fonts.gstatic.com/s/i/materialicons/visibility/v6/24px.svg"
                                onClick={() => setShowPassword(false)}
                                alt="Show Password"
                            />
                        ) : (
                            <img className='cursor-pointer'
                                src="https://fonts.gstatic.com/s/i/materialicons/visibility_off/v6/24px.svg"
                                onClick={() => setShowPassword(true)}
                                alt="Hide Password"
                            />
                        )}
                    </div>
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
                <div className={styles.imageContainerUpper}>
                    <img src="/images/Analysis-bro.png" alt="Illustration" className={styles.signupImage} />
                    <img src="/images/Learning-bro.png" alt="Illustration" className={styles.signupImage} />
                </div >
                <div className={styles.imageContainerLower}>
                    <img src="/images/Onlinetest-amico.png" alt="Illustration" className={styles.signupImage} />
                </div>
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
            {/* <style jsx>{
                `*{
                    border: black 1px solid;
                }`
            }</style> */}
        </div>
    );
}