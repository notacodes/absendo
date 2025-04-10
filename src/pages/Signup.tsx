import Navbar from "../components/Navbar.tsx";
import SignupForm from "../components/SignupForm.tsx";

function Signup () {
    return (
        <div className={"min-h-screen bg-base-100"}>
            <Navbar />
            <SignupForm />
        </div>
    );
}

export default Signup;