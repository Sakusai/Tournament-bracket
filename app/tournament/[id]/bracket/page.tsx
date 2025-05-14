"use client";

import React, { useEffect, useState } from "react";
import { Bracket } from "react-brackets";
import Navbar from "@/app/components/navbar";
import { Sidebar } from "@/app/components/sidebar";

export default function BracketPage({ params }: { params: { id: string } }) {
    const resolvedParams = React.use(params);
    const { id } = resolvedParams;
    const [rounds, setRounds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tournamentName, setTournamentName] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBracket = async () => {
            try {

                const res = await fetch(`/api/tournaments/${id}/bracket`);
                if (!res.ok) throw new Error("Error loading");

                const data = await res.json();

                const players = data.players || [];
                const existingMatches = data.matches || [];
                if (players.length > 0 && existingMatches.length === 0) {
                    const generateRes = await fetch(`/api/tournaments/${id}/matchs`, {
                        method: "POST",
                    });

                    if (!generateRes.ok) {
                        const errorData = await generateRes.json();
                        throw new Error(errorData.error || "Generation error");
                    }

                    const updatedRes = await fetch(`/api/tournaments/${id}/bracket`);
                    const updatedData = await updatedRes.json();
                    setRounds(generateBracket(updatedData.matches));
                } else {
                    setRounds(generateBracket(data.matches));
                }
            } catch (err) {
                setError(err.message || "Impossible de charger le bracket");
            } finally {
                setLoading(false);
            }
        };

        fetchBracket();
    }, [id]);

    if (loading) {
        return (
            <div className="p-6 min-h-screen bg-gray-900 text-white">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 min-h-screen bg-gray-900 text-white mt-16">
                ❌ Error : {error}
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-900 text-white flex mt-16">
                <Sidebar id={id} />
                <main className="p-6 min-h-screen bg-gray-900 text-white mt-16 w-full">
                    <h1 className="text-3xl font-bold mb-8">Bracket</h1>

                    <div className="overflow-x-auto pb-4">
                        <Bracket
                            rounds={rounds}
                            mobileBreakpoint={768}
                            theme={{
                                activeColor: "#6366f1",
                                backgroundColor: "#1e293b",
                                textColor: "#fff",
                                fontFamily: "sans-serif",
                            }}
                        />
                    </div>
                </main>
            </div>
        </>
    );
}

function generateBracket(matches) {
    if (!Array.isArray(matches)) return [];

    const groupedByRound = matches.reduce((acc, match) => {
        const key = match.round;
        if (!acc[key]) acc[key] = [];

        acc[key].push({
            ...match,
            teams: [
                { name: match.player1?.nickname || "À déterminer" },
                { name: match.player2?.nickname || "À déterminer" },
            ],
            winner: match.winnerId
                ? match.winnerId === match.player1Id
                    ? 0
                    : 1
                : null,
        });

        return acc;
    }, {});

    const rounds = Object.entries(groupedByRound).map(([roundNumber, matchesInRound]) => ({
        title: `Round ${roundNumber}`,
        seeds: matchesInRound,
    }));

    return rounds;
}