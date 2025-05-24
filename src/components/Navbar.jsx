import { Link } from "react-router-dom";
import { LogIn, User } from "iconoir-react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = ({ onLoginClick }) => {
    const { user } = useAuth()

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>
                    Floricultura
                </Link>

                <div style={styles.links}>
                    <Link to="/" style={styles.link}>Início</Link>
                    <Link to="/produtos" style={styles.link}>Produtos</Link>
                    <Link to="/contato" style={styles.link}>Contato</Link>
                </div>

                {user ? (
                    <Link to="/perfil" style={styles.login}>
                        <User style={styles.icon} />
                        {user.name.split(" ")[0] || "Perfil"}
                    </Link>
                ) : (
                    <div onClick={onLoginClick} style={styles.login}>
                        <LogIn style={styles.icon} />
                        Entrar
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

const styles = {
    navbar: {
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #e0e0e0",
        padding: "0.75rem 0",
        position: "sticky",
        top: 0,
        zIndex: 100
    },
    container: {
        alignItems: "center",
        display: "flex",
        gap: "2rem",
        justifyContent: "space-between",
        margin: "0 auto",
        maxWidth: "1440px",
        padding: ".6rem 2rem"
    },
    logo: {
        color: "#2c2c2c",
        fontSize: "1.4rem",
        fontWeight: 600,
        textDecoration: "none"
    },
    links: {
        display: "flex",
        gap: "2rem"
    },
    link: {
        color: "#555",
        fontSize: "1rem",
        fontWeight: 500,
        textDecoration: "none"
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
    icon: {
        fontSize: "1.2rem"
    }
};
