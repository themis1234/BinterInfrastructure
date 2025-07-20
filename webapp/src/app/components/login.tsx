"use client";

import { useState } from "react";
import { useAuth } from "../Providers/AuthProvider";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{ backgroundColor: "#840027" }}
                    className="w-full text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                    {isLoading ? "Logging in..." : "Log in"}
                </button>
            </form>
        </div>
    );
}
