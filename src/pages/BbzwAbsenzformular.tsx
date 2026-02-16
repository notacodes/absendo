import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import { trackEvent } from "../utils/umami.ts";

function BbzwAbsenzformular() {
    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />

            <main className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    BBZW Absenzformular online ausfüllen
                </h1>

                <p className="text-lg mb-6">
                    Mit Absendo kannst du dein BBZW Absenzformular in wenigen Sekunden vorbereiten.
                    Die Idee ist aus einem echten Problem entstanden: Das manuelle Ausfüllen hat
                    mich jedes Mal aufgeregt und unnötig Zeit gekostet.
                </p>

                <p className="text-lg mb-10">
                    Deshalb habe ich Absendo gebaut: um BBZW Absenzen einfacher zu machen, Schritte
                    zu reduzieren und pro Formular mehrere Minuten zu sparen.
                </p>

                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">Wie funktioniert das BBZW Absenzformular mit Absendo?</h2>
                    <ol className="list-decimal list-inside space-y-3 text-lg">
                        <li>Einmal mit deinen Daten und deiner Schulnetz-Kalender-URL anmelden.</li>
                        <li>Zeitraum der Absenz im Kalender wählen.</li>
                        <li>Formular automatisch ausfüllen lassen und als PDF herunterladen.</li>
                    </ol>
                </section>

                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">Für welche Standorte?</h2>
                    <p className="text-lg">
                        Aktuell ist Absendo für BBZW Sursee, BBZW Emmen und BBZW Willisau optimiert.
                        Wenn du von einer anderen Schule kommst, kannst du sie uns über das Kontaktformular vorschlagen.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">Warum ich das gebaut habe</h2>
                    <p className="text-lg">
                        Ich wollte den nervigsten Teil bei BBZW Absenzen entfernen: immer wieder dieselben
                        Angaben in das Absenzformular einzutragen. Absendo nimmt dir genau diese repetitive Arbeit ab,
                        damit du schneller fertig bist.
                    </p>
                </section>

                <div className="flex flex-col sm:flex-row gap-4">
                    <a className="btn btn-primary btn-lg" href="/signup" onClick={() => trackEvent("click_cta_start_free", { section: "bbzw_landing" })}>Jetzt kostenlos starten</a>
                    <a className="btn btn-outline btn-lg" href="/contact" onClick={() => trackEvent("click_contact_from_bbzw_landing")}>Fragen stellen</a>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default BbzwAbsenzformular;
