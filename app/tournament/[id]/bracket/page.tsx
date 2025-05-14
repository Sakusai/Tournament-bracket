"use client";

import React, { useEffect, useState } from "react";
import { Bracket } from "react-brackets";
import Navbar from "@/app/components/navbar";
import {Sidebar} from "@/app/components/sidebar";


export default function BracketPage({ params }: { params: { id: string } }) {
    const resolvedParams = React.use(params);
    const { id } = resolvedParams;

    const [rounds, setRounds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBracket = async () => {
            try {
                const res = await fetch(`/api/tournaments/${id}/players`);
                if (!res.ok) throw new Error("Server error while loading players");

                const data = await res.json();

                const adapted = generateBracket(data);
                setRounds(adapted);
            } catch (err: any) {
                console.error(err.message);
                setError(err.message || "Not possible to load bracket data");
            } finally {
                setLoading(false);
            }
        };

        fetchBracket();
    }, [id]);

    const handleMatchSelect = async (matchId: number, winnerIndex: number) => {
        try {
            const res = await fetch(`/api/tournaments/match/${matchId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ winnerIndex }),
            });

            if (!res.ok) throw new Error("Error updating match winner");

            const updatedMatch = await res.json();

            setRounds((prevRounds) =>
                prevRounds.map(round => ({
                    ...round,
                    seeds: round.seeds.map(seed => {
                        if (seed.id === matchId) {
                            return {
                                ...seed,
                                winner: winnerIndex,
                            };
                        }
                        return seed;
                    }),
                }))
            );
        } catch (err) {
            alert("Not possible to update the match");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-6">
                <p>Loading bracket...</p>
            </div>
        );
    }
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-900 text-white flex mt-16">
                <Sidebar id={id} />

                <main className="flex-1 p-6 bg-gray-900">
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

function generateBracket(players) {
    if (!Array.isArray(players)) {
        console.warn("This is not an array");
        return [];
    }

    const totalPlayers = players.length;


    if (totalPlayers < 2) {
        console.warn("Less than 2 players");
        return [];
    }

    let currentRound = [...players];
    const allRounds = [];
    let roundNumber = 1;
    let matchIdCounter = 1;

    while (currentRound.length >= 2) {
        const nextRound = [];
        const matches = [];

        for (let i = 0; i < currentRound.length; i += 2) {
            const player1 = currentRound[i];
            const player2 = currentRound[i + 1];

            matches.push({
                id: matchIdCounter++,
                teams: [
                    { name: player1?.nickname || "To determined" },
                    { name: player2?.nickname || "To determined" },
                ],
                winner: null,
            });

            nextRound.push(player1);
        }

        allRounds.push({
            title: `Round ${roundNumber++}`,
            seeds: matches,
        });

        currentRound = nextRound;
    }

    return allRounds;
}