'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logOut } from '../services/api';

interface User {
    id: string,
    email: string,
    name: string
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() =>{
        const savedUser = localStorage.getItem('user')

        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }

        setIsLoading(false)
        
    }, [])

    const login = (user: User) => {
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
    }

    const logout = async () => {
        await logOut()
        localStorage.removeItem('user')
        setUser(null)
        router.push('/')
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout}}>
         { children }
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
