import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const tournamentId = parseInt(id);

    try {
        const participations = await prisma.participation.findMany({
            where: { tournamentId },
            include: {
                player: true,
            },
            orderBy: { seed: "asc" },
        });

        const players = participations.map(p => p.player);

        if (players.length < 2) {
            return NextResponse.json(
                { error: "Less than 2 players" },
                { status: 400 }
            );
        }

        await prisma.match.deleteMany({
            where: { tournamentId },
        });

        let currentRound = [...players];
        let roundNumber = 1;

        while (currentRound.length >= 2) {
            const nextRound = [];
            const matchesToCreate = [];

            for (let i = 0; i < currentRound.length; i += 2) {
                const player1 = currentRound[i];
                const player2 = currentRound[i + 1];

                matchesToCreate.push({
                    data: {
                        tournamentId,
                        player1Id: player1.id,
                        player2Id: player2?.id ?? null,
                        round: roundNumber,
                        bracketPosition: i / 2,
                    },
                });

                nextRound.push({ id: player1.id });

            }

            await prisma.match.createMany({
                data: matchesToCreate.map(m => m.data),
            });

            currentRound = nextRound;
            roundNumber++;
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Erreur serveur", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}