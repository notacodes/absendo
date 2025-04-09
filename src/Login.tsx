import LoginFrom from "./components/LoginFrom.tsx";
import Navbar from "./components/Navbar.tsx";

function Login () {
    return (
        <div className={"min-h-screen bg-base-100"}>
            <Navbar />
            <LoginFrom />
        </div>
    );
}

export default Login;