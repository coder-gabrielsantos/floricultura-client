import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import Select from "react-select";
import styles from "./Home.module.css";
import { getAllProducts } from "../../api";

const bufferToBase64 = (buffer) => {
    if (!buffer?.data || !Array.isArray(buffer.data)) return null;

    const binary = buffer.data.map(byte => String.fromCharCode(byte)).join("");
    return window.btoa(binary);
};

const mockCatalogs = [
    { _id: "all", name: "Todos os catálogos" },
    { _id: "romantico", name: "Romântico" },
    { _id: "aniversario", name: "Aniversário" },
    { _id: "maes", name: "Dia das Mães" }
];

const Home = () => {
    const [products, setProducts] = useState([]);
    const [selectedCatalog, setSelectedCatalog] = useState("all");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllProducts();

                const processed = data.map((product) => {
                    const images = (product.images || [])
                        .map((img) => {
                            const base64 = bufferToBase64(img.data);
                            return base64
                                ? `data:${img.contentType};base64,${base64}`
                                : null;
                        })
                        .filter(Boolean);

                    return {
                        ...product,
                        images
                    };
                });

                setProducts(processed);
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
            }
        };

        fetchData();
    }, []);

    const filteredProducts =
        selectedCatalog === "all"
            ? products
            : products.filter((p) => p.catalogs?.includes(selectedCatalog));

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Flores para todas as ocasiões</h1>

                    <div className={styles.selectWrapper}>
                        <Select
                            options={mockCatalogs.map((c) => ({
                                value: c._id,
                                label: c.name
                            }))}
                            value={mockCatalogs.find((c) => c._id === selectedCatalog)}
                            onChange={(option) => setSelectedCatalog(option.value)}
                            className={styles.select}
                            classNamePrefix="react-select"
                            isSearchable={false}
                        />
                    </div>
                </div>

                <div className={styles.grid}>
                    {filteredProducts.map((p) => (
                        <ProductCard
                            key={p._id}
                            product={p}
                            onAddToCart={() => {}}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
