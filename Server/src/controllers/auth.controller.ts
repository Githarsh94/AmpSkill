// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { auth } from '../config/firebaseAdmin';
import { User } from '../models/user.model';

export const AuthController = {
    signUp: async (req: Request, res: Response) => {
        const { email, password, role } = req.body;

        try {
            // Check if the user already exists in MongoDB
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Sign up the user with Firebase
            const firebaseUser = await AuthService.signUpWithEmail(email, password);
            console.log(firebaseUser);
            // Store the new user in MongoDB
            const newUser = new User({
                uid: firebaseUser.user.uid,
                email: firebaseUser.user.email,
                name: firebaseUser.user.displayName || 'Anonymous',
                picture: firebaseUser.user.photoURL || '',
                role: role, // Role passed from the front-end
                provider: 'firebase',
                createdAt: new Date(),
            });

            await newUser.save();
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            // Check if user exists in Firebase
            const user = await AuthService.loginWithEmail(email, password);
            if (!user) {
                return res.status(404).json({ message: 'User does not exist.' });
            }

            // Check if user exists in MongoDB
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.status(404).json({ message: 'User not found in database.' });
            }

            // Compare roles
            const { role } = req.body;
            if (existingUser.role !== role) {
                return res.status(403).json({ message: `Role mismatch: Expected ${existingUser.role}, got ${role}. `});
            }

            res.status(200).json({ message: 'User logged in successfully', user: existingUser });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    googleSignUp: async (req: Request, res: Response) => {
        try {
            const { idToken, role } = req.body;

            // Verify the ID token with Firebase Admin SDK
            const decodedToken = await auth.verifyIdToken(idToken);

            // Extract user info from token
            const { uid, email, name, picture, batch } = decodedToken;

            // Check if the user already exists
            let user = await User.findOne({ email });

            if (!user) {
                // Create a new user with the selected role
                user = new User({
                    uid,
                    email,
                    name,
                    picture,
                    role,
                    provider: 'google',
                    batch,
                });
                await user.save();
            } else {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Notify the user that they have registered successfully
            res.status(200).json({ message: `User registered as ${role}. Please log in. `});
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    googleSignIn: async (req: Request, res: Response) => {
        try {
            const { idToken, role } = req.body;
            // Verify the ID token with Firebase Admin SDK
            const decodedToken = await auth.verifyIdToken(idToken);

            // Extract user info from token
            const { email } = decodedToken;

            // Find the user in the database
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if the role matches
            if (user.role === role) {
                res.status(200).json({ message: `Successfully logged in as ${role} `});
            } else {
                res.status(400).json({ message: 'Role does not match the registered role' });
            }
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },
};
