'use client';

import { useState } from 'react';
import { auth } from '../../lib/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import styles from '../../styles/signup.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();

    const handleGoogleSignUp = async (role: string) => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            const response = await fetch('/auth/google-signup', {
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
            setTimeout(() => {
                router.push('/login');
            }, 3000);

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
            const response = await fetch('/auth/signup', {
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
            toast.success(data.message);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
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
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        className={styles.input}
                    />
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
                <div className={styles.imageContainerUpper}>
                    <img src="/images/Progress indicator-rafiki.png" alt="Illustration" className={styles.signupImage} />
                    <img src="/images/Shared goals-bro.png" alt="Illustration" className={styles.signupImage} />
                </div >
                <div className={styles.imageContainerLower}>
                    <img src="/images/Team goals-bro.png" alt="Illustration" className={styles.signupImage} />
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
        </div>
    );
}