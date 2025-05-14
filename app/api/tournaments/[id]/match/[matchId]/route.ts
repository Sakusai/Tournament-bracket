import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ matchId: string }> }
) {
    const resolvedParams = await params;
    const { matchId } = resolvedParams;
    const id = parseInt(matchId, 10);

    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { winnerIndex } = body;

    if (winnerIndex !== 0 && winnerIndex !== 1) {
        return NextResponse.json(
            { error: "winnerIndex doit être 0 ou 1" },
            { status: 400 }
        );
    }

    try {
        const match = await prisma.match.update({
            where: { id: id },
            data: {
                winnerId:
                    winnerIndex === 0
                        ? match.player1Id
                        : match.player2Id,
            },
            include: {
                player1: true,
                player2: true,
                winner: true,
            },
        });

        return NextResponse.json(match, { status: 200 });
    } catch (error) {
        console.error("Erreur serveur", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}