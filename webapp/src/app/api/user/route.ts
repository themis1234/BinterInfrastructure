
import { BASE_URL } from "../../types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const response = await fetch(`${BASE_URL}/auth/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${req.headers.get('Authorization')}`
            },

        })
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ error: data.error }, { status: 400 });
        }
        console.log(data);
        return NextResponse.json(data);
    }catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}