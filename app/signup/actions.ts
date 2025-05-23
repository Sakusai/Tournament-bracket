'use server'

import { SignupFormSchema, FormState } from '@/app/_lib/definitions'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import {createSession} from "@/app/_lib/session";

export async function signup(state: FormState, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    const { name, email, password } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
        },
    })

    if (!user) {
        return {message: 'An error occurred while creating your account.'}
    }

    await createSession(user.id)
}