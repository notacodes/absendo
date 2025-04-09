function Features() {
    return (
        <div className="py-12 bg-base-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-8">Funktionen</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title">Automatisierung</h3>
                            <p>Spart Zeit durch automatisches Erfassen von Absenzen.</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title">Einfache Bedienung</h3>
                            <p>Intuitive Benutzeroberfläche für BBZ-Mitarbeiter.</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title">Zuverlässigkeit</h3>
                            <p>Präzise Datenverarbeitung für alle Absenzen.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Features;