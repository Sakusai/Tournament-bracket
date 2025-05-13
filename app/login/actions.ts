'use server';

import prisma from '@/lib/prisma'
import {
    FormState,
    LoginFormSchema,
} from '@/app/_lib/definitions';
import { createSession } from '@/app/_lib/session';
import bcrypt from 'bcrypt';

export async function login(
    state: FormState,
    formData: FormData,
): Promise<FormState> {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });
    const errorMessage = { message: 'Invalid login credentials.' };

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const user = await prisma.user.findFirst({
        where: {
            email: validatedFields.data.email
        }
    });

    if (!user) {
        return errorMessage;
    }

    const passwordMatch = await bcrypt.compare(
        validatedFields.data.password,
        user.password,
    );

    if (!passwordMatch) {
        return errorMessage;
    }

    const userId = user.id.toString();
    await createSession(userId);
}