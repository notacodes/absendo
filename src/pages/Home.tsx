import Navbar from "../components/Navbar.tsx";
import Hero from "../components/Hero.tsx";
import HomeContent from "../components/HomeContent.tsx";
import Footer from "../components/Footer.tsx";

function Home() {
    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />
            <Hero />
            <HomeContent />
            <Footer />
        </div>
    );
}

export default Home;
