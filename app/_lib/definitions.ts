import { z } from 'zod'

export const SignupFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
        })
        .trim(),
})

export const LoginFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z.string().trim(),
})

export const CreateTournamentFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .trim(),
    game: z.string().trim(),
    address: z
        .string()
        .min(5, { message: "Address must be at least 5 characters long." })
        .trim(),
    code: z
        .string()
        .length(5, { message: "Code postal must be exactly 5 digits." })
        .regex(/^\d+$/, { message: "Code postal must be numeric." }),
    city: z
        .string()
        .min(2, { message: "City must be at least 2 characters long." })
        .trim(),
    description: z
        .string()
        .max(1000, { message: "Description must be under 1000 characters." })
        .optional()
        .or(z.literal("")),
    date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format.",
        }),
    logo: z.any().optional(),
});

export const tournamentSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Le nom est requis"),
    game: z.string().min(1, "Le jeu est requis"),
    address: z.string().optional(),
    code: z.string().optional(),
    city: z.string().optional(),
    description: z.string().optional(),
    logo: z.any().optional(),
});

export type FormState =
    | {
    errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
    }
    message?: string
}
    | undefined