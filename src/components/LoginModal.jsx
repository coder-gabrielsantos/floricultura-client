import { useState } from "react";

const LoginModal = ({ onClose }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [form, setForm] = useState({
        name: "",
        identifier: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegistering) {
            console.log("Cadastro enviado:", form);
        } else {
            console.log("Login enviado:", form);
        }
        handleClose();
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
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
                        />
                    )}
                    <input
                        type="text"
                        name="identifier"
                        placeholder="Email ou Telefone"
                        value={form.identifier}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        value={form.password}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>
                        {isRegistering ? "Cadastrar" : "Entrar"}
                    </button>
                </form>

                <p style={styles.toggle}>
                    {isRegistering ? "Já tem uma conta?" : "Ainda não tem uma conta?"}{" "}
                    <span
                        onClick={() => setIsRegistering(!isRegistering)}
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
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
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
