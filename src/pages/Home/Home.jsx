import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts } from "../../api/_index";
import BannerHeader from "../../components/BannerHeader";
import ProductCard from "../../components/ProductCard";
import styles from "./Home.module.css";
import Loader from "../../components/Loader";

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

                setProducts(processed);
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    if (loading) return <Loader />;

    return (
        <>
            <BannerHeader />
            <div className={styles.container}>
                {products.length === 0 ? (
                    <p className={styles.empty}>Nenhum produto encontrado.</p>
                ) : (
                    <div className={styles.grid}>
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onAddToCart={() => {}}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
