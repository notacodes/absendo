import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import EmailVerification from "./pages/EmailVerification.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Contact from "./pages/Contact.tsx";
import Profile from "./pages/Profile.tsx";
import AllAbsences from "./pages/AllAbsences.tsx";
import MaintenancePage from "./pages/Maintenance.tsx";

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/welcome" element={<Onboarding />} />
                <Route path="/email-verification" element={<EmailVerification />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/absences" element={<AllAbsences />} />
                {/*<Route path="*" element={<Navigate to="/maintenance" replace />} />*/}
                <Route path="/maintenance" element={<MaintenancePage />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
