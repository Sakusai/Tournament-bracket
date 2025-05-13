import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import {getLogoUrl, uploadImage} from "@/app/_lib/b2Client";


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const fields = Object.fromEntries(formData.entries()) as {
            name;
            game;
            description;
            date;
            logo;
            address;
            code;
            city;
            createdById;
        };
        const logo = await uploadImage(fields.logo);
        const newTournament = await prisma.tournament.create({
            data: {
                name: fields.name,
                game: fields.game,
                description: fields.description,
                logo: logo || undefined,
                date: new Date(fields.date),
                address: fields.address,
                code: fields.code,
                city: fields.city,
                createdById: parseInt(fields.createdById),
            },
        });

        return NextResponse.json(newTournament, { status: 201 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Error creating tournament", details: error.message }, { status: 500 });
    }
}
export async function GET(req: NextRequest) {
    try {
        const tournaments = await prisma.tournament.findMany();

        const tournamentsWithLogoUrls = await Promise.all(
            tournaments.map(async (tournament) => {
                let logoUrl = null;
                if (tournament.logo) {
                    logoUrl = await getLogoUrl(tournament.logo);
                }
                return {
                    ...tournament,
                    logoUrl,
                };
            })
        );

        return NextResponse.json(tournamentsWithLogoUrls, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch tournaments", details: error.message }, { status: 500 });
    }
}
