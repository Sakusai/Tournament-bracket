// app/api/session/route.ts
import { NextResponse } from 'next/server';
import {verifySession} from "@/app/_lib/session";

export async function GET() {
    try {
        const session = await verifySession();
        return NextResponse.json({ userId: session.userId });
    } catch (error) {
        return new Response(
            JSON.stringify({ userId: null }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
