import Navbar from "../components/Navbar.tsx";
import {supabase } from "../supabaseClient.ts";
import {ProfilePage} from "../components/ProfilePage.tsx";
import {useEffect, useState} from "react";
import {User} from "@supabase/supabase-js";
import AuthWrapper from "../components/AuthWrapper.tsx";


function Profile () {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        }
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    const ProfileContent = () => (
        <div className="min-h-screen bg-base-100">
            <Navbar />
            <ProfilePage />
        </div>
    );

    return user ? (
        <AuthWrapper user={user}>
            <ProfileContent />
        </AuthWrapper>
    ) : (
        <div className="min-h-screen bg-base-100">
            <Navbar />
            <div className="flex flex-col items-center justify-center py-10">
                <h1 className="text-2xl font-bold">Please log in to access the dashboard</h1>
                <a href="/login" className="btn btn-primary mt-4">Login</a>
            </div>
        </div>
    );
}

export default Profile;