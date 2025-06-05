import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🎉 Pagamento confirmado!</h1>
            <p style={styles.text}>
                Seu pedido foi registrado com sucesso. Em breve entraremos em contato caso necessário.
            </p>
            <button style={styles.button} onClick={() => navigate("/perfil")}>
                Ver Meus Pedidos
            </button>
        </div>
    );
};

export default PaymentSuccess;

const styles = {
    button: {
        backgroundColor: "#4caf50",
        border: "none",
        borderRadius: "8px",
        color: "white",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: 600,
        padding: "0.8rem 2rem"
    },
    container: {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        justifyContent: "center",
        margin: "0 auto",
        maxWidth: "600px",
        minHeight: "70vh",
        padding: "3rem 2rem",
        textAlign: "center"
    },
    text: {
        color: "#555",
        fontSize: "1.2rem"
    },
    title: {
        color: "#4caf50",
        fontSize: "2rem",
        fontWeight: 700
    }
};
