'use client';

import {logout} from "@/app/logout/actions";
import {useEffect} from "react";
import {redirect} from "next/navigation";
export default function Page() {
    useEffect(() => {
        const doLogout = async () => {
            await logout(); // appel de ta fonction d'action
            redirect('/login'); // redirige vers la page login
        };

        doLogout();
    }, []);
    return <p>Déconnexion en cours...</p>;
}