import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAddress } from "../../api";
import styles from "./NewAddress.module.css";

const NewAddress = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        street: "",
        number: "",
        neighborhood: "",
        reference: "",
        complement: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createAddress(form, JSON.parse(localStorage.getItem("user"))?.token);
        navigate("/perfil");
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Novo Endereço</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                    <div className={`${styles.field} ${styles.streetField}`}>
                        <label htmlFor="street">Endereço</label>
                        <input
                            id="street"
                            name="street"
                            value={form.street}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={`${styles.field} ${styles.numberField}`}>
                        <label htmlFor="number">Número</label>
                        <input
                            id="number"
                            name="number"
                            value={form.number}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor="neighborhood">Bairro</label>
                    <input
                        id="neighborhood"
                        name="neighborhood"
                        value={form.neighborhood}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="reference">Referência</label>
                    <input
                        id="reference"
                        name="reference"
                        value={form.reference}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="complement">Complemento (opcional)</label>
                    <input
                        id="complement"
                        name="complement"
                        value={form.complement}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className={styles.button}>
                    Salvar Endereço
                </button>
            </form>
        </div>
    );
};

export default NewAddress;
