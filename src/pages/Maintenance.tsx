import { useState, useEffect } from 'react';

export default function MaintenancePage() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4" data-theme="retro">
            <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
                <div className="card-body text-center">

                    <h1 className="text-5xl font-bold mb-2">Absendo</h1>
                    <div className="divider"></div>

                    <h2 className="card-title justify-center text-2xl mb-4">
                        Wir arbeiten an etwas Grossartigem! 🚀
                    </h2>

                    <p className="text-base-content/70 mb-6">
                        Absendo ist gerade in Wartung. Wir bereiten die erste Vollversion vor
                        und werden bald zurück sein!
                    </p>

                    <div className="mb-6">
                        <div className="flex justify-center items-center mb-2">
                            <span className="text-sm text-base-content/60">Fortschritt</span>
                        </div>
                        <progress className="progress progress-primary w-full h-3" value="45" max="100"></progress>
                        <p className="text-sm text-base-content/60 mt-2">45% abgeschlossen</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-base-content/60 mb-4">
                            Fragen? Kontaktiere mich unter:
                        </p>
                        <a href="mailto:mail@absendo.app" className="btn btn-outline btn-primary mb-4">
                            info@absendo.com
                        </a>
                    </div>

                    <div className="mt-6 pt-4 border-t border-base-300">
                        <p className="text-base-content/50 text-sm">
                            Letzte Aktualisierung: {currentTime.toLocaleString('de-DE')}
                        </p>
                        <div className="flex justify-center space-x-2 mt-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

