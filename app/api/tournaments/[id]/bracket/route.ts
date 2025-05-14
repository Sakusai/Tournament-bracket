import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const tournamentId = parseInt(id, 10);

    try {
        const tournament = await prisma.tournament.findUnique({
            where: { id: tournamentId },
        });

        const participations = await prisma.participation.findMany({
            where: { tournamentId },
            include: { player: true },
            orderBy: { seed: "asc" },
        });

        const players = participations.map(p => p.player);

        if (players.length < 2) {
            return NextResponse.json({ matches: [], tournamentName: tournament.name });
        }

        const matches = [];
        for (let i = 0; i < players.length; i += 2) {
            const player1 = players[i];
            const player2 = players[i + 1];

            matches.push({
                id: i / 2 + 1,
                player1,
                player2,
            });
        }

        return NextResponse.json({
            tournamentName: tournament.name,
            matches,
            nbPlayers : players.length,
        });
    } catch (error) {
        console.error("Erreur serveur", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}