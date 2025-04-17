import 'server-only'
import { SignJWT, jwtVerify} from "jose";
import { cookies } from 'next/headers';
import {redirect} from "next/navigation";


const key = new TextEncoder().encode(process.env.SESSION_SECRET)

const cookie = {
    name: 'session',
    options: {httpOnly: true, secure: true, sameSite: 'lax', path: '/'},
    duration: 24 * 60 * 60 * 1000
}
export async function encrypt(payload){
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('1day')
        .sign(key)
}

export async function decrypt(session) {
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        return null
    }
}
export async function createSession(userId: string) {
    const expires = new Date(Date.now() + cookie.duration);
    const session = await encrypt({userId, expires});

    (await cookies()).set(cookie.name as any, session as any, {...cookie.options, expires} as any)
    console.log((await cookies()).getAll())
    redirect('/dashboard')
}
export async function verifySession() {
    const cookieL = (await cookies()).get(cookie.name as any)?.value
    const session = await decrypt(cookieL)

    if(!session?.userId) {
        redirect('/login')
    }

    return { userId: session.userId }
}
export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session' as any)
}