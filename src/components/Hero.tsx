import {useEffect, useState} from "react";
import {useIsUserLoggedIn} from "../supabaseClient.ts";

function Hero() {
    const [userCount, setUserCount] = useState(undefined);
    const [error, setError] = useState(false);
    const isUserLoggedIn = useIsUserLoggedIn();
    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await fetch("https://api.absendo.app/stats/user-count");
                if(response) {
                    const { userCount } = await response.json();
                    setUserCount(userCount);
                }
            } catch (err) {
                console.error('Error fetching user count:', err);
                setError(true);
            }
        };
        fetchUserCount();
    }, []);

    return (
        <div className="hero min-h-[60vh] bg-base-100">
            <div className="hero-content text-center">
                <div>
                    {userCount !== undefined && !error &&(
                        <div className="badge badge-info gap-2 px-4 py-3 rounded-full badge-md font-medium mb-8 animate-pulse text-xs md:text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Absendo wird bereits von {userCount} Schüler*innen genutzt
                        </div>

                    )}
                    <h1 className="text-4xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-primary via-blue-500 to-blue-300 bg-clip-text text-transparent">
                        BBZW Absenzformulare
                        <span className="block bg-clip-text bg-gradient-to-r">
                            in 30 Sekunden
                        </span>
                    </h1>
                    <p className="py-4 md:text-xl text-m max-w-3xl">
                        Absenz einreichen, ohne Stress! Generiere deine Absenzformulare automatisch
                        aus deinem Schulnetz-Kalender und spare dir <strong className="text-gray-900">bis zu 5 Minuten pro Formular</strong>
                    </p>
                    <button
                        className="btn btn-success btn-lg mr-4 mt-4 shadow-md hover:shadow-xl transform hover:scale-105 transition-all"
                        onClick={() => {
                            if (!isUserLoggedIn) {
                                window.location.href = "/signup";
                            } else {
                                window.location.href = "/dashboard";
                            }
                        }}
                    >
                        Jetzt kostenlos nutzen
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="lucide lucide-arrow-right-icon lucide-arrow-right">
                            <path d="M5 12h14"/>
                            <path d="m12 5 7 7-7 7"/>
                        </svg>
                    </button>
                    <button className="btn btn-warning btn-lg mr-4 mt-4 shadow-md hover:shadow-xl transform hover:scale-105 transition-all" onClick={() => window.location.hash = "#how-it-works"}>
                        So funktioniert’s
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="lucide lucide-lightbulb-icon lucide-lightbulb">
                            <path
                                d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                            <path d="M9 18h6"/>
                            <path d="M10 22h4"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Hero;
