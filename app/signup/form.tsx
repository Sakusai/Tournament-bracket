'use client'

import { signup } from '@/app/signup/actions'
import {useActionState} from "react";

export function SignupForm() {
    const [state, action, pending] = useActionState(signup, undefined)
    return (
        <form action={action} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {state?.errors?.name && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.name}</p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {state?.errors?.email && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.email}</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {state?.errors?.password && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.password}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={pending}
                className="w-full py-2 px-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
                {pending ? "Submitting..." : "Sign up"}
            </button>
        </form>
    )
}