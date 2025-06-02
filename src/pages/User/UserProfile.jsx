import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, deleteAddress, getOrders } from "../../api/_index.js";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import Loader from "../../components/Loader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { LogOut } from "iconoir-react";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(null);

    const toggleOrder = (id) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        getUserData()
            .then(async (data) => {
                setProfile(data);
                const pedidos = await getOrders(token);
                setOrders(pedidos);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar usuário:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <Loader />;

    return (
        <div className={styles.container}>
            <div className={styles.titleRow}>
                <h2 className={styles.title}>
                    Minha Conta {profile.role === "admin" &&
                    <span style={{ fontWeight: 400, fontStyle: "italic" }}> - adm</span>
                }
                </h2>
                <button
                    className={styles.logoutButton}
                    onClick={() => {
                        logout();
                        navigate("/");
                        window.location.reload();
                    }}
                >
                    <LogOut style={{ marginRight: "0.5rem" }}/>
                    Sair da conta
                </button>
            </div>

            <div className={styles.section}>
                <h3>Meus Dados</h3>
                <p><strong>Nome:</strong> {profile.name}</p>
                <p>
                    <strong>{profile.email ? "Email:" : "Telefone:"}</strong> {profile.email || profile.phone}
                </p>
            </div>

            {profile.role !== "admin" && (
                <div className={styles.section}>
                    <h3>Meus Endereços</h3>
                    {profile.addresses && profile.addresses.length > 0 ? (
                        profile.addresses.map((addr, i) => (
                            <div key={i} className={styles.addressCard}>
                                <div className={styles.addressTop}>
                                    <div className={styles.addressContent}>
                                        <p>{addr.street}, {addr.number}</p>
                                        <p>Bairro: {addr.neighborhood}</p>
                                        <p>Referência: {addr.reference}</p>
                                        {addr.complement && (
                                            <p>Complemento: {addr.complement}</p>
                                        )}
                                    </div>
                                    <span className={styles.addressIndex}>Endereço #{i + 1}</span>
                                </div>

                                <div className={styles.addressActions}>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() => navigate(`/endereco?id=${addr._id}`)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => setConfirming(addr._id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: "#777", marginTop: "1rem" }}>
                            Nenhum endereço cadastrado.
                        </p>
                    )}
                    <button className={styles.addAddress} onClick={() => navigate("/endereco")}>
                        + Adicionar Endereço
                    </button>
                </div>
            )}

            {profile.role !== "admin" && (
                <div className={styles.section}>
                    <h3 className={styles.subtitle}>Meus Pedidos</h3>

                    {orders.length === 0 ? (
                        <p className={styles.noData}>Nenhum pedido encontrado.</p>
                    ) : (
                        <div className={styles.ordersList}>
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    className={styles.orderCard}
                                    onClick={() =>
                                        setExpandedOrderId(expandedOrderId === order._id ? null : order._id)
                                    }
                                >
                                    <header className={styles.orderHeader}>
                                        <h4>
                                            Pedido para o dia {new Date(order.date).toLocaleDateString()} -{" "}
                                            {order.timeBlock}
                                        </h4>
                                        <span className={styles.status}>{order.status}</span>
                                    </header>

                                    <ul className={styles.productList}>
                                        {order.products.map((item, i) => (
                                            <li key={i}>
                                                {item.product?.name || "Produto"} x{item.quantity}
                                            </li>
                                        ))}
                                    </ul>

                                    <span className={styles.total}>
                                        Total: R${" "}
                                        {order.products
                                            .reduce(
                                                (sum, item) =>
                                                    sum + (item.product?.price || 0) * item.quantity,
                                                0
                                            )
                                            .toFixed(2)}
                                     </span>

                                    {expandedOrderId === order._id ? (
                                        <div className={styles.orderDetails}>
                                            <div className={styles.detailRow}>
                                                <strong>Destinatário:</strong> {order.receiverName}
                                            </div>

                                            {order.address && (
                                                <div className={styles.detailRow}>
                                                    <strong>Endereço:</strong><br />
                                                    {order.address.street}, {order.address.number} – {order.address.neighborhood}
                                                    {order.address.complement && `, ${order.address.complement}`}
                                                    {order.address.reference && (
                                                        <>
                                                            <br />
                                                            <em>{order.address.reference}</em>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            <div className={styles.detailRow}>
                                                <strong>Forma de pagamento:</strong> {order.paymentMethod}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className={styles.clickHint}>Clique para ver mais detalhes</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {confirming && (
                <ConfirmModal
                    message="Deseja realmente excluir este endereço?"
                    onClose={() => setConfirming(null)}
                    onConfirm={async () => {
                        const token = JSON.parse(localStorage.getItem("user"))?.token;
                        try {
                            await deleteAddress(confirming, token);
                            const updated = await getUserData();
                            setProfile(updated);
                            setConfirming(null);
                        } catch (err) {
                            console.error("Erro ao excluir endereço:", err);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default UserProfile;
