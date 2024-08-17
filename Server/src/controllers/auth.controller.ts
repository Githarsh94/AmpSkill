// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { auth } from '../config/firebaseAdmin';
import { User } from '../models/user.model';

export const AuthController = {
    signUp: async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            const user = await AuthService.signUpWithEmail(email, password);
            res.status(201).json({ message: 'User registered successfully', user });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const user = await AuthService.loginWithEmail(email, password);
            res.status(200).json({ message: 'User logged in successfully', user });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    googleSignUp: async (req: Request, res: Response) => {
        try {
            const { idToken } = req.body;

            // Verify the ID token with Firebase Admin SDK
            const decodedToken = await auth.verifyIdToken(idToken);

            // Extract the user's information from the token
            const { email, role, batches } = decodedToken;

            // Proceed with user registration or sign-in logic
            // Example: Check if the user already exists, if not, create a new user in your database
            let user = await User.findOne({ email });

            if (!user) {
                user = new User({
                    email,
                    role,
                    batches,
                    provider: 'google',
                });
                await user.save();
            }
            console.log(user);

            res.status(200).json({ message: 'User registered via Google', user });
        } catch (error) {
            console.error('Error during Google sign-up:', error);
            res.status(500).json({ message: (error as Error).message });
        }
    },
};
