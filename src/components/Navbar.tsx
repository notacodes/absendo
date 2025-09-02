import { secureLogout, useIsUserLoggedIn } from "../supabaseClient.ts";

function Navbar() {
    const isUserLoggedIn = useIsUserLoggedIn();
    const version = "Beta";

    return (
        <div className="navbar shadow-md">
            <div className="navbar-start">
                <a className="btn btn-ghost normal-case text-xl" href="/home">Absendo</a>
                <span className="ml-3 px-2 py-1 text-xs font-medium bg-orange-200 text-orange-800 rounded-full">
                    {version}
                </span>
            </div>
            <div className="navbar-end">
                { !isUserLoggedIn ? (
                    <div>
                        <a className="btn btn-white text-black ml-2" href="/login">Login</a>
                        <a className="btn btn-primary ml-2" href="/signup">Sign Up</a>
                    </div>
                ) : (
                    <>
                        <button className="btn btn-secondary" onClick={() => window.location.href = "/dashboard"}>
                            Dashboard
                        </button>
                        <button className="btn btn-error ml-2" onClick={() => secureLogout().then(() => {window.location.href = "/home";})}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar;