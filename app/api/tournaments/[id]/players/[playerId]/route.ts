import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySession } from "@/app/_lib/session";

export async function DELETE(req: NextRequest, {params,}: { params: Promise<{ id: string; playerId: string }>; })
{
    const session = await verifySession();
    if ("redirectTo" in session) {
        return NextResponse.redirect(session.redirectTo);
    }

    const { id, playerId } = await params;
    const tournamentId = parseInt(id);
    const playerIdInt = parseInt(playerId);

    if (isNaN(tournamentId) || isNaN(playerIdInt)) {
        return NextResponse.json({ error: "Invalid tournament or player ID" }, { status: 400 });
    }

    try {
        const tournament = await prisma.tournament.findUnique({
            where: { id: tournamentId },
        });

        if (!tournament) {
            return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
        }

        if (parseInt(session.userId) !== tournament.createdById) {
            return NextResponse.json({ error: "Forbidden: You are not the owner" }, { status: 403 });
        }
        await prisma.participation.delete({
            where: {
                playerId_tournamentId: {
                    playerId: playerIdInt,
                    tournamentId: tournamentId,
                },
            },
        });
        console.log("test");
        return NextResponse.json(
            { success: true, message: "Player removed successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.log(error);
        console.error("Error removing player:", error);
        return NextResponse.json(
            { error: "Failed to remove player", details: error.message },
            { status: 500 }
        );
    }
}