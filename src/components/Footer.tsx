function Footer() {
    return (
        <footer className="footer p-8 bg-base-300 text-base-content">
            <div className="container mx-auto flex flex-wrap justify-between gap-8 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <span className="footer-title">Absenz-Tool</span>
                    <p className="max-w-xs">
                        Ein einfaches Tool zum Ausfüllen von Absenzformularen.
                    </p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                    <span className="footer-title">Links</span>
                    <a className="link link-hover" href="https://github.com/notacodes/absendo" target="_blank">Github Repository</a>
                    <a className="link link-hover" href="/contact">Kontaktformular</a>
                </div>
                <div className="flex flex-col items-center md:items-start">
                    <span className="footer-title">Kontakt</span>
                    <a className="link link-hover" href="mailto:contact@absendo.app">contact@absendo.app</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
