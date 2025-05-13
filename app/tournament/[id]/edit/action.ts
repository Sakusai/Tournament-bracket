import { redirect } from "next/navigation";
import { z } from "zod";
import {tournamentSchema} from "@/app/_lib/definitions";

export type State =
    | { errors?: Partial<Record<keyof z.infer<typeof tournamentSchema>, string>> }
    | undefined;

export async function getTournament(id: string) {
    const res = await fetch(`http://localhost:3000/api/tournaments/${id}`);
    if (!res.ok) return null;
    return res.json();
}

export async function update(prevState: State, formData: FormData) {
    const validatedFields = tournamentSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return { errors };
    }

    const data = validatedFields.data;

    try {
        const response = await fetch(`/api/tournaments/${data.id}`, {
            method: "PATCH",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la mise à jour");
        }

    } catch (e: any) {
        console.error(e);
        return { errors: { _form: e.message } };
    }
    redirect(`/tournament/${data.id}`);
}