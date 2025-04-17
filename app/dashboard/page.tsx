import { verifySession } from "@/app/_lib/session";

export default async function Dashboard() {
    const session = await verifySession()
    return (
        <label>Connected {session.userId}</label>
    )
}