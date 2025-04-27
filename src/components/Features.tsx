function Features() {
    return (
        <>
            <div className="py-12 container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-8">So einfach geht's</h2>

                <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
                    <div className="text-center">
                        <div className="text-5xl mb-4">📝</div>
                        <h3 className="text-xl font-bold mb-2">Anmelden</h3>
                        <p className="max-w-xs mx-auto">Registriere dich mit deiner Schulnetz-Kalender-URL und füge deine persönlichen Informationen hinzu</p>
                    </div>

                    <div className="text-3xl md:text-5xl rotate-90 md:rotate-0">➔</div>

                    <div className="text-center">
                        <div className="text-5xl mb-4">📅</div>
                        <h3 className="text-xl font-bold mb-2">Datum wählen</h3>
                        <p className="max-w-xs mx-auto">Wähle einfach den Zeitraum deiner Abwesenheit im Kalender aus</p>
                    </div>

                    <div className="text-3xl md:text-5xl rotate-90 md:rotate-0">➔</div>

                    <div className="text-center">
                        <div className="text-5xl mb-4">✅</div>
                        <h3 className="text-xl font-bold mb-2">Herunterladen & fertig</h3>
                        <p className="max-w-xs mx-auto">Lade das fertig ausgefüllte Formular herunter, unterschreibe es und du bist fertig!</p>
                    </div>
                </div>
            </div>

            <div className="py-12">
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Warum dieses Tool?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="flex items-start gap-4">
                    <div className="text-2xl">💸</div>
                    <div>
                        <h3 className="font-bold">Komplett kostenlos</h3>
                        <p>Keine versteckten Kosten, keine Abos - einfach gratis nutzbar</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="text-2xl">⚡</div>
                    <div>
                        <h3 className="font-bold">Blitzschnell</h3>
                        <p>Unter 1 Minute vom Start bis zum ausgefüllten Formular</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="text-2xl">🔄</div>
                    <div>
                        <h3 className="font-bold">Einmalig Einrichtung</h3>
                        <p>Gib alles einmal ein und nutze es immer wieder</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="text-2xl">🛠️</div>
                    <div>
                        <h3 className="font-bold">Open Source</h3>
                        <p>Wird als <a className="underline" href="https://github.com/notacodes/absendo" target="_blank">Open-Source-Projekt</a> entwickelt</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="py-12">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Bereit, Zeit zu sparen?</h2>
            <p className="mb-6 max-w-md mx-auto">Kein Stress mehr mit Absenzformularen! <br /> Registriere dich jetzt und erledige es in Sekunden.</p>
            <button
                className="btn btn-primary"
                onClick={() => window.location.href = '/signup'}
            >
                Jetzt kostenlos nutzen
            </button>
        </div>
    </div>
        </>
    );
}

export default Features;