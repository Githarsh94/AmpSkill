// /app/context/AuthContext.tsx

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    email: string | null;
    setEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [email, setEmail] = useState<string | null>(null);

    return (
        <AuthContext.Provider value={{ email, setEmail }}>
            {children}
        </AuthContext.Provider>
    );
};
