import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CatalogsPage from "./pages/Catalogs/CatalogsPage";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import CartModal from "./components/CartModal.jsx";
import UserProfile from "./pages/User/UserProfile.jsx";
import UserAddress from "./pages/User/UserAddress.jsx";
import AdminPanel from "./pages/Admin/AdminPanel.jsx";
import NewProduct from "./pages/Admin/NewProduct.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import PaymentSuccess from "./components/PaymentSuccess";

function App() {
    const [showLogin, setShowLogin] = useState(false);
    const [showCart, setShowCart] = useState(false);

    return (
        <Router>
            <Navbar
                onLoginClick={() => setShowLogin(true)}
                onCartClick={() => setShowCart(true)}
            />

            {showLogin && <LoginModal onClose={() => setShowLogin(false)}/>}
            {showCart && <CartModal onClose={() => setShowCart(false)}/>}

            <Routes>
                <Route path="/" element={<CatalogsPage />} />
                <Route path="/produtos" element={<Home />} />
                <Route path="/perfil" element={<UserProfile />} />
                <Route path="/endereco" element={<UserAddress />} />
                <Route path="/painel" element={<AdminPanel />} />
                <Route path="/novo-produto" element={<NewProduct />} />
                <Route path="/editar-produto/:id" element={<NewProduct />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/sucesso" element={<PaymentSuccess />} />
            </Routes>
        </Router>
    );
}

export default App;
