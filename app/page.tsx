"use client";

import React, { useState, useEffect } from "react";
import TournamentCard from "@/app/components/tournamentCard";
import Navbar from "@/app/components/navbar";

export default function TournamentsContent() {
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [filteredTournaments, setFilteredTournaments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const tournamentsPerPage = 6;

    useEffect(() => {
        const loadTournaments = async () => {
            try {
                const res = await fetch("/api/tournaments");
                if (!res.ok) throw new Error("Erreur lors du chargement");

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

    useEffect(() => {
        const filtered = tournaments.filter((tournament) =>
            tournament.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tournament.game?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tournament.city?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTournaments(filtered);
        setPage(1);
    }, [searchTerm, tournaments]);

    // Pagination
    const totalPages = Math.ceil(filteredTournaments.length / tournamentsPerPage);
    const paginatedTournaments = filteredTournaments.slice(
        (page - 1) * tournamentsPerPage,
        page * tournamentsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
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
        <>
            <Navbar/>
            <div className="min-h-screen bg-gray-900 text-white p-6 mt-16">
                <h1 className="text-3xl font-bold mb-8">Next tournaments</h1>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, game or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {paginatedTournaments.length === 0 ? (
                    <p className="text-gray-400">Nothing found.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedTournaments.map((tournament: any) => (
                                <TournamentCard key={tournament.id} tournament={tournament} />
                            ))}
                        </div>

                        <div className="flex justify-center items-center space-x-4 mt-8">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-gray-300">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}