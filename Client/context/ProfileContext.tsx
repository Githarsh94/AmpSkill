'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface UserProfile {
    name: string;
    email: string;
    role: string;
    createdAt: string;
    picture: string;
}

interface ProfileContextType {
    user: UserProfile;
    setUser: (user: UserProfile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile>({
        name: '',
        email: '',
        role: '',
        createdAt: '',
        picture: ''
    });

    return (
        <ProfileContext.Provider value={{ user, setUser }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
