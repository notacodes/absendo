import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import DashboardStats from "../components/DashboardStats.tsx";
import DashboardHeader from "../components/DashboardHeader.tsx";
import DashboardLastAbsences from "../components/DashboardLastAbsences.tsx";

function Dashboard() {
    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />
            <DashboardHeader />
            <DashboardStats />
            <DashboardLastAbsences />
            <Footer />
        </div>
    );
}

export default Dashboard;