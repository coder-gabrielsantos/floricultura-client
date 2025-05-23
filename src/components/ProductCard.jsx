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
        aspectRatio: "4 / 3",   // ← mantém proporção
        overflow: "hidden"
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
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
        marginBottom: "0.5rem", // ← espaço abaixo do título
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },

    description: {
        fontSize: "0.9rem",
        color: "#555",
        lineHeight: "1.3rem",
        marginBottom: "1rem", // ← espaço abaixo da descrição
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
