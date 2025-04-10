import Navbar from "../components/Navbar.tsx";
import Hero from "../components/Hero.tsx";
import Features from "../components/Features.tsx";
import Footer from "../components/Footer.tsx";

function Home() {
    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />
            <Hero />
            <Features />
            <Footer />
        </div>
    );
}

export default Home;