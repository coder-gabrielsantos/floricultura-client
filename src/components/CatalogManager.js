import { useEffect, useState } from "react";
import {
    getCatalogs,
    createCatalog,
    updateCatalog,
    deleteCatalog
} from "../api/_index.js";
import styles from "../pages/Admin/AdminPanel.module.css";

const CatalogManager = () => {
    const [catalogs, setCatalogs] = useState([]);
    const [newCatalogName, setNewCatalogName] = useState("");
    const [editingCatalog, setEditingCatalog] = useState(null);

    useEffect(() => {
        getCatalogs()
            .then(setCatalogs)
            .catch((err) => console.error("Erro ao buscar catálogos:", err));
    }, []);

    const token = JSON.parse(localStorage.getItem("user"))?.token;

    return (
        <div className={styles.section}>
            <h3>Catálogos</h3>

            <div className={styles.catalogInputRow}>
                <input
                    type="text"
                    value={newCatalogName}
                    placeholder="Nome do novo catálogo"
                    onChange={(e) => setNewCatalogName(e.target.value)}
                    className={styles.catalogInput}
                />
                <button
                    onClick={async () => {
                        if (!newCatalogName.trim()) return;
                        try {
                            const res = await createCatalog({ name: newCatalogName }, token);
                            setCatalogs([...catalogs, res]);
                            setNewCatalogName("");
                        } catch (err) {
                            console.error("Erro ao adicionar catálogo:", err);
                        }
                    }}
                    className={styles.newProduct}
                >
                    + Adicionar
                </button>
            </div>

            {catalogs.length > 0 ? (
                catalogs.map((cat) => (
                    <div key={cat._id} className={styles.addressCard}>
                        {editingCatalog === cat._id ? (
                            <>
                                <input
                                    type="text"
                                    value={cat.name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setCatalogs((prev) =>
                                            prev.map(c => c._id === cat._id ? { ...c, name: value } : c)
                                        );
                                    }}
                                    className={styles.catalogInput}
                                />
                                <div className={styles.addressActions}>
                                    <button
                                        className={styles.editBtn}
                                        onClick={async () => {
                                            try {
                                                const res = await updateCatalog(cat._id, { name: cat.name }, token);
                                                setCatalogs(catalogs.map(c => c._id === cat._id ? res : c));
                                                setEditingCatalog(null);
                                            } catch (err) {
                                                console.error("Erro ao editar catálogo:", err);
                                            }
                                        }}
                                    >
                                        Salvar
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => setEditingCatalog(null)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h4 className={styles.productName}>{cat.name}</h4>
                                <div className={styles.addressActions}>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() => setEditingCatalog(cat._id)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={async () => {
                                            try {
                                                await deleteCatalog(cat._id, token);
                                                setCatalogs(catalogs.filter((c) => c._id !== cat._id));
                                            } catch (err) {
                                                console.error("Erro ao excluir catálogo:", err);
                                            }
                                        }}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))
            ) : (
                <p style={{ color: "#777" }}>Nenhum catálogo cadastrado</p>
            )}
        </div>
    );
};

export default CatalogManager;
