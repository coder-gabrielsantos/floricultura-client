import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash, XmarkSquare } from "iconoir-react";
import { getCart, removeFromCart } from "../api/_index.js";

const CartModal = ({ onClose }) => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [visible, setVisible] = useState(false);

    const token = JSON.parse(localStorage.getItem("user"))?.token;

    useEffect(() => {
        setVisible(true);

        if (!token) return;
        getCart(token)
            .then(setCart)
            .catch((err) => console.error("Erro ao buscar carrinho:", err));
    }, []);

    const removeItem = async (productId) => {
        try {
            await removeFromCart(productId, token);
            const updatedCart = await getCart(token);
            setCart(updatedCart);
            navigate(0);
        } catch (err) {
            console.error("Erro ao remover item:", err);
        }
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 250);
    };

    const total = cart?.items?.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
    );

    return (
        <div
            style={{
                ...styles.overlay,
                opacity: visible ? 1 : 0,
                transition: "opacity 0.3s ease"
            }}
            onClick={handleClose}
        >
            <div
                style={{
                    ...styles.modal,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "scale(1)" : "scale(0.95)",
                    transition: "opacity 0.3s ease, transform 0.3s ease"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={styles.header}>
                    <h2 style={styles.title}>Meu Carrinho</h2>
                    <button style={styles.closeBtn} onClick={handleClose}>
                        <XmarkSquare />
                    </button>
                </div>

                <div style={styles.content}>
                    {cart?.items?.length > 0 ? (
                        cart.items.map((item) => (
                            <div key={item.product._id} style={styles.card}>
                                <div style={styles.info}>
                                    <p style={styles.name}>{item.product.name}</p>
                                    <p style={styles.details}>
                                        Qtd: {item.quantity} × R$ {item.product.price.toFixed(2)}
                                    </p>
                                </div>

                                <div style={styles.actions}>
                                    <p style={styles.price}>
                                        R$ {(item.quantity * item.product.price).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => removeItem(item.product._id)}
                                        style={styles.removeBtn}
                                    >
                                        <Trash />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={styles.empty}>Sua sacola está vazia.</p>
                    )}
                </div>

                <div style={styles.footer}>
                    <div style={styles.totalLine}>
                        <span>Total</span>
                        <strong>R$ {total?.toFixed(2) || "0,00"}</strong>
                    </div>
                    <button
                        onClick={() => {
                            if (!cart?.items?.length) {
                                alert("Sua sacola está vazia!");
                                return;
                            }
                            handleClose();
                            navigate("/checkout");
                        }}
                        style={{
                            ...styles.button,
                            backgroundColor: cart?.items?.length ? "#4caf50" : "#ccc",
                            cursor: cart?.items?.length ? "pointer" : ""
                        }}
                        disabled={!cart?.items?.length}
                    >
                        Finalizar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartModal;

const styles = {
    overlay: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        left: 0,
        position: "fixed",
        top: 0,
        width: "100vw",
        zIndex: 999
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
        maxHeight: "90vh",
        maxWidth: "600px",
        padding: "2rem",
        position: "relative",
        width: "100%"
    },
    header: {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1.5rem"
    },
    title: {
        fontSize: "1.5rem",
        fontWeight: 600,
        textAlign: "center"
    },
    closeBtn: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "1.4rem",
        padding: "0 0 0 10px"
    },
    content: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxHeight: "300px",
        overflowY: "auto"
    },
    card: {
        backgroundColor: "#f9f9f9",
        border: "1px solid #eee",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem",
        position: "relative"
    },
    info: {
        display: "flex",
        flexDirection: "column"
    },
    name: {
        fontSize: "1rem",
        fontWeight: 600,
        marginBottom: 0,
        maxWidth: "250px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    details: {
        color: "#666",
        fontSize: "0.9rem",
        marginTop: "0.25rem"
    },
    actions: {
        alignItems: "center",
        display: "flex",
        gap: "1rem"
    },
    price: {
        fontSize: "1rem",
        fontWeight: 600
    },
    removeBtn: {
        alignItems: "center",
        backgroundColor: "#ffe5e5",
        border: "none",
        borderRadius: "8px",
        color: "#c62828",
        cursor: "pointer",
        display: "flex",
        fontSize: "1.2rem",
        height: "100%",
        justifyContent: "center",
        padding: "0 0.75rem"
    },
    footer: {
        borderTop: "1px solid #ddd",
        marginTop: "1.5rem",
        paddingTop: "1rem"
    },
    totalLine: {
        alignItems: "center",
        display: "flex",
        fontSize: "1.1rem",
        justifyContent: "space-between"
    },
    button: {
        backgroundColor: "#4caf50",
        border: "none",
        borderRadius: "10px",
        color: "white",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: 500,
        marginTop: "1rem",
        padding: "0.75rem",
        width: "100%"
    },
    empty: {
        color: "#777",
        fontSize: "0.95rem",
        textAlign: "center"
    }
};
