import React from "react";
import Link from "next/link";

interface Tournament {
    id: number;
    name: string;
    game: string;
    description: string;
    date: string;
    address: string;
    city: string;
    logoUrl: string | null;
}

export default function TournamentCard({ tournament }: { tournament: Tournament }) {
    const formattedDate = new Date(tournament.date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-md overflow-hidden transition hover:shadow-indigo-500/20 hover:border-indigo-500 flex">
            {/* Logo à gauche */}
            {tournament.logoUrl && (
                <img
                    src={tournament.logoUrl}
                    alt={tournament.name}
                    className="w-24 h-24 object-cover" // Taille fixe pour un carré
                />
            )}

            {/* Contenu à droite */}
            <div className="p-5 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-semibold">{tournament.name}</h2>
                    <p className="text-gray-400">{tournament.game}</p>
                    <p className="mt-2 text-sm text-gray-500">{formattedDate}</p>
                    <p className="mt-2 text-gray-300 line-clamp-2">{tournament.description}</p>
                </div>

                <div className="mt-4 text-sm text-gray-400">
                    {tournament.address}, {tournament.city}
                </div>

                <Link
                    href={`/tournament/${tournament.id}`}
                    className="mt-4 inline-block text-indigo-400 hover:text-indigo-300"
                >
                    More info
                </Link>
            </div>
        </div>
    );
}