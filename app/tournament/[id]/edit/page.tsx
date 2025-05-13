import Form from "./form";
import {getTournament} from "@/app/tournament/[id]/edit/action";
import Navbar from "@/app/components/navbar";

export default async function EditTournamentPage({params,}: { params: Promise<{ id: string }>; })
{
    const resolvedParams = await params;
    const tournament = await getTournament(resolvedParams.id);

    if (!tournament) {
        throw new Error("Tournoi non trouvé");
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />
            <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16">
                <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                        Add a tournament
                    </h1>
                    <Form tournament={tournament} />
                </div>
            </main>
        </div>
    );
}