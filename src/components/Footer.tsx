function Footer() {
    return (
        <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
            <aside className="flex flex-col items-center md:items-start gap-4">
                <div className="mt-10">
                <p className="text-center md:text-left">
                    Absendo<br/>
                    Ein einfaches Tool zum Ausfüllen von Absenzformularen
                </p>
                </div>
            </aside>

            <nav className="flex flex-col items-center md:items-start">
                <h6 className="footer-title">Development</h6>
                <a className="link link-hover" href="https://github.com/notacodes/absendo" target="_blank">Open
                    source</a>
                <a className="link link-hover" href="https://absendo.betteruptime.com/">System Status</a>
            </nav>

            <nav className="flex flex-col items-center md:items-start">
                <h6 className="footer-title">Kontakt</h6>
                <a className="link link-hover" href="/contact">Kontaktformular</a>
                <a className="link link-hover" href="mailto:contact@absendo.app">contact@absendo.app</a>
            </nav>

            <nav className="flex flex-col items-center md:items-start">
                <h6 className="footer-title">Links</h6>
                <a className="link link-hover" href="/datenschutz">Datenschutzerklärung</a>
            </nav>
        </footer>
    );
}

export default Footer;
