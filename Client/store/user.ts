import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    name: string;
    email: string;
    role: string;
    createdAt: string;
    picture: string;
}

interface UserStore {
    user: User;
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
            partialize: (state) => ({ user: { email: state.user.email } }), // persist only the email
        }
    )
);
