import { useEffect, useState } from "react";
import { Xmark } from "iconoir-react";
import {
    getCatalogs,
    createCatalog,
    deleteCatalog,
    updateCatalog
} from "../api/_index.js";

const CatalogManager = () => {
    const [catalogs, setCatalogs] = useState([]);
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
        getCatalogs()
            .then(setCatalogs)
            .catch((err) => console.error("Erro ao buscar catálogos:", err));
    }, []);

    const token = JSON.parse(localStorage.getItem("user"))?.token;

    const addCatalog = async () => {
        if (!newName.trim()) return;
        try {
            const res = await createCatalog({ name: newName }, token);
            setCatalogs([...catalogs, res]);
            setNewName("");
        } catch (err) {
            console.error("Erro ao adicionar catálogo:", err);
        }
    };

    const removeCatalog = async (id) => {
        try {
            await deleteCatalog(id, token);
            setCatalogs(catalogs.filter((c) => c._id !== id));
        } catch (err) {
            console.error("Erro ao excluir catálogo:", err);
        }
    };

    const startEditing = (id, name) => {
        setEditingId(id);
        setEditingName(name);
    };

    const saveEdit = async () => {
        try {
            const res = await updateCatalog(editingId, { name: editingName }, token);
            setCatalogs(catalogs.map(c => c._id === editingId ? res : c));
        } catch (err) {
            console.error("Erro ao editar catálogo:", err);
        } finally {
            setEditingId(null);
            setEditingName("");
        }
    };

    const handleCoverChange = (e, id) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result.split(",")[1];
            const updatedCatalogs = catalogs.map((c) =>
                c._id === id
                    ? { ...c, coverImage: { base64, contentType: file.type } }
                    : c
            );
            setCatalogs(updatedCatalogs);

            // ✅ Salva diretamente no backend
            try {
                await updateCatalog(id, {
                    coverImage: { base64, contentType: file.type },
                }, token);
            } catch (err) {
                console.error("Erro ao salvar capa do catálogo:", err);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div style={styles.section}>
            <h3 style={styles.heading}>Catálogos</h3>

            <div style={styles.inputRow}>
                <input
                    type="text"
                    placeholder="Nome do Catálogo"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    style={{
                        ...styles.input,
                        border: `1px solid ${isInputFocused ? "#4caf50" : "#ccc"}`
                    }}
                />
                <button onClick={addCatalog} style={styles.addBtn}>
                    + Adicionar
                </button>
            </div>

            <div style={styles.tagList}>
                {catalogs.map((cat) => (
                    <div key={cat._id} style={styles.tag}>
                        <div
                            style={styles.cover}
                            onClick={() =>
                                document.getElementById(`coverInput-${cat._id}`).click()
                            }
                        >
                            {cat.coverImage?.base64 ? (
                                <img
                                    src={`data:${cat.coverImage.contentType};base64,${cat.coverImage.base64}`}
                                    alt="Capa"
                                    style={styles.coverImage}
                                />
                            ) : (
                                <span style={styles.noCover}>...</span>
                            )}
                            <input
                                id={`coverInput-${cat._id}`}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => handleCoverChange(e, cat._id)}
                            />
                        </div>

                        {editingId === cat._id ? (
                            <>
                                <input
                                    autoFocus
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") saveEdit();
                                        if (e.key === "Escape") setEditingId(null);
                                    }}
                                    style={styles.tagEditInput}
                                    value={editingName}
                                />
                                <button onClick={saveEdit} style={styles.tagSave}>
                                    Salvar
                                </button>
                            </>
                        ) : (
                            <>
                                <span
                                    onClick={() => startEditing(cat._id, cat.name)}
                                    style={styles.tagName}
                                >
                                    {cat.name}
                                </span>
                                <button
                                    onClick={() => removeCatalog(cat._id)}
                                    style={styles.tagRemove}
                                >
                                    <Xmark style={styles.icon} />
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    addBtn: {
        backgroundColor: "#4caf50",
        border: "none",
        borderRadius: "8px",
        color: "white",
        cursor: "pointer",
        fontWeight: "500",
        padding: "0.6rem 1rem",
    },
    cover: {
        alignItems: "center",
        backgroundColor: "#ddd",
        borderBottomLeftRadius: "6px",   // arredonda só lado esquerdo
        borderTopLeftRadius: "6px",
        cursor: "pointer",
        display: "flex",
        height: "48px",
        justifyContent: "center",
        overflow: "hidden",
        width: "48px",
    },
    coverImage: {
        height: "100%",
        objectFit: "cover",
        width: "100%",
    },
    heading: {
        color: "#4caf50",
        fontSize: "1.2rem",
        marginBottom: "1rem",
    },
    icon: {
        fontSize: ".8rem"
    },
    input: {
        borderRadius: "8px",
        flex: 1,
        fontSize: "1rem",
        padding: "0.8rem",
        transition: "border-color 0.2s ease",
    },
    inputRow: {
        display: "flex",
        gap: "1rem",
        marginBottom: "1rem",
    },
    noCover: {
        color: "#666",
        fontSize: "0.55rem",
    },
    section: {
        borderTop: "1px solid rgba(0, 0, 0, 0.16)",
        marginBottom: "2rem",
        paddingTop: "2rem",
    },
    tag: {
        alignItems: "center",
        backgroundColor: "#eee",
        borderRadius: "6px",
        display: "flex",
        fontSize: "0.95rem",
        gap: "0.5rem",
        height: "48px",                   // altura maior
        margin: 0,
        paddingLeft: 0,                   // para alinhar com a capa
        paddingRight: "0.75rem",
    },
    tagEditInput: {
        background: "transparent",
        border: "none",
        color: "#333",
        display: "inline",
        flex: 1,
        fontFamily: "inherit",
        fontSize: "0.95rem",
        height: "100%",
        lineHeight: "1",
        margin: 0,
        minWidth: "60px",
        outline: "none",
        padding: 0,
        verticalAlign: "middle",
    },
    tagList: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
    },
    tagName: {
        color: "#333",
        cursor: "pointer",
        lineHeight: "1",
        margin: "0 20px 0 5px"
    },
    tagRemove: {
        background: "none",
        border: "none",
        color: "#444",
        cursor: "pointer",
        display: "flex",
        fontSize: "1rem",
        fontWeight: "bold",
        lineHeight: "1",
        padding: 0,
    },
    tagSave: {
        alignItems: "center",
        backgroundColor: "#4caf50",
        border: "none",
        borderRadius: "6px",
        color: "#fff",
        cursor: "pointer",
        display: "inline-flex",
        fontSize: "0.85rem",
        height: "26px",
        lineHeight: "1",
        padding: "0.2rem 0.6rem",
    },
};

export default CatalogManager;
