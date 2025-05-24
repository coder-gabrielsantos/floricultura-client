import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createAddress, getAddressById, updateAddress } from "../../api";
import styles from "./UserAddress.module.css";

const NewAddress = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const addressId = queryParams.get("id");

    const [form, setForm] = useState({
        street: "",
        number: "",
        neighborhood: "",
        reference: "",
        complement: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (addressId) {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem("user"))?.token;
            getAddressById(addressId, token)
                .then(data => setForm(data))
                .catch(err => console.error("Erro ao carregar endereço:", err))
                .finally(() => setLoading(false));
        }
    }, [addressId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        try {
            if (addressId) {
                await updateAddress(addressId, form, token);
            } else {
                await createAddress(form, token);
            }
            navigate("/perfil");
        } catch (err) {
            console.error("Erro ao salvar endereço:", err);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                {addressId ? "Editar Endereço" : "Novo Endereço"}
            </h2>

            {loading ? (
                <p style={{ textAlign: "center" }}>Carregando...</p>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <div className={`${styles.field} ${styles.streetField}`}>
                            <label htmlFor="street">Rua</label>
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
                        <label htmlFor="complement">Complemento</label>
                        <input
                            id="complement"
                            name="complement"
                            value={form.complement}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className={styles.button}>
                        {addressId ? "Atualizar Endereço" : "Salvar Endereço"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default NewAddress;
