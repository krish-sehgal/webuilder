import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types/index.js'
import axios from 'axios';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, { withCredentials: true })
            .then(res => setUser(res.data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, []);

    const logout = async () => {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be  used inside AuthProvider');
    return context;
}