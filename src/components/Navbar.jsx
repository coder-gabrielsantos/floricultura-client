import { Cart, TransitionRight, LogIn, OpenNewWindow } from "iconoir-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

const Navbar = ({ onLoginClick, onCartClick }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem("user"));
        setUser(localUser);
    }, []);

    return (
        <div className={styles["nav-wrapper"]}>
            <nav className={styles.navbar}>
                <h1 onClick={() => navigate("/")} className={styles.logo}>Santa Teresinha</h1>

                <div className={styles["user-actions"]}>
                    {user && user.role === "admin" ? (
                        <button className={styles["action-btn"]} onClick={() => navigate("/painel")}>
                            <OpenNewWindow className={styles.icon} />
                            <span className="action-label">Painel do Administrador</span>
                        </button>
                    ) : (
                        user && (
                            <button className={styles["action-btn"]} onClick={onCartClick}>
                                <Cart className={styles.icon} />
                                <span className="action-label">Carrinho</span>
                            </button>
                        )
                    )}

                    {user ? (
                        <button className={styles["action-btn"]} onClick={() => navigate("/perfil")}>
                            <TransitionRight className={styles.icon}/>
                            <span className="action-label">Minha Conta</span>
                        </button>
                    ) : (
                        <div onClick={onLoginClick} className={styles.login}>
                            <LogIn className={styles.icon}/>
                            <span>Entrar</span>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
