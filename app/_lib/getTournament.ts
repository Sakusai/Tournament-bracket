import {headers} from "next/headers";

export const getTournaments = async () => {
    const host = (await headers()).get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const res = await fetch(`${protocol}://${host}/api/tournaments`, {
        method: 'GET',
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Erreur lors du chargement des tournois");

    return res.json();
};