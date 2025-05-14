
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {getLogoUrl, uploadImage} from "@/app/_lib/b2Client";
import {verifySession} from "@/app/_lib/session";


export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (isNaN(parseInt(id))) {
        return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 });
    }

    try {
        const tournament = await prisma.tournament.findUnique({
            where: { id: parseInt(id) },
        });

        if (!tournament) {
            return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
        }

        let logoUrl = null;
        if (tournament.logo) {
            logoUrl = await getLogoUrl(tournament.logo);
        }

        return NextResponse.json({ ...tournament, logoUrl }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch tournament", details: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await verifySession();
    if ("redirectTo" in session) {
        return NextResponse.redirect(session.redirectTo);
    }

    const { id } = await params;
    const { userId } = session;

    if (isNaN(parseInt(id))) {
        return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 });
    }

    try {
        const tournament = await prisma.tournament.findUnique({
            where: { id: parseInt(id) },
        });

        if (!tournament) {
            return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
        }

        if (parseInt(userId) !== tournament.createdById) {
            return NextResponse.json({ error: "Forbidden: You are not the owner" }, { status: 403 });
        }

        const formData = await req.formData();

        const name = formData.get("name")?.toString() || tournament.name;
        const game = formData.get("game")?.toString() || tournament.game;
        const address = formData.get("address")?.toString() || tournament.address;
        const code = formData.get("code")?.toString() || tournament.code;
        const city = formData.get("city")?.toString() || tournament.city;
        const description = formData.get("description")?.toString() || tournament.description;
        const dateStr = formData.get("date")?.toString();
        const date = dateStr ? new Date(dateStr) : tournament.date;

        const logoFile = formData.get("logo") as File | null;

        let logo = tournament.logo;
        if (logoFile && logoFile.size > 0) {
            logo = await uploadImage(logoFile);
        }

        const updatedTournament = await prisma.tournament.update({
            where: { id: parseInt(id) },
            data: {
                name,
                game,
                address,
                code,
                city,
                description,
                date,
                logo,
            },
        });

        return NextResponse.json(updatedTournament, { status: 200 });
    } catch (error: any) {
        console.error("Error updating tournament:", error);
        return NextResponse.json(
            { error: "Failed to update tournament", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await verifySession();
    if ("redirectTo" in session) {
        return NextResponse.redirect(session.redirectTo);
    }

    const { id } = await params;
    const tournamentId = parseInt(id, 10);

    if (isNaN(tournamentId)) {
        return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 });
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

        await prisma.tournament.delete({
            where: { id: tournamentId },
        });

        return NextResponse.json({ success: true, message: "Tournament deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting tournament:", error);
        return NextResponse.json(
            { error: "Failed to delete tournament", details: error.message },
            { status: 500 }
        );
    }
}