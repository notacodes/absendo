import {supabase, useIsUserLoggedIn } from "../supabaseClient.ts";


function Navbar() {
    const isUserLoggedIn = useIsUserLoggedIn();

    return (
        <div className="navbar bg-base-200 shadow-md">
            <div className="navbar-start">
                <a className="btn btn-ghost normal-case text-xl" href="/home">Absendo</a>
            </div>
            <div className="navbar-end">
                { !isUserLoggedIn ? (
                    <a className="btn btn-secondary ml-2" href="/login">Login</a>
                ):(
                    <button className="btn btn-secondary ml-2" onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.href = "/";
                    }}>
                        Logout
                    </button>
                )}

            </div>
        </div>
    );
}

export default Navbar;