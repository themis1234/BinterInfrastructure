'use client';
import { create } from 'domain';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index'
import { fetchWithAuth } from '../utils/api';
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string; }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
        }
        const checkAuth = async () => {
            const response = await fetch('/api/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            })
            const data = await response.json();
            console.log(data)
            if (data.success) {
                setUser(data.data.user);
                setIsAuthenticated(true);
            }
        }
        checkAuth();
    },[]);
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            if (!response.ok) {
                return { success: false, message: 'Login failed' };
            }

            const data = await response.json();
            const extractedData = data.data;
            console.log(extractedData);

            if (extractedData.user.role === "user") {
                console.log("Normal user not authorized");
                return { success: false, message: 'User not authorized' };
            }

            localStorage.setItem('token', extractedData.token);
            setUser(extractedData.user);
            setIsAuthenticated(true);

            return { success: true, message: 'Login successful' };

        } catch (error) {
            console.error('Error logging in:', error);
            return { success: false, message: 'An error occurred during login' };
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};