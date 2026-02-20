import { secureLogout, useIsUserLoggedIn } from "../supabaseClient.ts";
import { trackEvent } from "../utils/umami.ts";

function Navbar() {
    const isUserLoggedIn = useIsUserLoggedIn();
    const version = "2.0.0";

    return (
        <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
            <div className="navbar mx-auto max-w-7xl px-4 md:px-6">
                <div className="navbar-start gap-2">
                    <a
                        className="btn btn-ghost px-2 text-xl font-bold normal-case"
                        href="/"
                        onClick={() => trackEvent("click_nav_home")}
                    >
                        Absendo
                    </a>
                    <span className="badge badge-outline hidden md:inline-flex">v{version}</span>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal gap-1 px-1">
                        <li>
                            <a href="/bbzw-absenzformular" onClick={() => trackEvent("click_nav_bbzw")}>
                                BBZW
                            </a>
                        </li>
                        <li>
                            <a href="/support" onClick={() => trackEvent("click_nav_support")}>
                                Support
                            </a>
                        </li>
                        <li>
                            <a href="/contact" onClick={() => trackEvent("click_nav_contact")}>
                                Kontakt
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="navbar-end gap-2">
                    {!isUserLoggedIn ? (
                        <>
                            <a
                                className="btn btn-ghost btn-sm md:btn-md"
                                href="/login"
                                onClick={() => trackEvent("click_nav_login")}
                            >
                                Login
                            </a>
                            <a
                                className="btn btn-primary btn-sm md:btn-md"
                                href="/signup"
                                onClick={() => trackEvent("click_nav_signup")}
                            >
                                Kostenlos starten
                            </a>
                        </>
                    ) : (
                        <>
                            <a
                                className="btn btn-ghost btn-sm md:btn-md"
                                href="/dashboard"
                                onClick={() => trackEvent("click_nav_dashboard")}
                            >
                                Dashboard
                            </a>
                            <button
                                className="btn btn-outline btn-error btn-sm md:btn-md"
                                onClick={() =>
                                    secureLogout().then(() => {
                                        trackEvent("click_nav_logout");
                                        window.location.href = "/home";
                                    })
                                }
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
