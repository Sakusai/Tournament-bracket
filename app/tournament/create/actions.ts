'use server';

import { CreateTournamentFormSchema, FormState } from "@/app/_lib/definitions";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {verifySession} from "@/app/_lib/session";

export async function create(
    state: FormState,
    formData: FormData,
): Promise<FormState> {
    const validatedFields = CreateTournamentFormSchema.safeParse({
        name: formData.get('name'),
        game: formData.get('game'),
        address: formData.get('address'),
        code: formData.get('code'),
        city: formData.get('city'),
        description: formData.get('description'),
        date: formData.get('date'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const session = await verifySession();
    if (!session.userId) {
        return { errors: { general: ["Not authenticated"] } };
    }
    formData.append("createdById", session.userId);
    const body = new FormData();
    for (const [key, value] of formData.entries()) {
        if (value) body.append(key, value);
    }
    try {
        const host = (await headers()).get("host");
        const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

        const response = await fetch(`${protocol}://${host}/api/tournaments`, {
            method: 'POST',
            body,
        });

        if (!response.ok) {
            const error = await response.json();
            return {
                errors: { general: [error.error || "Failed to create tournament."] },
            };
        }

        return { errors: {} };
    } catch (error) {
        return {
            errors: { general: ["An unexpected error occurred."] },
        };
    }
    redirect('/');
}
