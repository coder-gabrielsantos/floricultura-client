import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
    const navigate = useNavigate();
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
        // Aqui entraria a autenticação
        console.log("Login enviado:", form);
        navigate("/");
    };

    return (
        <div className={styles.overlay} onClick={() => navigate("/")}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>Entrar</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome"
                        value={form.name}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        name="identifier"
                        placeholder="Email ou Telefone"
                        value={form.identifier}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        value={form.password}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>
                        Acessar conta
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
