import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const tournamentId = parseInt(id);

    try {
        const tournament = await prisma.tournament.findUnique({
            where: { id: tournamentId },
        });

        const players = await prisma.match.findMany({
            where: { tournamentId },
            include: {
                player1: true,
                player2: true,
                winner: true,
            },
            orderBy: [
                { round: "asc" },
                { bracketPosition: "asc" },
            ],
        });

        return NextResponse.json({
            tournamentName: tournament.name,
            matches: players.map(m => ({
                ...m,
                teams: [
                    m.player1 ? { name: m.player1.nickname } : { name: "À déterminer" },
                    m.player2 ? { name: m.player2.nickname } : { name: "À déterminer" },
                ],
                winner: m.winnerId
                    ? m.winnerId === m.player1Id
                        ? 0
                        : 1
                    : null,
            })),
        });
    } catch (error) {
        console.error("Erreur serveur", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}