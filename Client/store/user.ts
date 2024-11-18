import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    name: string;
    email: string;
    role: string;
    createdAt: string;
    picture: string;
}

interface Userdetails {
    no_of_batches: number;
    no_of_teachers: number;
    no_of_students: number;
}

interface profileRequirements {
    user: User;
    userDetails: Userdetails;
}

interface UserStore {
    profile: profileRequirements;
    setUser: (user: User) => void;
    setUserDetails: (userDetails: Userdetails) => void;
    setUserAndDetails: (reqs: profileRequirements) => void;
    setEmail: (email: string) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            profile: {
                user: {
                    name: '',
                    email: '',
                    role: '',
                    createdAt: '',
                    picture: '',
                },
                userDetails: {
                    no_of_batches: 0,
                    no_of_teachers: 0,
                    no_of_students: 0,
                },
            },
            setUser: (user: User) => set((state) => ({
                profile: {
                    ...state.profile,
                    user,
                },
            })),
            setUserDetails: (userDetails: Userdetails) => set((state) => ({
                profile: {
                    ...state.profile,
                    userDetails,
                },
            })),
            setUserAndDetails: (req: profileRequirements) => set(() => ({ profile: req })),
            setEmail: (email: string) => set((state) => ({
                profile: {
                    ...state.profile,
                    user: {
                        ...state.profile.user,
                        email,
                    },
                },
            })),
        }),
        {
            name: 'user-store', // unique name
            partialize: (state) => ({ profile: state.profile }), // persist the whole profile object
        }
    )
);
