import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import styles from "./NewProduct.module.css";

const NewProduct = () => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        catalogs: []
    });

    const [catalogs, setCatalogs] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Mock de catálogos por enquanto
        setCatalogs([
            { _id: "maes", name: "Dia das Mães" },
            { _id: "romantico", name: "Romântico" },
            { _id: "aniversario", name: "Aniversário" }
        ]);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm((prev) => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file); // ← converte imagem para base64

            console.log(reader)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/products", form);
            setMessage("Produto criado com sucesso!");
            setForm({ name: "", description: "", price: "", image: "", catalogs: [] });
        } catch (err) {
            console.error(err);
            setMessage("Erro ao criar produto.");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Criar novo produto</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nome do produto"
                    className={styles.input}
                />

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Descrição"
                    className={styles.input}
                />

                <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Preço"
                    className={styles.input}
                />

                <div className={styles.imageInputWrapper}>
                    <label htmlFor="imageInput" className={styles.imageInputLabel}>
                        {form.image ? "Imagem selecionada" : "Clique para escolher uma imagem"}
                    </label>
                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className={styles.hiddenFileInput}
                    />
                </div>

                {form.image && (
                    <img
                        src={form.image}
                        alt="Prévia"
                        className={styles.preview}
                    />
                )}

                <div className={styles.selectContainer}>
                    <label className={styles.selectLabel}>Catálogos</label>
                    <Select
                        isMulti
                        name="catalogs"
                        options={catalogs.map((c) => ({
                            value: c._id,
                            label: c.name
                        }))}
                        value={catalogs
                            .filter((c) => form.catalogs.includes(c._id))
                            .map((c) => ({ value: c._id, label: c.name }))}
                        onChange={(selected) =>
                            setForm((prev) => ({
                                ...prev,
                                catalogs: selected.map((s) => s.value)
                            }))
                        }
                    />
                </div>

                <button type="submit" className={styles.button}>
                    Criar Produto
                </button>
            </form>

            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default NewProduct;
