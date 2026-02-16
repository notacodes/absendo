import {useEffect, useState} from "react";
import {useIsUserLoggedIn} from "../supabaseClient.ts";
import { trackEvent } from "../utils/umami.ts";

function HomeContent() {
    const [error, setError] = useState(false);
    const isUserLoggedIn = useIsUserLoggedIn();
    const [savedTimeMinutes, setSavedTimeMinutes] = useState(0);
    const [savedTimeHouers, setSavedTimeHouers] = useState(0);

    useEffect(() => {
        const response = fetch("https://api.absendo.app/stats/time-saved");
        try{
            response.then(res => res.json()).then(data => {
                setSavedTimeMinutes(data.timeSaved.minutes);
                setSavedTimeHouers(data.timeSaved.hours);
            });

        }catch (err) {
            console.error('Error fetching user count:', err);
            setError(true);
        }

    }, []);
    return (
        <>
            <div className="py-12 container mx-auto px-4 mb-14">

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

                <div className="py-12 mt-20">
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
                                    <p className="text-xl">Unter 20 Sekunden vom Start bis zum ausgefüllten Formular</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="text-4xl">🔒</div>
                                <div>
                                    <h3 className="text-2xl font-bold">Ende-zu-Ende-Verschlüsselung</h3>
                                    <p className="text-xl">Deine Daten gehören nur dir. Niemand kann darauf zugreifen oder sie wiederherstellen.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="text-4xl">🛠️</div>
                                <div>
                                    <h3 className="text-2xl font-bold">Open Source</h3>
                                    <p className="text-xl">Wird als <a className="underline" href="https://github.com/notacodes/absendo" target="_blank">Open-Source-Projekt</a> entwickelt</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center">
                            <h3 className="text-5xl font-bold mb-4">Für wen ist Absendo?</h3>
                            <p className="text-xl max-w-3xl mx-auto">
                                Absendo richtet sich zurzeit ausschliesslich an <strong className="text-primary">Schülerinnen und Schüler des Berufsbildungszentrums Wirtschaft, Informatik und Technik (BBZW)</strong> in Sursee, Willisau und Emmen.
                            </p>
                            <p className="text-lg mt-4 max-w-3xl mx-auto">
                                Wir arbeiten daran, Absendo in Zukunft auch für weitere Schulen verfügbar zu machen.
                                Wenn du möchtest, dass deine Schule unterstützt wird, lass es uns wissen!
                            </p>
                            <a href="/contact" className="btn-lg btn btn-primary mt-8" onClick={() => trackEvent("click_contact_school_suggest")}>Schule vorschlagen</a>
                        </div>
                    </div>
                </div>

                <div id="faq" className="py-20">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <h2 className="text-5xl font-bold text-center mb-12">Häufige Fragen (FAQ)</h2>
                        <p className="text-center text-lg mb-8">
                            Mehr Details findest du auch auf der Seite{" "}
                            <a className="link link-primary font-semibold" href="/bbzw-absenzformular">
                                BBZW Absenzformular
                            </a>.
                        </p>
                        <div className="space-y-6">
                            <div className="collapse collapse-arrow bg-base-100 shadow-xl">
                                <input type="checkbox" onChange={(e) => e.target.checked && trackEvent("faq_open", { question: "speed" })} />
                                <div className="collapse-title text-xl font-bold">
                                    Wie schnell kann ich ein BBZW Absenzformular ausfüllen?
                                </div>
                                <div className="collapse-content text-lg">
                                    <p>In der Regel unter 30 Sekunden, sobald dein Profil einmal eingerichtet ist.</p>
                                </div>
                            </div>

                            <div className="collapse collapse-arrow bg-base-100 shadow-xl">
                                <input type="checkbox" onChange={(e) => e.target.checked && trackEvent("faq_open", { question: "requirements" })} />
                                <div className="collapse-title text-xl font-bold">
                                    Was brauche ich, um mit BBZW Absenzen zu starten?
                                </div>
                                <div className="collapse-content text-lg">
                                    <p>Du brauchst den Link zu deinem Schulnetz-Kalender und deine persönlichen Angaben. Danach erstellt Absendo das Absenzformular automatisch.</p>
                                </div>
                            </div>

                            <div className="collapse collapse-arrow bg-base-100 shadow-xl">
                                <input type="checkbox" onChange={(e) => e.target.checked && trackEvent("faq_open", { question: "locations" })} />
                                <div className="collapse-title text-xl font-bold">
                                    Für welche BBZW Standorte funktioniert es?
                                </div>
                                <div className="collapse-content text-lg">
                                    <p>Aktuell für BBZW Sursee, BBZW Emmen und BBZW Willisau. Weitere Schulen sind geplant.</p>
                                </div>
                            </div>

                            <div className="collapse collapse-arrow bg-base-100 shadow-xl">
                                <input type="checkbox" onChange={(e) => e.target.checked && trackEvent("faq_open", { question: "repeat_data" })} />
                                <div className="collapse-title text-xl font-bold">
                                    Muss ich das BBZW Absenzformular jedes Mal neu ausfüllen?
                                </div>
                                <div className="collapse-content text-lg">
                                    <p>Nein. Du richtest Absendo einmal ein, danach werden wiederkehrende Angaben automatisch übernommen.</p>
                                </div>
                            </div>

                            <div className="collapse collapse-arrow bg-base-100 shadow-xl">
                                <input type="checkbox" onChange={(e) => e.target.checked && trackEvent("faq_open", { question: "pricing" })} />
                                <div className="collapse-title text-xl font-bold">
                                    Ist Absendo kostenlos?
                                </div>
                                <div className="collapse-content text-lg">
                                    <p>Ja. Absendo ist kostenlos nutzbar.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-5xl font-bold mb-6">
                            Bereit, Zeit zu sparen? 🎉
                        </h2>
                        <div className="text-xl mb-4 max-w-2xl mx-auto">
                            {!error && (
                                <p className="text-lg mb-8 max-w-2xl mx-auto">
                                    Schon {" "}
                                    <span className="font-bold text">
                                        {savedTimeHouers}
                                        {" "}
                                        {savedTimeHouers < 2 ? "Stunde " : "Stunden "}
                                        {"und"}{" "}
                                        {savedTimeMinutes}
                                        {" "}Minuten
                                    </span>
                                    {" "}
                                    für alle Schüler*innen eingespart – effizient, oder?
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                            <button
                                className="btn btn-success btn-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all"
                                onClick={() => {
                                    trackEvent("click_cta_start_free", { section: "home_bottom" });
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
