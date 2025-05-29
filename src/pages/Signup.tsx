import Navbar from "../components/Navbar.tsx";
import SignupForm from "../components/SignupForm.tsx";
import {useIsUserLoggedIn} from "../supabaseClient.ts";

function Signup () {

    const isUserLoggedIn = useIsUserLoggedIn();

    return (
        <div className={"min-h-screen bg-base-100"}>
            <Navbar />
            {!isUserLoggedIn ? (
                <SignupForm/>
            ) : window.location.href = "/dashboard"}
        </div>
    );
}

export default Signup;