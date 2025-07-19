"use client"

import { useState } from "react";
import { useAuth } from "../Providers/AuthProvider";
import styles from '../main.module.css';
export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); 
        setIsLoading(true);

        try {
            const result = await login(email, password);
            
            if (result && !result.success) {
                setError(result.message || "Login failed");
            }
            
        } catch (error) {
            setError("An unexpected error occurred");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log in"}
                </button>
            </form>
        </div>
    );
}