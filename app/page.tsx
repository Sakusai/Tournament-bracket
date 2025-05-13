"use client";

import React, { useState, useEffect } from "react";
import TournamentCard from "@/app/components/tournamentCard";
import Navbar from "@/app/components/navbar";

export default function TournamentsPage() {
    return (
        <>
            <Navbar />
            <TournamentsContent />
        </>
    );
}

function TournamentsContent() {
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTournaments, setFilteredTournaments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTournaments = async () => {
            try {
                const res = await fetch("/api/tournaments");
                if (!res.ok)
                    throw new Error("Erreur lors du chargement");

                const data = await res.json();
                const upcoming = data.filter(
                    (t: any) => new Date(t.date) > new Date()
                );

                setTournaments(upcoming);
                setFilteredTournaments(upcoming);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadTournaments();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = tournaments.filter((tournament) =>
            tournament.name?.toLowerCase().includes(term) ||
            tournament.game?.toLowerCase().includes(term) ||
            tournament.city?.toLowerCase().includes(term)
        );

        setFilteredTournaments(filtered);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-6 mt-16">
                <h1 className="text-3xl font-bold mb-8">Next tournaments</h1>
                <p>Loading tournaments...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-8">Next tournaments</h1>

            {/* Barre de recherche */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name, game or city..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {filteredTournaments.length === 0 ? (
                <p className="text-gray-400">Nothing found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTournaments.map((tournament: any) => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                    ))}
                </div>
            )}
        </div>
    );
}