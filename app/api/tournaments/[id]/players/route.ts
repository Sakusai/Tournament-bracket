import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const tournamentId = parseInt(id, 10);

    try {
        const players = await prisma.participation.findMany({
            where: {
                tournamentId,
            },
            include: {
                player: true,
            },
        });

        const data = players.map(p => ({
            id: p.player.id,
            nickname: p.player.nickname,
            userId: p.player.userId,
        }));

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des joueurs", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
        return new Response(JSON.stringify({ error: "Invalid tournament ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const tournamentId = parseInt(id);

    let body;
    try {
        body = await request.json();
    } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { nickname } = body;

    if (!nickname || typeof nickname !== "string") {
        return new Response(JSON.stringify({ error: "Nickname is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const newPlayer = await prisma.player.create({
            data: {
                nickname: nickname,
                userId: null,
            },
        });
        const newPlayerId = parseInt(newPlayer.id);
        await prisma.participation.create({
            data: {
                playerId: newPlayerId,
                tournamentId: tournamentId,
                seed: null,
            },
        });

        return new Response(JSON.stringify(newPlayer), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Erreur serveur", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id ) {
        return new Response(JSON.stringify({ error: "Invalid tournament ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const tournamentId = parseInt(id);

    let body;
    try {
        body = await request.json();
    } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { playerId } = body;
    const playerIdInt = parseInt(playerId);
    if (!playerIdInt) {
        return new Response(JSON.stringify({ error: "Player ID is required and must be a number" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        console.log({playerIdInt, tournamentId});
        await prisma.participation.delete({
            where: {
                playerId: playerIdInt,
                tournamentId: tournamentId,
            }
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Erreur lors de la suppression", error);
        return new Response(JSON.stringify({ error: "Impossible de supprimer ce joueur" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}