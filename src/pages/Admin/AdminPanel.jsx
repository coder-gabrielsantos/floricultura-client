import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getOrders,
    getAllProducts,
    deleteProduct
} from "../../api/_index.js";
import CatalogManager from "../../components/CatalogManager.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import Loader from "../../components/Loader.jsx";
import styles from "./AdminPanel.module.css";

const PRODUCTS_PER_PAGE = 2;
const ORDERS_PER_PAGE = 2;

const bufferToBase64 = (buffer) => {
    if (!buffer?.data || !Array.isArray(buffer.data)) return null;

    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < buffer.data.length; i += chunkSize) {
        const chunk = buffer.data.slice(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
    }

    return window.btoa(binary);
};

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [productToDelete, setProductToDelete] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentOrderPage, setCurrentOrderPage] = useState(1);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        Promise.all([
            getAllProducts(null, token),
            getOrders(token)
        ])
            .then(([prodList, orderList]) => {
                setProducts(prodList);
                setOrders(orderList);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar dados:", err);
                setLoading(false);
            });
    }, []);

    const paginatedProducts = products.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

    if (loading) return <Loader />;

    return (
        <div className={styles.container}>
            <div className={styles.titleRow}>
                <h2 className={styles.title}>Painel do Administrador</h2>
            </div>

            <div className={styles.section}>
                <h3>Pedidos de Clientes</h3>
                {orders.length > 0 ? (
                    orders
                        .slice()
                        .sort((a, b) => {
                            const toTimestamp = (order) => {
                                const [startHour] = order.timeBlock?.split("h") || ["00"];
                                return new Date(`${order.date}T${startHour.padStart(2, "0")}:00`).getTime();
                            };
                            return toTimestamp(a) - toTimestamp(b);
                        })
                        .slice(
                            (currentOrderPage - 1) * ORDERS_PER_PAGE,
                            currentOrderPage * ORDERS_PER_PAGE
                        )
                        .map((order, index) => {
                            const total = order.products.reduce(
                                (sum, item) => sum + item.product.price * item.quantity,
                                0
                            );

                            return (
                                <div
                                    key={order._id}
                                    className={styles.order}
                                    onClick={() =>
                                        setExpandedOrderId((prev) =>
                                            prev === order._id ? null : order._id
                                        )
                                    }
                                >
                                    <div className={styles.orderHeader}>
                                        <span className={styles.orderNumber}>Pedido #{index + 1}</span>
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
                                        <span className={styles.total}>
                                            Total: R$ {total.toFixed(2)}
                                        </span>
                                        <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    {expandedOrderId === order._id && (
                                        <div className={styles.orderDetails}>
                                            <p><strong>Mensagem no Cartão:</strong> {order.cardMessage || "-"}</p>
                                            <p><strong>Quem irá receber:</strong> {order.receiverName || "-"}</p>
                                            <p><strong>Forma de Pagamento:</strong> {order.paymentMethod}</p>
                                            <p><strong>Horário:</strong> {order.timeBlock}</p>
                                            {order.deliveryType === "entrega" && (
                                                <>
                                                    <p><strong>Endereço:</strong></p>
                                                    <ul className={styles.addressList}>
                                                        <li><strong>Rua:</strong> {order.address?.street}</li>
                                                        <li><strong>Número:</strong> {order.address?.number}</li>
                                                        <li><strong>Bairro:</strong> {order.address?.neighborhood}</li>
                                                        <li><strong>Complemento:</strong> {order.address?.complement}</li>
                                                        <li><strong>Referência:</strong> {order.address?.reference}</li>
                                                    </ul>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                ) : (
                    <p style={{ color: "#777" }}>Nenhum pedido encontrado</p>
                )}

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
                    <button
                        className={styles.pageBtn}
                        disabled={currentOrderPage === 1}
                        onClick={() => setCurrentOrderPage(currentOrderPage - 1)}
                    >
                        Anterior
                    </button>

                    <span style={{ fontWeight: "500", fontSize: "1rem" }}>
                    Página {currentOrderPage}
                </span>

                    <button
                        className={styles.pageBtn}
                        disabled={currentOrderPage === Math.ceil(orders.length / ORDERS_PER_PAGE)}
                        onClick={() => setCurrentOrderPage(currentOrderPage + 1)}
                    >
                        Próximo
                    </button>
                </div>
            </div>

            <CatalogManager />

            <div className={styles.section}>
                <h3>Produtos Cadastrados</h3>

                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((prod) => (
                        <div key={prod._id} className={styles.addressCard}>
                            <div className={styles.productHeader}>
                                <div className={styles.productInfo}>
                                    <h4 className={styles.productName}>{prod.name}</h4>
                                    <p className={styles.productPrice}>R$ {prod.price.toFixed(2)}</p>
                                    <p
                                        className={`${styles.productStock} ${
                                            prod.stock > 0 ? styles.inStock : styles.outOfStock
                                        }`}
                                    >
                                        {prod.stock} unidade{prod.stock !== 1 ? "s" : ""}
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
                                    onClick={() => {
                                        setProductToDelete(prod);
                                        setShowConfirmModal(true);
                                    }}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#777" }}>Nenhum produto cadastrado</p>
                )}

                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                    <button
                        className={styles.pageBtn}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Anterior
                    </button>

                    <span style={{ fontWeight: "500", fontSize: "1rem" }}>
                        Página {currentPage}
                    </span>

                    <button
                        className={styles.pageBtn}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Próximo
                    </button>
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
                    onConfirm={async () => {
                        const token = JSON.parse(localStorage.getItem("user"))?.token;
                        try {
                            await deleteProduct(productToDelete._id, token);
                            setProducts(products.filter((p) => p._id !== productToDelete._id));
                        } catch (err) {
                            console.error("Erro ao excluir produto:", err);
                        } finally {
                            setShowConfirmModal(false);
                            setProductToDelete(null);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default AdminPanel;
