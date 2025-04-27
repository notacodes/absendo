function Hero() {
    return (
        <div className="hero min-h-[60vh] bg-base-100">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Absendo</h1>
                    <p className="py-6 text-lg">
                        Automatisches Ausfüllen von Absenzen fürs BBZW
                    </p>
                    <button className="btn btn-primary" onClick={() => (window.location.href = "/signup")}>Registriere dich!</button>
                </div>
            </div>
        </div>
    );
}

export default Hero;