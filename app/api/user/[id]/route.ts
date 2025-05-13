import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: { id: true, name: true, email: true },
    });

    return new NextResponse(JSON.stringify({ user: user }), { status: 200 });
}