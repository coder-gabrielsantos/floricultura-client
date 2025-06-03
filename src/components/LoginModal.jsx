import { useState } from "react";
import { loginUser, registerUser } from "../api/_index.js";
import { useAuth } from "../context/AuthContext";

const LoginModal = ({ onClose }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [form, setForm] = useState({
        name: "",
        identifier: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            if (isRegistering) {
                const user = await registerUser(form);
                login(user);
                handleClose();
            } else {
                const user = await loginUser({
                    identifier: form.identifier,
                    password: form.password
                });
                login(user);
                handleClose();
            }
            window.location.reload();
        } catch (err) {
            console.error("Auth error:", err);
            setMessage(
                err.response?.data?.message || "Erro ao autenticar. Tente novamente."
            );
        }
    };

    return (
        <div
            style={{
                ...styles.overlay,
                animation: `${isClosing ? "fadeOut" : "fadeIn"} 0.3s ease forwards`
            }}
            onClick={handleClose}
        >
            <div
                style={{
                    ...styles.modal,
                    animation: `${isClosing ? "slideDown" : "slideUp"} 0.3s ease forwards`
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={styles.title}>
                    {isRegistering ? "Criar conta" : "Entrar na conta"}
                </h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {isRegistering && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Nome"
                            value={form.name}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    )}
                    <input
                        type="text"
                        name="identifier"
                        placeholder="Whatsapp"
                        value={form.identifier}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        value={form.password}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button}>
                        {isRegistering ? "Cadastrar" : "Entrar"}
                    </button>
                </form>

                {message && (
                    <p style={{ textAlign: "center", color: "tomato", marginTop: "1rem" }}>
                        {message}
                    </p>
                )}

                <p style={styles.toggle}>
                    {isRegistering ? "Já tem uma conta?" : "Ainda não tem uma conta?"}{" "}
                    <span
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setMessage("");
                        }}
                        style={styles.link}
                    >
            {isRegistering ? "Entrar" : "Criar conta"}
          </span>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;

const styles = {
    overlay: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        left: 0,
        position: "fixed",
        top: 0,
        width: "100vw",
        zIndex: 999
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        padding: "2rem",
        transform: "translateY(100vh)",
        width: "100%"
    },
    title: {
        fontSize: "1.5rem",
        fontWeight: 600,
        marginBottom: "1rem",
        textAlign: "center"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
    },
    input: {
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "1rem",
        padding: "0.75rem"
    },
    button: {
        backgroundColor: "#4caf50",
        border: "none",
        borderRadius: "8px",
        color: "white",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: 500,
        padding: "0.75rem"
    },
    toggle: {
        color: "#555",
        fontSize: "0.9rem",
        marginTop: "1rem",
        textAlign: "center"
    },
    link: {
        color: "#4caf50",
        cursor: "pointer",
        fontWeight: 600,
        marginLeft: "0.25rem"
    }
};
