// src/services/auth.service.ts
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ENV } from '../config/env';

const firebaseConfig = {
    apiKey: ENV.FIREBASE_API_KEY,
    authDomain: ENV.FIREBASE_AUTH_DOMAIN,
    projectId: ENV.FIREBASE_PROJECT_ID,
    storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
    appId: ENV.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const AuthService = {
    signUpWithEmail: async (email: string, password: string) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    },

    loginWithEmail: async (email: string, password: string) => {
        return await signInWithEmailAndPassword(auth, email, password);
    },

    signUpWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        return await signInWithPopup(auth, provider);
    },
};
