import {useEffect, useState} from "react";
import {User} from "@supabase/supabase-js";
import {supabase} from "../supabaseClient.ts";

export const ProfilePage = () => {
    interface UserProfile {
        id: string;
        first_name: string;
        last_name: string;
        birthday: string;
        first_name_trainer: string;
        last_name_trainer: string;
    }

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfile | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser();
                if (error) throw error;
                setUser(user);
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchUserData() {
            if (user) {
                try {
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", user.id)
                        .single();

                    if (error) throw error;
                    setUserData(data);
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            }
        }
        fetchUserData();
    }, [user]);

    function getUserShortName() {
        if (!userData) return "NN";
        const first = userData.first_name?.charAt(0).toUpperCase() || "";
        const last = userData.last_name?.charAt(0).toUpperCase() || "";
        return `${first}${last}`;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (!userData) {
        return <div className="text-center text-red-500 mt-10">Benutzerdaten konnten nicht geladen werden.</div>;
    }

    return(
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
                <div className="avatar">
                    <div className="w-24 rounded-full bg-primary text-primary-content grid place-items-center text-xl font-bold">
                        <div className="flex items-center justify-center w-full h-full">{getUserShortName()}</div>
                    </div>
                </div>
                <h2 className="card-title mt-4">{userData.first_name} {userData.last_name}</h2>
                <p className="text-sm text-gray-500">{userData.birthday}</p>
                <p className="text-sm text-gray-500">{userData.first_name_trainer} {userData.last_name_trainer}</p>
            </div>
        </div>
    )
}