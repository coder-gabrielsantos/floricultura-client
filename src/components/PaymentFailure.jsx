import { useNavigate } from "react-router-dom";

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>❌ Pagamento não concluído</h1>
            <p style={styles.text}>
                Ocorreu um problema ao processar seu pagamento. Nenhum valor foi cobrado.
            </p>
            <p style={styles.text}>
                Você pode tentar novamente ou entrar em contato com a loja.
            </p>
            <button style={styles.button} onClick={() => navigate("/")}>
                Voltar para a Loja
            </button>
        </div>
    );
};

export default PaymentFailure;

const styles = {
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
    title: {
        color: "#c62828",
        fontSize: "2rem",
        fontWeight: 700
    },
    text: {
        color: "#555",
        fontSize: "1.2rem"
    },
    button: {
        backgroundColor: "#c62828",
        border: "none",
        borderRadius: "8px",
        color: "white",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: 600,
        padding: "0.8rem 2rem"
    }
};
