'use client';

import {useActionState} from "react";
import {create} from "@/app/tournament/create/actions";

export function CreateForm() {
    const [state, action, pending] = useActionState(create, undefined);

    return (
        <form action={action} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">
                    Tournament name
                </label>
                <input
                    id="name"
                    name="name"
                    placeholder="Tournament"
                    className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                {state?.errors?.name && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.name}</p>
                )}
            </div>
            <div>
                <label htmlFor="game" className="block text-sm font-medium texttext-white">
                    Game
                </label>
                <select
                    name="game"
                    id="game"
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
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" className="w-full border rounded p-2" placeholder="2 rue le petit chat" />
                </div>
                <div className="w-1/4">
                    <label htmlFor="code">Postal Code</label>
                    <input type="text" id="code" name="code" className="w-full border rounded p-2" placeholder="51100"/>
                </div>
                <div className="w-1/3">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city" className="w-full border rounded p-2" placeholder="Reims"/>
                </div>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-white">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Describe your tournament"
                ></textarea>
                {state?.errors?.description && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.description}</p>
                )}
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-white">
                    Date
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                {state?.errors?.date && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.date}</p>
                )}
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-white">
                    Logo
                </label>
                <input
                    type="file"
                    name="logo"
                    accept="image/*"
                />
                {state?.errors?.date && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.date}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={pending}
                className="w-full py-2 px-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
                {pending ? "Creating..." : "Create"}
            </button>
        </form>
    );
}