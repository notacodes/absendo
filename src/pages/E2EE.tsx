import Navbar from "../components/Navbar.tsx";
import E2EEAuthComponent from "../components/E2EEAuthComponent.tsx";

function E2EE () {
    return (
        <div className={"min-h-screen bg-base-100"}>
            <Navbar />
            <E2EEAuthComponent />
        </div>
    );
}
export default E2EE;