import {useEffect, useState} from "react";
import {supabase, useIsUserLoggedIn} from "../supabaseClient.ts";

function HomeContent() {
    const [error, setError] = useState(false);
    const isUserLoggedIn = useIsUserLoggedIn();
    const [savedTimeMinutes, setSavedTimeMinutes] = useState<number | undefined>(undefined);
    useEffect(() => {
        const fetchUserCount = async () => {
            const { data, error } = await supabase.rpc('count_generated_absences');
            if (error) {
                setError(true);
            } else {
                setError(false);
                setSavedTimeMinutes(data * 5);
            }
        };
        fetchUserCount();
    }, []);
    return (
        <>
            <div className="py-12 container mx-auto px-4 mb-14">
                <div className="py-12 mt-10">
                    <div className="container mx-auto px-4">
                        <h2 className="text-5xl font-bold text-center mb-12">Warum Absendo?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-14">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">💸</div>
                                <div>
                                    <h3 className="text-2xl font-bold">Komplett kostenlos</h3>
                                    <p className="text-xl">Keine versteckten Kosten, keine Abos - einfach gratis nutzbar</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="text-4xl">⚡</div>
                                <div>
                                    <h3 className="text-2xl font-bold">Blitzschnell</h3>
                                    <p className="text-lg">Unter 30 Sekunden vom Start bis zum ausgefüllten Formular</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="text-4xl">🔄</div>
                                <div>
                                    <h3 className="text-2xl font-bold">Einmal gemacht, immer bereit</h3>
                                    <p className="text-lg">Trage deine Daten einmal ein – danach läuft alles automatisch</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="text-4xl">🛠️</div>
                                <div>
                                    <h3 className="text-2xl font-bold">Open Source</h3>
                                    <p className="text-lg">Wird als <a className="underline" href="https://github.com/notacodes/absendo" target="_blank">Open-Source-Projekt</a> entwickelt</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 id="how-it-works" className="text-5xl font-bold text-center mb-8 mt-14 scroll-mt-40">So einfach geht's</h2>

                <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
                    <div className="text-center">
                        <div className="text-7xl mb-4">📝</div>
                        <h3 className="text-3xl font-bold mb-2">Anmelden</h3>
                        <p className="text-lg max-w-xs mx-auto">Registriere dich mit deiner Schulnetz-Kalender-URL und füge deine persönlichen Informationen hinzu</p>
                    </div>

                    <div className="text-4xl md:text-6xl rotate-90 md:rotate-0">➔</div>

                    <div className="text-center">
                        <div className="text-7xl mb-4">📅</div>
                        <h3 className="text-3xl font-bold mb-2">Datum wählen</h3>
                        <p className="text-lg max-w-xs mx-auto">Wähle einfach den Zeitraum deiner Abwesenheit im Kalender aus</p>
                    </div>

                    <div className="text-4xl md:text-6xl rotate-90 md:rotate-0">➔</div>

                    <div className="text-center">
                        <div className="text-7xl mb-4">✅</div>
                        <h3 className="text-3xl font-bold mb-2">Herunterladen & fertig</h3>
                        <p className="text-lg max-w-xs mx-auto">Lade das fertig ausgefüllte Formular herunter, unterschreibe es und du bist fertig!</p>
                    </div>
                </div>

                <div id="faq" className="py-20 mt-25">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <h2 className="text-5xl font-bold text-center mb-12">Häufige Fragen (FAQ)</h2>
                        <div className="space-y-6">
                            <div className="collapse collapse-arrow bg-base-100 shadow-xl">
                                <input type="checkbox" />
                                <div className="collapse-title text-xl font-bold">
                                    Was brauche ich, um loszulegen?
                                </div>
                                <div className="collapse-content text-lg">
                                    <p>Du brauchst nur den Link zu deinem Schulnetz-Kalender und deine persönlichen Infos. Den Rest übernimmt Absendo für dich.</p>
                                </div>
                            </div>

                            <div className="collapse collapse-arrow bg-base-100 shadow-xl">
                                <input type="checkbox" />
                                <div className="collapse-title text-xl font-bold">
                                    Was ist meine Schulnetz-Kalender-URL und wo bekomme ich sie?
                                </div>
                                <div className="collapse-content text-lg">
                                    <p>Deine Schulnetz-Kalender-URL bekommst du direkt vom Schulnetz.
                                        Absendo nutzt sie, um deine Absenzen automatisch für dich auszufüllen!
                                        Sobald Absendo sie braucht, bekommst du eine Schritt-für-Schritt-Anleitung, wie du deine URL findest und einträgst.</p>
                                </div>
                            </div>

                            <div className="collapse collapse-arrow bg-base-100 shadow-xl">
                                <input type="checkbox" />
                                <div className="collapse-title text-xl font-bold">
                                    Für welche Schulen kann Absendo Absenzen generieren?
                                </div>
                                <div className="collapse-content text-lg">
                                    <p>Im Moment funktioniert Absendo nur für das BBZW – aber:
                                        Weitere Schulen sind geplant und werden so schnell wie möglich hinzugefügt!
                                    </p>
                                </div>
                            </div>

                            <div className="collapse collapse-arrow bg-base-100 shadow-xl">
                                <input type="checkbox" />
                                <div className="collapse-title text-xl font-bold">
                                    Muss ich jedes Mal alles neu eingeben?
                                </div>
                                <div className="collapse-content text-lg">
                                    <p>Nein. Du richtest Absendo einmal ein – danach kannst du deine Angaben immer wieder nutzen, ohne sie neu einzugeben.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-20">
                    <div className="container mx-auto px-4 text-center text-primary-content">
                        <h2 className="text-5xl font-bold mb-6">
                            Bereit, Zeit zu sparen? 🎉
                        </h2>
                        <p className="text-xl mb-4 max-w-2xl mx-auto">
                            {savedTimeMinutes !== undefined && !error && (
                                <p className="text-lg mb-8 max-w-2xl mx-auto">
                                    Schon {" "}
                                    <span className="font-bold">
                                    {Math.floor(savedTimeMinutes / 60)} Stunden
                                        {savedTimeMinutes % 60 !== 0 ? ` und ${savedTimeMinutes % 60} Minuten` : ""}
                                </span>
                                    {" "}
                                    für alle Schüler*innen eingespart – effizient, oder? ⚡
                                </p>
                            )}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                            <button
                                className="btn btn-primary btn-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all"
                                onClick={() => {
                                    if (!isUserLoggedIn) {
                                        window.location.href = "/signup";
                                    } else {
                                        window.location.href = "/dashboard";
                                    }
                                }}
                            >
                                🚀 Jetzt kostenlos nutzen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomeContent;
