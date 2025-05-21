import { useState } from "react";

const ProductCard = ({ product, onAddToCart }) => {
    const [hovered, setHovered] = useState(false);

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
                <img src={product.image} alt={product.name} style={styles.image} />
            </div>

            <div style={styles.content}>
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.description}>{product.description}</p>
                <div style={styles.footer}>
                    <span style={styles.price}>R$ {product.price.toFixed(2)}</span>
                    <button onClick={() => onAddToCart(product)} style={styles.button}>
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

const styles = {
    card: {
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        height: "350px",
        overflow: "hidden",
        transition: "all 0.25s ease",
        width: "100%"
    },
    imageWrapper: {
        height: "180px",
        overflow: "hidden",
        width: "100%"
    },
    image: {
        height: "100%",
        objectFit: "cover",
        width: "100%"
    },
    content: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        padding: "1rem",
        flex: 1
    },
    name: {
        fontSize: "1rem",
        fontWeight: 600,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    description: {
        color: "#555",
        display: "-webkit-box",
        fontSize: "0.8rem",
        fontWeight: "500",
        lineHeight: "1.2rem",
        maxHeight: "3.6rem", // 1.2rem * 3 linhas
        overflow: "hidden",
        textOverflow: "ellipsis",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 3,
    },
    footer: {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        marginTop: "auto"
    },
    price: {
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
    }
};
