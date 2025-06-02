import bannerImage from "../assets/banner-header.png";
import logoImage from "../assets/logo-header.png";
import styles from "./BannerHeader.module.css";

const BannerHeader = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles["banner-container"]}>
                    <img src={bannerImage} alt="Banner" className={styles.banner} />
                    <img src={logoImage} alt="Logo" className={styles.logo} />
                </div>
                <div className={styles.textArea}>
                    <h1 className={styles.title}>Floricultura Santa Teresinha</h1>
                    <p className={styles.subtitle}>Loja Virtual - Coelho Neto / MA</p>
                </div>
            </div>
        </div>
    );
};

export default BannerHeader;
