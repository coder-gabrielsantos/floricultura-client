import { useEffect, useState } from "react";
import QuantityModal from "./QuantityModal.jsx";

const ProductCard = ({ product, cart, setCart }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    const [hovered, setHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [alreadyInCart, setAlreadyInCart] = useState(false);

    const mainImage =
        Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : null;

    useEffect(() => {
        if (!cart) return;
        const found = cart.items?.some(
            (item) => item.product._id === product._id
        );
        setAlreadyInCart(found);
    }, [cart, product._id]);

    return (
        <div
            style={{
                ...styles.card,
                backgroundColor: hovered ? "#fffefc" : "#ffffff",
                boxShadow: hovered
                    ? "0 0 18px rgba(0,0,0,0.15)"
                    : "0 0 10px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={styles.imageWrapper}>
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={product.name}
                        style={styles.images}
                    />
                ) : (
                    <div style={styles.imageFallback}>Sem imagem</div>
                )}
            </div>

            <div style={styles.content}>
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.description}>{product.description}</p>
                <div style={styles.footer}>
                    <span style={styles.price}>R$ {product.price.toFixed(2)}</span>
                    {alreadyInCart ? (
                        <div style={styles.inCart}>No carrinho</div>
                    ) : (
                        <button
                            onClick={() => setShowModal(true)}
                            style={{
                                ...styles.button,
                                backgroundColor: isAdmin ? "#ccc" : "#4CAF50",
                                cursor: isAdmin ? "" : "pointer",
                            }}
                            disabled={isAdmin}
                        >
                            Adicionar
                        </button>
                    )}
                </div>
            </div>

            {showModal && (
                <QuantityModal
                    product={product}
                    onClose={() => setShowModal(false)}
                    setCart={setCart}
                />
            )}
        </div>
    );
};

export default ProductCard;

const styles = {
    card: {
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        maxWidth: "320px",
        width: "100%",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease"
    },
    imageWrapper: {
        width: "100%",
        aspectRatio: "4 / 3",
        overflow: "hidden"
    },
    images: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },
    imageFallback: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#f0f0f0",
        color: "#777",
        fontSize: "0.9rem"
    },
    content: {
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        flex: 1
    },
    name: {
        fontSize: "1.1rem",
        fontWeight: 600,
        marginBottom: "0.5rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    description: {
        fontSize: "0.9rem",
        color: "#555",
        lineHeight: "1.3rem",
        marginBottom: "1rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 3
    },
    footer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "auto"
    },
    price: {
        fontFamily: "Nunito, serif",
        color: "#333",
        fontWeight: "bold"
    },
    button: {
        backgroundColor: "#4CAF50",
        border: "none",
        borderRadius: "5px",
        color: "white",
        cursor: "pointer",
        fontSize: "0.9rem",
        padding: "0.5rem 0.8rem"
    },
    inCart: {
        backgroundColor: "#ddd",
        borderRadius: "5px",
        color: "#444",
        fontSize: "0.85rem",
        fontWeight: "bold",
        padding: "0.5rem 0.8rem"
    }
};
