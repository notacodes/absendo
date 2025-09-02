import Navbar from "../components/Navbar.tsx";
import Datenschutz from "../components/Datenschutz.tsx";
import Footer from "../components/Footer.tsx";

function Contact () {
    return (
        <div className={"min-h-screen bg-base-100"}>
            <Navbar />
            <Datenschutz/>
            <Footer />
        </div>
    );
}
export default Contact;