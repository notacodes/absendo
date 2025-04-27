export default function EmailVerificationCard() {

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="max-w-md w-full p-6 bg-base-100 rounded-lg shadow-lg">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4 flex items-center justify-center">
                        <span className="text-3xl">✉️</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">Schau in dein Postfach! 📧</h2>
                    <p className="text-base-content/70 mb-6">
                        Ich haben dir einen Bestätigungslink per E-Mail geschickt.
                        Klick darauf, um dein Konto zu aktivieren und loszulegen! 🚀
                    </p>

                    <div className="space-y-4 w-full">
                        <button className="btn btn-primary w-full" onClick={() => window.location.href = '/login'}>
                            In dein Konto einloggen 🔑
                        </button>
                        <button className="btn btn-outline w-full" onClick={() => window.location.href = '/home'}>
                            Zurück zur Startseite 🏠
                        </button>
                    </div>

                    <p className="mt-6 text-sm text-base-content/60">
                        Probleme? <a href="/contact" className="text-primary hover:underline">Kontaktiere mich!</a>
                    </p>
                </div>
            </div>
        </div>
    );
}