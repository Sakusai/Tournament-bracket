'use client';

import {logout} from "@/app/logout/actions";
import {useEffect} from "react";
import {redirect} from "next/navigation";
export default function Page() {
    useEffect(() => {
        const doLogout = async () => {
            await logout();
            redirect('/login');
        };

        doLogout();
    }, []);
    return <p className="min-h-screen bg-gray-900 text-white p-6"></p>;
}