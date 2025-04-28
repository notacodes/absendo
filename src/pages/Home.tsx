import { useEffect } from "react";
import Navbar from "../components/Navbar.tsx";
import Hero from "../components/Hero.tsx";
import Features from "../components/Features.tsx";
import Footer from "../components/Footer.tsx";
import { supabase } from "../supabaseClient.ts";

function Home() {
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
    useEffect(() => {
        async function getSessionAfterRedirect() {
            console.log("Checke Session nach Redirect...");
            const { data, error } = await supabase.auth.getSession();
            console.log('Session Result:', { data, error });
            if (data.session) {
                console.log('User ist eingeloggt!', data.session.user);
            } else {
                console.log('Keine aktive Session gefunden.');
            }
        }
        getSessionAfterRedirect();
    }, []);

    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />
            <Hero />
            <Features />
            <Footer />
        </div>
    );
}

export default Home;
