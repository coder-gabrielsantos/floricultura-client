import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import CatalogsPage from "./pages/Catalogs/CatalogsPage.jsx";
import Home from "./pages/Home/Home.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import PaymentSuccess from "./components/PaymentSuccess.jsx";
import PaymentFailure from "./components/PaymentFailure";
import UserProfile from "./pages/User/UserProfile.jsx";
import UserAddress from "./pages/User/UserAddress.jsx";
import AdminPanel from "./pages/Admin/AdminPanel.jsx";
import NewProduct from "./pages/Admin/NewProduct.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import CartModal from "./components/CartModal";

const App = () => {
    const [user, setUser] = useState(null);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        const local = localStorage.getItem("user");
        if (local) {
            setUser(JSON.parse(local));
        }
    }, []);

    return (
        <BrowserRouter>
            <Navbar user={user} onCartClick={() => setShowCart(true)} />
            {showCart && <CartModal onClose={() => setShowCart(false)} />}
            <Routes>
                {/* Público */}
                <Route path="/" element={<CatalogsPage />} />
                <Route path="/produtos" element={<Home />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/sucesso" element={<PaymentSuccess />} />
                <Route path="/falha" element={<PaymentFailure />} />

                {/* Usuário autenticado */}
                <Route
                    path="/perfil"
                    element={
                        <ProtectedRoute user={user}>
                            <UserProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/endereco"
                    element={
                        <ProtectedRoute user={user}>
                            <UserAddress />
                        </ProtectedRoute>
                    }
                />

                {/* Administrador */}
                <Route
                    path="/painel"
                    element={
                        <ProtectedRoute user={user} role="admin">
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/novo-produto"
                    element={
                        <ProtectedRoute user={user} role="admin">
                            <NewProduct />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/editar-produto/:id"
                    element={
                        <ProtectedRoute user={user} role="admin">
                            <NewProduct />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
