import { useState } from "react";
import { addToCart } from "../api/cart";

const QuantityModal = ({ product, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    const handleConfirm = async () => {
        try {
            await addToCart(product._id, quantity, token);
            onClose();
        } catch (err) {
            console.error("Erro ao adicionar ao carrinho:", err);
        }
    };

    const totalPrice = (product.price * quantity).toFixed(2);

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.name}>{product.name}</h2>
                <p style={styles.description}>{product.description}</p>

                <p style={styles.unitPrice}>Preço unitário: R$ {product.price.toFixed(2)}</p>

                <div style={styles.quantityRow}>
                    <button
                        style={styles.qtyBtn}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        –
                    </button>
                    <div style={styles.qtyValue}>{quantity}</div>
                    <button
                        style={styles.qtyBtn}
                        onClick={() => setQuantity(quantity + 1)}
                    >
                        +
                    </button>
                </div>

                <p style={styles.total}>Total: R$ {totalPrice}</p>

                <div style={styles.actions}>
                    <button onClick={handleConfirm} style={styles.confirm}>Adicionar</button>
                    <button onClick={onClose} style={styles.cancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        left: 0,
        position: "fixed",
        top: 0,
        width: "100vw",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        maxWidth: "380px",
        padding: "2rem",
        textAlign: "center",
        width: "90%",
    },
    image: {
        borderRadius: "16px",
        height: "160px",
        margin: "0 auto 1rem",
        objectFit: "cover",
        width: "160px",
    },
    name: {
        fontSize: "1.4rem",
        fontWeight: "600",
        marginBottom: "0.3rem",
    },
    description: {
        color: "#555",
        fontSize: "0.95rem",
        marginBottom: "0.8rem",
    },
    unitPrice: {
        color: "#4caf50",
        fontWeight: "bold",
        fontSize: "0.95rem",
        marginBottom: "1rem",
    },
    quantityRow: {
        alignItems: "center",
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        marginBottom: "1rem",
    },
    qtyBtn: {
        backgroundColor: "#f3f3f3",
        border: "none",
        borderRadius: "8px",
        color: "#333",
        cursor: "pointer",
        fontSize: "1.2rem",
        height: "38px",
        padding: "0 1rem",
        transition: "background 0.2s",
    },
    qtyValue: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        minWidth: "32px",
        textAlign: "center",
    },
    total: {
        fontSize: "1.1rem",
        fontWeight: "bold",
        marginBottom: "1.2rem",
    },
    actions: {
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
    },
    confirm: {
        backgroundColor: "#4caf50",
        border: "none",
        borderRadius: "10px",
        color: "#fff",
        cursor: "pointer",
        flex: 2,
        fontSize: "1rem",
        fontWeight: "bold",
        padding: "0.7rem 1.6rem",
    },
    cancel: {
        backgroundColor: "#ddd",
        border: "none",
        borderRadius: "10px",
        color: "#444",
        cursor: "pointer",
        flex: 1,
        fontSize: "0.95rem",
        fontWeight: "bold",
        padding: "0.7rem 1rem",
    },
};

export default QuantityModal;
