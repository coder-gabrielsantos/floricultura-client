const ConfirmModal = ({ onClose, onConfirm, message }) => {
    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 style={styles.title}>Confirmação</h2>
                <p style={styles.text}>{message}</p>
                <div style={styles.buttons}>
                    <button style={styles.cancel} onClick={onClose}>Cancelar</button>
                    <button style={styles.confirm} onClick={onConfirm}>Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

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
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        padding: "2rem",
        textAlign: "center",
        width: "100%"
    },
    title: {
        fontSize: "1.4rem",
        fontWeight: "600",
        marginBottom: "1rem"
    },
    text: {
        color: "#444",
        fontSize: "1rem",
        marginBottom: "1.5rem"
    },
    buttons: {
        display: "flex",
        gap: "1rem",
        justifyContent: "center"
    },
    cancel: {
        backgroundColor: "#eee",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: 500,
        padding: "0.6rem 1.2rem"
    },
    confirm: {
        backgroundColor: "#c62828",
        border: "none",
        borderRadius: "8px",
        color: "white",
        cursor: "pointer",
        fontWeight: 500,
        padding: "0.6rem 1.2rem"
    }
};
