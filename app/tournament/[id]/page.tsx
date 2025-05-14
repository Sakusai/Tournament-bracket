"use client";

import React from "react";
import Navbar from "@/app/components/navbar";
import {Sidebar} from "@/app/components/sidebar";

export default function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    const { id } = resolvedParams;

    const [tournament, setTournament] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const tournamentRes = await fetch(`/api/tournaments/${id}`);
                const tournamentData = await tournamentRes.json();

                setTournament(tournamentData);
            } catch (error) {
                console.error("error loading", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-6">
                <h1 className="text-3xl font-bold mb-8">Next tournaments</h1>
                <p>Loading tournaments...</p>
            </div>
        );
    }

    if (!tournament) {
        return <div className="p-6 text-white">Nothing here</div>;
    }

    const formattedDate = new Date(tournament.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });



    return (
        <>
            <Navbar/>
        <div className="min-h-screen bg-gray-900 text-white flex mt-16">
            <Sidebar id={id}/>

            <main className="flex-1 p-6 max-w-4xl mx-auto">
                {tournament.logoUrl && (
                    <img
                        src={tournament.logoUrl}
                        alt={tournament.name}
                        className="w-full h-64 object-cover rounded-xl mb-6 shadow-md"
                    />
                )}

                <h1 className="text-4xl font-bold mb-4">{tournament.name}</h1>
                <p className="text-xl text-gray-300 mb-2">Jeu : {tournament.game}</p>
                <p className="text-gray-500 mb-4">Date : {formattedDate}</p>
                <p className="text-gray-300 mb-6">{tournament.description}</p>

                <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-lg">Adresse</h3>
                    <p className="text-gray-400">
                        {tournament.address}, {tournament.city}
                    </p>
                </div>
            </main>
        </div>
        </>

    );
}