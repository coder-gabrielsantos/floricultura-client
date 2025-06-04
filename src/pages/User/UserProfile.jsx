import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, deleteAddress, getOrders, updateProfile, startPayment } from "../../api/_index.js";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import Loader from "../../components/Loader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { LogOut } from "iconoir-react";
import styles from "./UserProfile.module.css";

const ORDERS_PER_PAGE = 2;
const UserProfile = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [showEditModal, setShowEditModal] = useState(false);
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [passwordError, setPasswordError] = useState("");

    const paginatedOrders = orders.slice(
        (currentPage - 1) * ORDERS_PER_PAGE,
        currentPage * ORDERS_PER_PAGE
    );

    const [editData, setEditData] = useState({
        name: "",
        phone: "",
        currentPassword: "",
        newPassword: ""
    });

    const handleUpdateProfile = async () => {
        setPasswordError("");

        if (editData.newPassword && !editData.currentPassword) {
            setPasswordError("Informe sua senha atual para alterar a senha");
            return;
        }

        try {
            await updateProfile(editData);
            const updated = await getUserData();
            setProfile(updated);
            setShowEditModal(false);
        } catch (err) {
            const msg = err.response?.data?.message || "Erro ao atualizar";

            if (msg.toLowerCase().includes("incorrect") || msg.toLowerCase().includes("senha atual incorreta")) {
                setPasswordError("Senha atual incorreta");
            } else {
                setPasswordError(msg);
            }
        }
    };

    const handlePayment = async (order) => {
        try {
            const amount = order.products.reduce(
                (sum, item) => sum + (item.product?.price || 0) * item.quantity,
                0
            );

            const data = await startPayment({
                referenceId: order._id,
                amount,
                buyerName: profile.name,
                buyerEmail: profile.email || "teste@sandbox.pagseguro.com.br", // ou use o e-mail real se disponível
                buyerPhone: profile.phone.replace(/\D/g, "") || "999999999", // remove caracteres não numéricos
            });

            if (data.redirectURL) {
                window.location.href = data.redirectURL;
            } else {
                alert("Falha ao redirecionar para o PagBank.");
            }
        } catch (err) {
            console.error("Erro ao iniciar pagamento:", err);
            alert("Erro ao processar pagamento.");
        }
    };

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        getUserData()
            .then(async (data) => {
                setProfile(data);

                setEditData({
                    name: data.name || "",
                    phone: data.phone || "",
                    currentPassword: "",
                    newPassword: ""
                });

                const pedidos = await getOrders(token);
                setOrders(pedidos);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar usuário:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <Loader/>;

    return (
        <div className={styles.container}>
            <div className={styles.titleRow}>
                <h2 className={styles.title}>
                    Minha Conta {profile.role === "admin" &&
                    <span style={{ fontWeight: 400, fontStyle: "italic" }}> - adm</span>}
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
                <div className={styles.titleWithButton}>
                    <h3 className={styles.subtitle}>Meus Dados</h3>
                    <button className={styles.editUserBtn} onClick={() => setShowEditModal(true)}>
                        Editar dados
                    </button>
                </div>

                <p><strong>Nome:</strong> {profile.name}</p>
                <p><strong>WhatsApp:</strong> {profile.phone}</p>
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
                            {paginatedOrders.map((order) => (
                                <div
                                    key={order._id}
                                    className={styles.orderCard}
                                    onClick={() =>
                                        setExpandedOrderId(expandedOrderId === order._id ? null : order._id)
                                    }
                                >
                                    <header className={styles.orderHeader}>
                                        <h4>
                                            {new Date(order.date).toLocaleDateString()} - {order.timeBlock}
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
                                        Total: R$ {order.products
                                        .reduce(
                                            (sum, item) => sum + (item.product?.price || 0) * item.quantity,
                                            0
                                        )
                                        .toFixed(2)}
                                    </span>

                                    {expandedOrderId === order._id ? (
                                        <>
                                            <div className={styles.orderDetails}>
                                                <div className={styles.detailRow}>
                                                    <strong>Destinatário:</strong> {order.receiverName}
                                                </div>

                                                {order.address && (
                                                    <div className={styles.detailRow}>
                                                        <strong>Endereço:</strong><br/>
                                                        {order.address.street}, {order.address.number} – {order.address.neighborhood}
                                                        {order.address.complement && `, ${order.address.complement}`}
                                                        {order.address.reference && (
                                                            <>
                                                                <br/>
                                                                <em>{order.address.reference}</em>
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                <div className={styles.detailRow}>
                                                    <strong>Forma de pagamento:</strong> {order.paymentMethod}
                                                </div>
                                            </div>

                                            {order.status === "pendente" && (
                                                <div className={styles.paymentAction}>
                                                    <button
                                                        className={styles.payBtn}
                                                        onClick={() => handlePayment(order)}
                                                    >
                                                        Realizar Pagamento (em breve)
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className={styles.clickHint}>Clique para ver mais detalhes</p>
                                    )}
                                </div>
                            ))}

                            <div className={styles.pagination}>
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={styles.pageBtn}
                                >
                                    Anterior
                                </button>

                                <span>Página {currentPage}</span>

                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage >= Math.ceil(orders.length / ORDERS_PER_PAGE)}
                                    className={styles.pageBtn}
                                >
                                    Próximo
                                </button>
                            </div>

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

            {showEditModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalBox}>
                        <h3 className={styles.modalTitle}>Editar Dados</h3>

                        <input
                            type="text"
                            placeholder="Nome"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className={styles.modalInput}
                        />

                        <input
                            type="text"
                            placeholder="Telefone"
                            value={editData.phone}
                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                            className={styles.modalInput}
                        />

                        <input
                            type="password"
                            placeholder="Nova senha (opcional)"
                            value={editData.newPassword}
                            onChange={(e) => setEditData({ ...editData, newPassword: e.target.value })}
                            className={styles.modalInput}
                        />

                        {editData.newPassword && (
                            <input
                                type="password"
                                placeholder="Informe a senha atual"
                                value={editData.currentPassword}
                                onChange={(e) => setEditData({ ...editData, currentPassword: e.target.value })}
                                className={`${styles.modalInput} ${styles.fadeIn}`}
                            />
                        )}

                        {passwordError && (
                            <p className={styles.errorMsg}>{passwordError}</p>
                        )}

                        <div className={styles.modalActionsColumn}>
                            <button className={styles.modalBtn} onClick={handleUpdateProfile}>
                                Salvar
                            </button>
                            <button className={styles.cancelBtn} onClick={() => setShowEditModal(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
