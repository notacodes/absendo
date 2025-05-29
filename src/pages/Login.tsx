import LoginFrom from "../components/LoginFrom.tsx";
import Navbar from "../components/Navbar.tsx";
import { useIsUserLoggedIn } from "../supabaseClient.ts";

function Login () {

    const isUserLoggedIn = useIsUserLoggedIn();

    return (
        <div className={"min-h-screen bg-base-100"}>
            <Navbar />
            {!isUserLoggedIn ? (
                <LoginFrom/>
            ) : window.location.href = "/dashboard"}
        </div>
    );
}

export default Login;