import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts, getCart } from "../../api/_index";
import BannerHeader from "../../components/BannerHeader";
import ProductCard from "../../components/ProductCard";
import styles from "./Home.module.css";
import Loader from "../../components/Loader";

const CATEGORY_CARDS = [
    "Arranjo Floral",
    "Buquê",
    "Casamento",
    "Coroa e Arranjo Fúnebre",
    "Flor Individual",
    "Ramalhete"
];

const bufferToBase64 = (buffer) => {
    if (!buffer) return null;
    const binary = new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
    );
    return window.btoa(binary);
};

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [cart, setCart] = useState(null);

    const categoryParam = searchParams.get("category");
    const catalogParam = searchParams.get("catalog");
    const isBrowsingAll = !categoryParam && !catalogParam;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const catalogId = searchParams.get("catalog");
                const data = await getAllProducts(catalogId);

                const processed = data.map((product) => {
                    const images = (product.images || [])
                        .map((img) => {
                            const base64 = bufferToBase64(img.data?.data);
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

                if (categoryParam) {
                    const filtered = processed.filter((p) => p.category === categoryParam);
                    setProducts(filtered);
                } else {
                    setProducts(processed);
                }
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        if (!token) return;
        getCart(token).then(setCart);
    }, []);

    if (loading) return <Loader />;

    return (
        <>
            <BannerHeader />
            <div className={styles.container}>
                {isBrowsingAll ? (
                    <div className={styles.grid}>
                        {CATEGORY_CARDS.map((cat) => (
                            <div
                                key={cat}
                                className={styles.categoryCard}
                                onClick={() => {
                                    const params = new URLSearchParams();
                                    params.set("category", cat);
                                    window.history.pushState({}, "", `/produtos?${params.toString()}`);
                                    window.dispatchEvent(new Event("popstate"));
                                }}
                            >
                                <p>{cat}</p>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <p className={styles.empty}>Nenhum produto encontrado.</p>
                ) : (
                    <div className={styles.grid}>
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                cart={cart}
                                setCart={setCart}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
