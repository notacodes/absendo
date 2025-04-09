import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.tsx";
import Login from "./Login.tsx";

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;