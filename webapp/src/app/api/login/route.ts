
import { BASE_URL } from "../../types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {email, password} = await req.json();
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),

        })
        if (!response.ok) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
        }
        const data = await response.json();
        console.log(data);
        return NextResponse.json(data);
    }catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}