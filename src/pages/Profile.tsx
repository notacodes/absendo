import Navbar from "../components/Navbar.tsx";
import {supabase } from "../supabaseClient.ts";
import {ProfilePage} from "../components/ProfilePage.tsx";
import Footer from "../components/Footer.tsx";
import {useEffect, useState} from "react";
import {User} from "@supabase/supabase-js";
import AuthWrapper from "../components/AuthWrapper.tsx";
import { UserProfileProvider } from "../contexts/UserProfileContext.tsx";


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
        <div className="min-h-screen bg-base-100 flex flex-col">
            <Navbar />
            <main className="flex-1">
                <ProfilePage />
            </main>
            <Footer />
        </div>
    );

    return user ? (
        <AuthWrapper user={user}>
            <UserProfileProvider user={user}>
                <ProfileContent />
            </UserProfileProvider>
        </AuthWrapper>
    ) : (
        <div className="min-h-screen bg-base-100 flex flex-col">
            <Navbar />
            <main className="flex flex-1 flex-col items-center justify-center py-10">
                <h1 className="text-2xl font-bold">Please log in to access the dashboard</h1>
                <a href="/login" className="btn btn-primary mt-4">Login</a>
            </main>
            <Footer />
        </div>
    );
}

export default Profile;
