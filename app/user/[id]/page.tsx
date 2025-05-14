"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar";

export default function ProfilePage() {
    const [user, setUser] = useState<{
        id: number;
        name: string;
        email: string;
        createdTournaments: { id: number; name: string }[];
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const sessionRes = await fetch("/api/session");

                if (!sessionRes.ok) {
                    window.location.href = "/login";
                    return;
                }

                let sessionData;
                try {
                    sessionData = await sessionRes.json();
                } catch (error) {
                    console.error("non JSON  /api/session");
                    window.location.href = "/login";
                    return;
                }

                if (!sessionData.userId) {
                    window.location.href = "/login";
                    return;
                }

                const userId = sessionData.userId;

                const userRes = await fetch(`/api/user/${userId}`);

                if (!userRes.ok) {
                    throw new Error("Error in loading");
                }

                let userData;
                try {
                    userData = await userRes.json();
                } catch (error) {
                    console.error("non JSON  /api/user/[id]");
                    throw new Error("Error server");
                }

                const tournamentRes = await fetch(`/api/user/${userId}/tournaments`);

                let tournamentsData = { tournaments: [] };
                if (tournamentRes.ok) {
                    try {
                        tournamentsData = await tournamentRes.json();
                    } catch (e) {
                        console.error("non JSON /api/user/[id]/tournaments");
                    }
                }

                setUser({
                    ...userData.user,
                    createdTournaments: tournamentsData.tournaments || [],
                });

                setNewName(userData.user.name);
            } catch (error) {
                console.error("Error in fetchProfile", error);
                setError("Not possible to acces profil");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdateName = async () => {
        if (!newName.trim()) return;

        try {
            const sessionRes = await fetch("/api/session");
            const sessionData = await sessionRes.json();

            const userId = sessionData.userId;

            const res = await fetch(`/api/user/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newName }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: "server error" }));
                alert(errorData.error || "Error in updating");
                return;
            }

            setUser((prev) => (prev ? { ...prev, name: newName } : prev));
            setEditingName(false);
            alert("Update name !");
        } catch (err) {
            alert("Network error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-6">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-6 mt-16">
                <Navbar />
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-6 mt-16">
                <Navbar />
                <p>Nothing here</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-900 text-white p-6 mt-16">
                <h1 className="text-3xl font-bold mb-6">Profil</h1>

                <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400">Nom</label>
                        {editingName ? (
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white w-full"
                                />
                                <button
                                    onClick={handleUpdateName}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingName(false)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-lg">{user.name}</span>
                                <button
                                    onClick={() => setEditingName(true)}
                                    className="text-indigo-400 hover:text-indigo-300 text-sm"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400">Email</label>
                        <span className="text-lg block mt-1">{user.email}</span>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Your tournaments</h2>
                    {user.createdTournaments.length === 0 && (
                        <p className="text-gray-400">You don't have tournaments</p>
                    )}
                    <ul className="space-y-2">
                        {user.createdTournaments.map((tournament) => (
                            <li key={tournament.id} className="bg-gray-700 p-3 rounded flex justify-between">
                                <span>{tournament.name}</span>
                                <a href={`/tournaments/${tournament.id}`} className="text-indigo-400 hover:text-indigo-300 text-sm">
                                    Details
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}