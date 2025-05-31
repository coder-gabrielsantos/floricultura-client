import bannerImage from "../assets/banner-header.png";
import logoImage from "../assets/logo-header.png";

const BannerHeader = () => {
    return (
        <div style={styles.wrapper}>
            <div style={styles.inner}>
                <div style={styles.bannerContainer}>
                    <img src={bannerImage} alt="Banner" style={styles.banner} />
                    <img src={logoImage} alt="Logo" style={styles.logo} />
                </div>
                <div style={styles.textArea}>
                    <h1 style={styles.title}>Floricultura Santa Teresinha</h1>
                    <p style={styles.subtitle}>Coelho Neto / MA</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    banner: {
        borderRadius: "16px",
        display: "block",
        height: "100%",
        objectFit: "cover",
        width: "100%",
    },
    bannerContainer: {
        borderRadius: "16px",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.25)",
        height: "200px",
        marginTop: "2rem",
        maxWidth: "1200px",
        position: "relative",
        width: "100%",
    },
    inner: {
        maxWidth: "1200px",
        padding: ".6rem 1rem",
        width: "100%",
    },
    logo: {
        backgroundColor: "#fff",
        border: "4px solid white",
        borderRadius: "50%",
        bottom: "-45px",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.35)",
        height: "90px",
        left: "2.8rem",
        objectFit: "cover",
        position: "absolute",
        width: "90px",
    },
    subtitle: {
        color: "#666",
        fontSize: "1rem",
        margin: 0,
    },
    textArea: {
        paddingTop: "3.5rem",
        textAlign: "center",
    },
    title: {
        color: "#333",
        fontSize: "1.6rem",
        fontWeight: "bold",
        margin: "0.25rem 0",
    },
    wrapper: {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        marginBottom: "2rem",
        width: "100%",
    },
};

export default BannerHeader;
