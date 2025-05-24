import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import UserProfile from "./pages/User/UserProfile.jsx";

import NewProduct from "./pages/Admin/NewProduct.jsx";

function App() {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <Router>
            <Navbar onLoginClick={() => setShowLogin(true)} />
            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/perfil" element={<UserProfile />} />
                <Route path="/admin" element={<NewProduct />} />
            </Routes>
        </Router>
    );
}

export default App;
