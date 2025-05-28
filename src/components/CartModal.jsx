import { useEffect, useState } from "react";
import { Trash, XmarkSquare } from "iconoir-react";
import { getCart } from "../api/_index.js";

const mockCart = {
    items: [
        {
            product: { _id: "1", name: "Buquê Rosas Vermelhas", price: 79.9 },
            quantity: 1
        },
        {
            product: { _id: "2", name: "Orquídea Branca", price: 64.5 },
            quantity: 2
        }
    ]
};

const CartModal = ({ onClose }) => {
    const [cart, setCart] = useState(null);
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            onClose();
        }, 300); // mesmo tempo da animação
    };

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
        
            @keyframes slideDown {
              from { opacity: 1; transform: translateY(0); }
              to { opacity: 0; transform: translateY(30px); }
            }
        
            @keyframes fadeInOverlay {
              from { opacity: 0; }
              to { opacity: 1; }
            }
        
            @keyframes fadeOutOverlay {
              from { opacity: 1; }
              to { opacity: 0; }
            }
          `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    useEffect(() => {
        setCart(mockCart);
        // getCart(token).then(setCart).catch(console.error);
    }, []);

    const total = cart?.items?.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
    );

    return (
        <div style={{
            ...styles.overlay,
            animation: `${closing ? "fadeOutOverlay" : "fadeInOverlay"} 0.3s ease`
        }} onClick={handleClose}>
            <div style={{
                ...styles.modal,
                animation: `${closing ? "slideDown" : "slideUp"} 0.3s ease`
            }} onClick={(e) => e.stopPropagation()}>
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
                    <button style={styles.button}>Finalizar Pedido</button>
                </div>
            </div>
        </div>
    );
};

export default CartModal;

const styles = {
    header: {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1.5rem"
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
    card: {
        backgroundColor: "#f9f9f9",
        border: "1px solid #eee",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem",
        position: "relative"
    },
    actions: {
        alignItems: "center",
        display: "flex",
        gap: "1rem"
    },
    content: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxHeight: "300px",
        overflowY: "auto"
    },
    details: {
        color: "#666",
        fontSize: "0.9rem",
        marginTop: "0.25rem"
    },
    empty: {
        color: "#777",
        fontSize: "0.95rem",
        textAlign: "center"
    },
    footer: {
        borderTop: "1px solid #ddd",
        marginTop: "1.5rem",
        paddingTop: "1rem"
    },
    info: {
        display: "flex",
        flexDirection: "column"
    },
    modal: {
        animation: "slideUp 0.3s ease",
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
        maxHeight: "90vh",
        maxWidth: "600px",
        padding: "2rem",
        position: "relative",
        width: "100%"
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
    overlay: {
        alignItems: "center",
        animation: "fadeInOverlay 0.3s ease",
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
    closeBtn: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "1.4rem",
        padding: "0 0 0 10px"
    },
    title: {
        fontSize: "1.5rem",
        fontWeight: 600,
        textAlign: "center"
    },
    totalLine: {
        alignItems: "center",
        display: "flex",
        fontSize: "1.1rem",
        justifyContent: "space-between"
    }
};
