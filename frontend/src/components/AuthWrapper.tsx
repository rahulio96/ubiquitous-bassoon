import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import type { User } from "../types/user";
import { apiFetch } from "../api";
import { API_URL } from "../config/env";
import type { Session } from "@supabase/supabase-js/dist/index.cjs";
import { AuthContext } from "../context/AuthContext";

function AuthWrapper({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);

    const fetchUserData = async () => {
        try {
        const data = await apiFetch(`${API_URL}/api/protected/user`);
        if (!data.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await data.json();
        setUser(userData);
        } catch (error) {
        console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (session) {
            fetchUserData();
        } else {
            setUser(null);
        }
    }, [session]);

    return (
        <AuthContext.Provider value={{ user, session }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthWrapper;