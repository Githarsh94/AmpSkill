import { create } from 'zustand';

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

export const useUserStore = create<UserStore>((set) => ({
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
}));
