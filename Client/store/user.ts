import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    name: string;
    email: string;
    role: string;
    createdAt: string;
    picture: string;
}

interface Userdetails{
    no_of_batches: number;
    no_of_teachers: number;
    no_of_students: number;
}
interface UserStore {
    user: User;
    userDetails: Userdetails;
    setUserDetails: (userDetails: Userdetails) => void;
    setUser: (user: User) => void;
    setEmail: (email: string) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
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
            setUserDetails: (userDetails: Userdetails) => set(() => ({ userDetails })),
            setUser: (user: User) => set(() => ({ user })),
            setEmail: (email: string) => set((state) => ({
                user: {
                    ...state.user,
                    email,
                },
            })),
        }),
        {
            name: 'user-store', // unique name
            partialize: (state) => ({ user: state.user, userDetails: state.userDetails }), // persist the whole user object
        }
    )
);
