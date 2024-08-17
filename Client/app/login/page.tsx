// app/login/page.tsx
'use client';

import { useState } from 'react';
import { auth } from '../../lib/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const LoginPage = () => {
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            const response = await fetch('http://localhost:3000/api/auth/google-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            if (!response.ok) {
                throw new Error('Failed to sign in');
            }

            const data = await response.json();
            console.log('Login successful:', data);
            // Handle success (e.g., redirect to dashboard)
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            setError('Failed to sign in. Please try again.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default LoginPage;
