import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders, getAllProducts } from "../../api";
import styles from "./AdminPanel.module.css";

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
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

    if (loading) {
        return (
            <div className={styles.loadingWrapper}>
                <p className={styles.loading}>Carregando dados do painel...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.titleRow}>
                <h2 className={styles.title}>Painel do Administrador</h2>
            </div>

            <div className={styles.section}>
                <h3>Produtos Cadastrados</h3>

                {products.length > 0 ? (
                    products.map((prod) => (
                        <div key={prod._id} className={styles.addressCard}>
                            <p><strong>{prod.name}</strong></p>
                            <p>Preço: R$ {prod.price.toFixed(2)}</p>
                            <p>Estoque: {prod.stock}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#777" }}>Nenhum produto cadastrado</p>
                )}

                <button
                    className={styles.newProduct}
                    onClick={() => navigate("/novo-produto")}
                >
                    + Adicionar Produto
                </button>
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
                            <p style={{ fontStyle: "italic", marginBottom: "0.5rem" }}>
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
        </div>
    );
};

export default AdminPanel;
