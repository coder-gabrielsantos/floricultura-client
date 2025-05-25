import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, deleteAddress, getAllOrders } from "../../api";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { LogOut } from "iconoir-react";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(null);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        getUserData()
            .then(async (data) => {
                setProfile(data);
                if (data.role === "admin") {
                    const pedidos = await getAllOrders(token);
                    setOrders(pedidos);
                } else {
                    setOrders(data.orders || []);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar usuário:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingWrapper}>
                <p className={styles.loading}>Carregando...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.titleRow}>
                <h2 className={styles.title}>
                    Minha Conta {profile.role === "admin" &&
                    <span style={{ fontWeight: 400 }}>(Adm)</span>}
                </h2>
                <button
                    className={styles.logoutButton}
                    onClick={() => {
                        logout();
                        navigate("/");
                        window.location.reload();
                    }}
                >
                    <LogOut style={{ marginRight: "0.5rem" }} />
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

            <div className={styles.section}>
                <h3>{profile.role === "admin" ? "Pedidos de Clientes" : "Meus Pedidos"}</h3>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order._id} className={styles.order}>
                            <div className={styles.orderHeader}>
                                <span className={styles.orderNumber}>Pedido #{order._id}</span>
                                <span className={styles.date}>{order.date}</span>
                                {profile.role === "admin" && order.client?.name && (
                                    <span className={styles.clientName}>Cliente: {order.client.name}</span>
                                )}
                            </div>
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
                    <p style={{ color: "#777", marginTop: "1rem" }}>
                        Nenhum pedido encontrado.
                    </p>
                )}
            </div>

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
