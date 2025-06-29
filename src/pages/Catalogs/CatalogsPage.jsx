import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCatalogs } from "../../api/_index";
import BannerHeader from "../../components/BannerHeader.jsx";
import Loader from "../../components/Loader.jsx";
import defaultCatalogImage from "../../assets/default-catalog.jpeg";
import styles from "./CatalogsPage.module.css";

const CatalogsPage = () => {
    const [catalogs, setCatalogs] = useState([]);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const data = await getCatalogs();

                const defaultCatalog = {
                    _id: "all",
                    name: "Todos os Produtos",
                    image: defaultCatalogImage,
                    products: []
                };

                setCatalogs([defaultCatalog, ...data]);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar catálogos:", err);
                setLoading(false);
            }
        };

        fetchCatalogs();
    }, []);

    const handleClick = (catalogId) => {
        if (catalogId === "all") {
            navigate("/produtos");
        } else {
            navigate(`/produtos?catalog=${catalogId}`);
        }
    };

    const getImage = (catalog) => {
        if (catalog._id === "all") return catalog.image;

        if (catalog.coverImage?.base64 && catalog.coverImage?.contentType) {
            return `data:${catalog.coverImage.contentType};base64,${catalog.coverImage.base64}`;
        }

        const firstProduct = catalog.products?.[0];
        if (!firstProduct?.images?.[0]?.data?.data) return null;

        const byteArray = new Uint8Array(firstProduct.images[0].data.data);
        const binary = byteArray.reduce((data, byte) => data + String.fromCharCode(byte), "");
        const base64 = window.btoa(binary);

        return `data:${firstProduct.images[0].contentType};base64,${base64}`;
    };

    if (loading || !catalogs) return <Loader />;

    return (
        <>
            <BannerHeader />
            <div className={styles.container}>
                <div className={styles.sectionTitle}>
                    <span>Catálogos</span>
                </div>

                <div className={styles.grid}>
                    {catalogs.map((catalog) => (
                        <div
                            key={catalog._id}
                            className={styles.card}
                            onClick={() => handleClick(catalog._id)}
                        >
                            {getImage(catalog) ? (
                                <img
                                    src={getImage(catalog)}
                                    alt={catalog.name}
                                    className={styles.image}
                                />
                            ) : (
                                <div className={styles.placeholder}>Sem imagem</div>
                            )}
                            <h3 className={styles.name}>{catalog.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CatalogsPage;
