import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.tsx";
import DashboardHeader from "../components/DashboardHeader.tsx";
import DashboardLastAbsences from "../components/DashboardContent.tsx";
import AuthWrapper from "../components/AuthWrapper.tsx";
import { supabase } from "../supabaseClient.ts";
import {User} from "@supabase/supabase-js";
import { UserProfileProvider } from "../contexts/UserProfileContext.tsx";

function Dashboard() {
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

    useEffect(() => {
        const checkLogin = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('onboarding_completed')
                    .eq('id', user?.id)
                    .single();

                if (!data?.onboarding_completed && window.location.pathname !== "/welcome") {
                    console.log("User is not onboarded");
                    window.location.href = "/welcome";
                }
            }
        };

        checkLogin();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    const DashboardContent = () => (
        <div className="min-h-screen bg-base-100">
            <Navbar />
            <DashboardHeader />
            <DashboardLastAbsences />
        </div>
    );

    return user ? (
        <AuthWrapper user={user}>
            <UserProfileProvider user={user}>
                <DashboardContent />
            </UserProfileProvider>
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

export default Dashboard;
