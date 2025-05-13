import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const userId = parseInt(params.id, 10);

    try {
        const tournaments = await prisma.tournament.findMany({
            where: { createdById: userId },
            select: { id: true, name: true },
        });

        return NextResponse.json({ tournaments }, { status: 200 });
    } catch (error) {
        console.error("Erreur serveur", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}