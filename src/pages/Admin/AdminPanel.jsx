import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders, getAllProducts, deleteProduct } from "../../api/index.js";
import styles from "./AdminPanel.module.css";
import ConfirmModal from "../../components/ConfirmModal.jsx";

const PRODUCTS_PER_PAGE = 4;

const bufferToBase64 = (buffer) => {
    if (!buffer?.data || !Array.isArray(buffer.data)) return null;

    let binary = "";
    const chunkSize = 8192; // evita stack overflow
    for (let i = 0; i < buffer.data.length; i += chunkSize) {
        const chunk = buffer.data.slice(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
    }

    return window.btoa(binary);
};

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [productToDelete, setProductToDelete] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        Promise.all([
            getAllProducts(token),
            getAllOrders(token)
        ])
            .then(([prodList, orderList]) => {
                setProducts(prodList);
                setOrders(orderList);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar dados do painel:", err);
                setLoading(false);
            });
    }, []);

    const paginatedProducts = products.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    const confirmDelete = (product) => {
        setProductToDelete(product);
        setShowConfirmModal(true);
    };

    const handleDelete = async () => {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        try {
            await deleteProduct(productToDelete._id, token);
            setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
        } catch (err) {
            console.error("Erro ao excluir produto:", err);
        } finally {
            setShowConfirmModal(false);
            setProductToDelete(null);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingWrapper}>
                <p className={styles.loading}>Carregando dados do painel...</p>
            </div>
        );
    }

    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

    return (
        <div className={styles.container}>
            <div className={styles.titleRow}>
                <h2 className={styles.title}>Painel do Administrador</h2>
            </div>

            <div className={styles.section}>
                <h3>Pedidos de Clientes</h3>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order._id} className={styles.order}>
                            <div className={styles.orderHeader}>
                                <span className={styles.orderNumber}>Pedido #{order._id}</span>
                                <span className={styles.date}>{order.date}</span>
                            </div>
                            <p className={styles.clientName}>
                                Cliente: {order.client?.name || "Desconhecido"}
                            </p>
                            <ul className={styles.productList}>
                                {order.products.map((item, i) => (
                                    <li key={i} className={styles.productItem}>
                                        {item.product.name} x{item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.orderInfo}>
                                <span className={styles.total}>Total: R$ {order.total?.toFixed(2) || "?"}</span>
                                <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#777" }}>Nenhum pedido encontrado</p>
                )}
            </div>

            <div className={styles.section}>
                <h3>Produtos Cadastrados</h3>

                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((prod) => (
                        <div key={prod._id} className={styles.addressCard}>
                            <div className={styles.productHeader}>
                                <div className={styles.productInfo}>
                                    <h4 className={styles.productName}>{prod.name}</h4>
                                    <p className={styles.productPrice}>
                                        <strong></strong> R$ {prod.price.toFixed(2)}
                                    </p>
                                    <p
                                        className={`${styles.productStock} ${
                                            prod.stock > 0 ? styles.inStock : styles.outOfStock
                                        }`}
                                    >
                                        <strong></strong> {prod.stock} unidade{prod.stock !== 1 ? "s" : ""}
                                    </p>
                                </div>

                                {prod.images?.length > 0 && (
                                    <img
                                        src={`data:${prod.images[0].contentType};base64,${bufferToBase64(prod.images[0].data)}`}
                                        alt="Preview"
                                        className={styles.thumb}
                                    />
                                )}
                            </div>

                            <div className={styles.addressActions}>
                                <button
                                    className={styles.editBtn}
                                    onClick={() => navigate(`/editar-produto/${prod._id}`)}
                                >
                                    Editar
                                </button>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => confirmDelete(prod)}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#777" }}>Nenhum produto cadastrado</p>
                )}

                <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={styles.pageBtn}
                            onClick={() => setCurrentPage(i + 1)}
                            style={{ fontWeight: currentPage === i + 1 ? "bold" : "normal" }}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button
                    className={styles.newProduct}
                    onClick={() => navigate("/novo-produto")}
                >
                    + Adicionar Produto
                </button>
            </div>

            {showConfirmModal && (
                <ConfirmModal
                    message={`Deseja realmente excluir o produto "${productToDelete?.name}"?`}
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
};

export default AdminPanel;
