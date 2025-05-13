import Link from "next/link";
import React from "react";

export const Sidebar = ({ id }: { id: string }) =>
{
    const [tournament, setTournament] = React.useState<any>(null);
    const [userId, setUserId] = React.useState<string | null>(null);
    const [deleting, setDeleting] = React.useState(false);
    const [isRegistered, setIsRegistered] = React.useState(false);
    const [showForm, setShowForm] = React.useState(false);
    const [nickname, setNickname] = React.useState("");

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const tournamentRes = await fetch(`/api/tournaments/${id}`);
                const tournamentData = await tournamentRes.json();

                const sessionRes = await fetch("/api/session");
                const sessionData = await sessionRes.json();

                const participationRes = await fetch(`/api/tournaments/${id}/players`);
                const participationData = await participationRes.json();
                const registered = participationData.some(
                    (p: any) => p.userId === sessionData.userId
                );

                setTournament(tournamentData);
                setUserId(sessionData.userId || null);
                setIsRegistered(registered);
            } catch (error) {
                console.error("error loading", error);
            }
        };

        fetchData();
    }, [id]);
    const isOwner = userId && parseInt(userId) === tournament.createdById;

    const handleJoinClick = () => {
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/tournaments/${id}/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nickname }),
            });

            if (res.status === 401) {
                window.location.href = "/login";
                return;
            }
            if (res.ok) {
                setIsRegistered(true);
                setShowForm(false);
                alert("✅ Inscription réussie !");
            } else {
                const data = await res.json();
                alert(data.error || "Erreur lors de l'inscription.");
            }
        } catch (err) {
            alert("Erreur réseau");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure to delete this tournament ?")) return;

        setDeleting(true);

        try {
            const res = await fetch(`/api/tournaments/${id}`, {
                method: "DELETE",
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
    return(
        <aside className="w-64 bg-gray-800 p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6">Tournament</h2>
            <ul className="space-y-3">
                <li>
                    <Link
                        href={`/tournament/${id}`}
                        className="block py-2 px-4 rounded hover:bg-gray-700 transition"
                    >
                        Informations
                    </Link>
                </li>
                <li>
                    <Link
                        href={`/tournament/${id}/players`}
                        className="block py-2 px-4 rounded hover:bg-gray-700 transition"
                    >
                        Attendees
                    </Link>
                </li>
                <li>
                    <Link
                        href={`/tournament/${id}/bracket`}
                        className="block py-2 px-4 rounded hover:bg-gray-700 transition"
                    >
                        Bracket
                    </Link>
                </li>
            </ul>
            {!isRegistered && !showForm && (
                <button
                    onClick={handleJoinClick}
                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
                >
                    Register
                </button>
            )}

            {showForm && !isRegistered && (
                <form onSubmit={handleSubmit} className="mt-4 space-y-2 bg-gray-800 p-4 rounded">
                    <label htmlFor="nickname" className="block text-sm font-medium">
                        Choose your nickname
                    </label>
                    <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Your nickname"
                        required
                        className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
                    >
                        Confirm
                    </button>
                </form>
            )}
            {isOwner && (
                <div className="mt-8 space-y-3">
                    <Link
                        href={`/tournament/${tournament.id}/edit`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition w-full block text-center"
                    >
                        Edit
                    </Link>

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            )}
        </aside>
    )
}