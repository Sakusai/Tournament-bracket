'use client'

import { signup } from '@/app/signup/actions'
import {useActionState} from "react";

export function SignupForm() {
    const [state, action, pending] = useActionState(signup, undefined)
    return (
        <form action={action}>
            <input name="name"/>
            {state?.errors?.name && <p>{state.errors.name}</p>}
            <input name="email"/>
            {state?.errors?.email && <p>{state.errors.email}</p>}
            <input name="password"/>
            {state?.errors?.password && <p>{state.errors.password}</p>}
            <button disabled={pending}>
                {pending ? 'Submitting...' : 'Sign up'}
            </button>
        </form>
    )
}