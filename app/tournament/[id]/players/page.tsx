"use client";

import Navbar from "@/app/components/navbar";
import React, { useEffect, useState } from "react";
import { Sidebar } from "@/app/components/sidebar";
import { getTournament } from "@/app/tournament/[id]/edit/action";

interface Player {
    id: number;
    nickname: string;
    userId: number | null;
}

export default function Players({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    const { id } = resolvedParams;

    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = React.useState<string | null>(null);
    const [tournament, setTournament] = useState<{ createdById: number } | null>(null);
    const [deleting, setDeleting] = React.useState(false);

    const [page, setPage] = useState(1);
    const limit = 10;

    const [nickname, setNickname] = useState("");
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sessionRes = await fetch("/api/session");
                const sessionData = await sessionRes.json();

                const playersRes = await fetch(`/api/tournaments/${id}/players`);
                if (!playersRes.ok) throw new Error("Error on loading players");

                const playersData = await playersRes.json();
                setPlayers(playersData);
                setUserId(sessionData.userId || null);

                const tournamentData = await getTournament(id);
                setTournament(tournamentData);
            } catch (err: any) {
                setError(err.message || "Not possible to load players");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const isOwner = userId && tournament?.createdById && parseInt(userId) === tournament.createdById;

    const handleAddPlayer = async () => {
        if (!nickname.trim()) return;

        setAdding(true);
        try {
            const res = await fetch(`/api/tournaments/${id}/players`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nickname }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert(errorData.error || "Erreur lors de l'ajout");
                return;
            }

            const newPlayer = await res.json();
            setPlayers((prev) => [...prev, newPlayer]);
            setNickname("");
        } catch (err) {
            alert("Erreur réseau");
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (playerId: number) => {
        if (!confirm("Are you sure to delete this tournament ?")) return;

        setDeleting(true);

        try {
            const res = await fetch(`/api/tournaments/${id}/players`, {
                method: "DELETE",
                body: JSON.stringify({ playerId: playerId}),
            });

            if (res.ok) {
                window.location.href = "/";
            } else {
                alert("Error");
            }
        } catch (error) {
            alert("Is not possible to delete this tournament");
        } finally {
            setDeleting(false);
        }
    };
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error : {error}</div>;

    const total = players.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedPlayers = players.slice((page - 1) * limit, page * limit);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />
            <div className="min-h-screen bg-gray-900 text-white flex mt-16">
                <Sidebar id={id} />

                <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
                        <h1 className="text-3xl font-bold mb-6">Registered players</h1>

                    {isOwner && (
                        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                            <h2 className="text-lg font-medium mb-2">Add a player</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="Pseudo du joueur"
                                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none"
                                />
                                <button
                                    onClick={handleAddPlayer}
                                    disabled={adding || !nickname.trim()}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                                >
                                    {adding ? "Adding..." : "Add"}
                                </button>
                            </div>
                        </div>
                    )}

                    <ul className="bg-gray-800 border border-gray-700 rounded-lg divide-y divide-gray-700">
                        {paginatedPlayers.map((player) => (
                            <li key={player.id} className="p-4 hover:bg-gray-700 transition flex items-center justify-between">
                                <span>{player.nickname}</span>
                                <button
                                    onClick={() => handleDelete(player.id)}
                                    disabled={deleting}
                                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-2 py-1 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deleting ? "Suppression..." : "Supprimer"}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex justify-between items-center">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span>
                            Page {page} over {totalPages}
                        </span>

                        <button
                            onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}