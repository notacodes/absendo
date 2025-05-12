import { useEffect } from "react";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import { supabase } from "../supabaseClient.ts";
import ProfileComponent from "../components/ProfileComponent.tsx";

function Profile() {
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
    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />
            <ProfileComponent />
            <Footer />
        </div>
    );
}

export default Profile;
