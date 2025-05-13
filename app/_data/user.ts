import {verifySession} from "@/app/_lib/session";
import prisma from '@/lib/prisma'
import { cache } from 'react'
import {taintUniqueValue} from "next/dist/server/app-render/rsc/taint";

export const getUser = cache(async () => {
    const session = await verifySession()

    const user =  await prisma.user.findUnique({
        where: {
            id: session.userId
        }
    })
    return userDTO(user)
})

function userDTO(user) {
    taintUniqueValue(
        'Do not pass a user session token to the client.',
        user,
        user.session.token,
    )
    return {
        name: user.name,
        email: user.email,
        session: user.session,
        auditTrail: canViewAudit(user.auditTrail, user.roles),
    }
}

function canViewAudit(auditTrail, roles) {
    return roles === 'ROLE_ADMIN' ? auditTrail : null
}