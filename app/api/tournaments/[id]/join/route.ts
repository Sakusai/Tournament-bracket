import prisma from "@/lib/prisma";
import { verifySession } from "@/app/_lib/session";
import {NextRequest} from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    if (!id ) {
        return new Response(
            JSON.stringify({ error: "Missing or invalid tournament ID" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const tournamentId = parseInt(id);

    const session = await verifySession();
    if ( !session.userId) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    const userId = session.userId.toString();
    const body = await request.json();
    const { nickname } = body;
    if (!nickname ) {
        return new Response(
            JSON.stringify({ error: "Nickname is required and must be a string" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const id = parseInt(userId);
        let player = await prisma.player.findFirst({
            where: {userId: id},
        });

        if (!player) {
            player = await prisma.player.create({
                data: {
                    nickname: nickname,
                    userId: id,
                },
            });
        }

        const playerId = parseInt(player.id);
        const existingParticipation = await prisma.participation.findFirst({
            where: {
                playerId: playerId,
                tournamentId: tournamentId,
            },
        });

        if (existingParticipation) {
            return new Response(
                JSON.stringify({ error: "Already registered" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const participation = await prisma.participation.create({
            data: {
                playerId,
                tournamentId,
                seed: null,
            },
        });

        return new Response(
            JSON.stringify({ success: true, participation }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}