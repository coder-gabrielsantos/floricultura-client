import { Cart, TransitionRight, LogIn, OpenNewWindow } from "iconoir-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = ({ onLoginClick, onCartClick }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem("user"));
        setUser(localUser);
    }, []);

    return (
        <div style={styles.navWrapper}>
            <nav style={styles.navbar}>
                <h1 onClick={() => navigate("/")} style={styles.logo}>Santa Teresinha</h1>

                <div style={styles.userActions}>
                    {user && user.role === "admin" ? (
                        <button style={styles.actionBtn} onClick={() => navigate("/painel")}>
                            <OpenNewWindow style={styles.icon} />
                            <span className="action-label">Painel do Administrador</span>
                        </button>
                    ) : (
                        user && (
                            <button style={styles.actionBtn} onClick={onCartClick}>
                                <Cart style={styles.icon} />
                                <span className="action-label">Carrinho</span>
                            </button>
                        )
                    )}

                    {user ? (
                        <button style={styles.actionBtn} onClick={() => navigate("/perfil")}>
                            <TransitionRight style={styles.icon}/>
                            <span className="action-label">Minha Conta</span>
                        </button>
                    ) : (
                        <div onClick={onLoginClick} style={styles.login}>
                            <LogIn style={styles.icon}/>
                            Entrar
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;

const styles = {
    actionBtn: {
        alignItems: "center",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "10px",
        color: "#333",
        cursor: "pointer",
        display: "flex",
        fontSize: "0.95rem",
        fontWeight: 500,
        gap: "0.5rem",
        padding: "0.4rem 0.8rem",
        transition: "all 0.2s ease"
    },
    icon: {
        fontSize: "1rem"
    },
    logo: {
        cursor: "pointer",
        fontSize: "1.2rem",
        fontWeight: "700"
    },
    login: {
        alignItems: "center",
        color: "#4CAF50",
        cursor: "pointer",
        display: "flex",
        fontSize: "0.95rem",
        fontWeight: 500,
        gap: "0.5rem",
        textDecoration: "none"
    },
    navWrapper: {
        backgroundColor: "#fff",
        borderBottom: "1px solid #ccc",
        position: "sticky",
        top: 0,
        zIndex: 100
    },
    navbar: {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        margin: "0 auto",
        maxWidth: "1440px",
        padding: "1rem 2rem",
        width: "100%"
    },
    userActions: {
        display: "flex",
        alignItems: "center",
        gap: "1rem"
    }
};
