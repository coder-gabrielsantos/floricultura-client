import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { getCatalogs, createProduct, updateProduct, getProductById } from "../../api/_index";
import styles from "./NewProduct.module.css";

const NewProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        images: "",
        catalogs: []
    });

    const [catalogs, setCatalogs] = useState([]);
    const [message, setMessage] = useState("");
    const isEdit = !!id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cats = await getCatalogs();
                setCatalogs(cats);

                if (isEdit) {
                    const token = JSON.parse(localStorage.getItem("user"))?.token;
                    const product = await getProductById(id, token);

                    let imageData = "";

                    if (product.images?.length > 0) {
                        const img = product.images[0];
                        const base64 = btoa(
                            new Uint8Array(img.data.data)
                                .reduce((data, byte) => data + String.fromCharCode(byte), "")
                        );

                        imageData = [{
                            base64,
                            contentType: img.contentType
                        }];
                    }

                    setProductData({
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                        images: imageData,
                        catalogs: product.catalogs?.map((c) => c._id) || []
                    });
                }
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            }
        };

        fetchData();
    }, [isEdit, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const result = reader.result; // ex: data:image/jpeg;base64,/9j/...
                const [meta, base64] = result.split("base64,");
                const contentType = meta.split(":")[1].replace(";", "");

                setProductData((prev) => ({
                    ...prev,
                    images: [{
                        base64,
                        contentType
                    }]
                }));
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        try {
            if (isEdit) {
                await updateProduct(id, productData, token);
            } else {
                await createProduct(productData, token);
            }
            navigate("/painel");
        } catch (err) {
            console.error(err);
            setMessage("Erro ao salvar produto.");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                {isEdit ? "Editar Produto" : "Criar Novo Produto"}
            </h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                    <div className={`${styles.field} ${styles.nameField}`}>
                        <label htmlFor="name">Nome do Produto</label>
                        <input
                            id="name"
                            name="name"
                            value={productData.name}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={`${styles.field} ${styles.stockField}`}>
                        <label htmlFor="stock">Estoque</label>
                        <input
                            id="stock"
                            name="stock"
                            type="number"
                            value={productData.stock}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor="description">Descrição</label>
                    <textarea
                        id="description"
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="price">Preço</label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        value={productData.price}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.imageInputWrapper}>
                    <label htmlFor="imageInput" className={styles.imageInputLabel}>
                        {productData.images ? "Imagem selecionada" : "Clique para escolher uma imagem"}
                    </label>
                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className={styles.hiddenFileInput}
                    />
                </div>

                {productData.images && productData.images.length > 0 && (
                    <img
                        src={`data:${productData.images[0].contentType};base64,${productData.images[0].base64}`}
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
                        value={
                            Array.isArray(productData.catalogs)
                                ? catalogs
                                    .filter((c) => productData.catalogs.includes(c._id))
                                    .map((c) => ({ value: c._id, label: c.name }))
                                : []
                        }
                        onChange={(selected) =>
                            setProductData((prev) => ({
                                ...prev,
                                catalogs: selected.map((s) => s.value)
                            }))
                        }
                    />
                </div>

                <button type="submit" className={styles.button}>
                    {isEdit ? "Atualizar Produto" : "Criar Produto"}
                </button>
            </form>

            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default NewProduct;
