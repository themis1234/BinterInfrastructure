import { NextResponse } from "next/server";
import { User } from "../types";
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    return fetch(url, {...options, headers});
};

export const getUsers = async () =>{
    try {
        const response = await fetchWithAuth(`api/admin`, { method: 'GET' });
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ error: data.error }, { status: 400 });
        }
        return {user: data.data.users as User[]};
    } catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}