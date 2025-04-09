function Navbar() {
    return (
        <div className="navbar bg-base-200 shadow-md">
            <div className="navbar-start">
                <a className="btn btn-ghost normal-case text-xl" href="/home">Absendo</a>
            </div>
            <div className="navbar-end">
                <a className="btn btn-primary">Kontakt</a>
                <a className="btn btn-secondary ml-2" href="/login">Login</a>
            </div>
        </div>
    );
}

export default Navbar;