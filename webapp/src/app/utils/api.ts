import { NextResponse } from "next/server";
import { User, QRCode } from "../types";
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    return fetch(url, { ...options, headers });
};

export const getUsers = async () => {
    try {
        const response = await fetchWithAuth(`api/admin`, { method: 'GET' });
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ error: data.error }, { status: 400 });
        }
        return { user: data.data.users as User[] };
    } catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const getQRCodes = async () => {
    try {
        const response = await fetchWithAuth(`api/qr-codes`, { method: 'GET' });
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ error: data.error }, { status: 400 });
        }
        console.log(data.data.qrCodes);
        return { qrcodes: data.data.qrCodes as QRCode[] };
    } catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}