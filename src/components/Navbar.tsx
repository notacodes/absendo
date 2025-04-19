import {useIsUserLoggedIn } from "../supabaseClient.ts";

function Navbar() {
    const isUserLoggedIn = useIsUserLoggedIn();

    return (
        <div className="navbar bg-base-200 shadow-md">
            <div className="navbar-start">
                <a className="btn btn-ghost normal-case text-xl" href="/home">Absendo</a>
            </div>
            <div className="navbar-end">
                { !isUserLoggedIn ? (
                    <div>
                        <a className="btn btn-secondary ml-2" href="/signup">Sign Up</a>
                        <a className="btn btn- ml-2" href="/login">Login</a>
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={() => window.location.href = "/dashboard"}>
                        Dashboard
                    </button>
                )}

            </div>
        </div>
    );
}

export default Navbar;