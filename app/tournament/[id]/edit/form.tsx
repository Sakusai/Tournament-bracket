"use client";

import React from "react";
import { useActionState } from "react";
import {update} from "@/app/tournament/[id]/edit/action";

interface Tournament {
    id: number;
    name: string;
    game: string;
    address: string | null;
    code: string | null;
    city: string | null;
    description: string | null;
    date: Date;
    logoUrl?: string | null;
}

export default function Form({ tournament }: { tournament: Tournament }) {
    const [state, formAction, pending] = useActionState(update, undefined);

    return (
        <form action={formAction} className="space-y-6 max-w-2xl mx-auto p-6">
            <input type="hidden" name="id" value={tournament.id} />

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                </label>
                <input
                    id="name"
                    name="name"
                    defaultValue={tournament.name}
                    placeholder="Tournoi"
                    className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                {state?.errors?.name && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.name}</p>
                )}
            </div>

            <div>
                <label htmlFor="game" className="block text-sm font-medium text-white mb-1">
                    Game
                </label>
                <select
                    name="game"
                    id="game"
                    defaultValue={tournament.game}
                    className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                    <option value="Super Smash Bros Ultimate">Super Smash Bros Ultimate</option>
                    <option value="Street Fighter 6">Street Fighter 6</option>
                    <option value="Tekken 8">Tekken 8</option>
                </select>
                {state?.errors?.game && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.game}</p>
                )}
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label htmlFor="address" className="block text-sm font-medium text-white mb-1">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        defaultValue={tournament.address || ""}
                        className="w-full border rounded p-2 bg-white text-black"
                        placeholder="2 rue le petit chat"
                    />
                </div>
                <div className="w-1/4">
                    <label htmlFor="code" className="block text-sm font-medium text-white mb-1">
                        Postal code
                    </label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        defaultValue={tournament.code || ""}
                        className="w-full border rounded p-2 bg-white text-black"
                        placeholder="51100"
                    />
                </div>
                <div className="w-1/3">
                    <label htmlFor="city" className="block text-sm font-medium text-white mb-1">
                        City
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        defaultValue={tournament.city || ""}
                        className="w-full border rounded p-2 bg-white text-black"
                        placeholder="Reims"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={tournament.description || ""}
                    className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Décrivez votre tournoi"
                ></textarea>
                {state?.errors?.description && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.description}</p>
                )}
            </div>

            <div>
                <label htmlFor="date" className="block text-sm font-medium text-white mb-1">
                    Date
                </label>
                <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    defaultValue={new Date(tournament.date).toISOString().slice(0, 16)}
                    className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                {state?.errors?.date && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.date}</p>
                )}
            </div>

            <div>
                <label htmlFor="logo" className="block text-sm font-medium text-white mb-1">
                    Logo
                </label>
                <input
                    type="file"
                    name="logo"
                    id="logo"
                    accept="image/*"
                    className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                {tournament.logoUrl && (
                    <div className="mt-2">
                        <img src={tournament.logoUrl} alt="Logo actuel" className="h-20 object-contain" />
                    </div>
                )}
                {state?.errors?.logo && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.logo}</p>
                )}
            </div>
            <button
                type="submit"
                disabled={pending}
                className="w-full py-2 px-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
                {pending ? "Updating..." : "Update"}
            </button>
        </form>
    );
}