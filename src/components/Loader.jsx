const Loader = () => {
    return (
        <div style={styles.wrapper}>
            <div style={styles.spinner}></div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    spinner: {
        animation: "spin 1s linear infinite",
        border: "2px solid #ccc",
        borderTop: "2px solid rgb(4, 4, 4)",
        borderTopColor: "#000000",
        borderRadius: "50%",
        margin: "40px auto",
        width: "34px",
        height: "34px"
    },
};

export default Loader;
