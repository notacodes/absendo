
import Navbar from "../components/Navbar.tsx";
import ContactForm from "../components/ContactForm.tsx";

function Contact () {
    return (
        <div className={"min-h-screen bg-base-100"}>
            <Navbar />
            <ContactForm/>
        </div>
    );
}
export default Contact;