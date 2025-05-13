"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch("/api/session", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    setUserId(data.userId);
                } else {
                    setUserId(null);
                }
            } catch (error) {
                setUserId(null);
            }
        };

        checkSession();
    }, []);

    return (
        <nav className="fixed top-0 left-0 w-full bg-gray-800 p-4 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-gray-300 hover:text-white">
                    <div className="text-white font-bold text-xl">Brackement</div>
                </Link>

                <div className="flex items-center space-x-6">
                    {userId ? (
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/tournament/create"
                                passHref
                            >
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Add a tournament
                                </button>
                            </Link>
                            <Link
                                href={`/user/${userId}`}
                                className="text-white flex items-center gap-2 hover:text-gray-300"
                            >
                                <FaUserCircle size={30} />
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="text-sm text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;