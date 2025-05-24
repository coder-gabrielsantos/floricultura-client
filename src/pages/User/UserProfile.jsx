import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
    const { user } = useAuth();
    const [expanded, setExpanded] = useState(null);

    const orders = [
        {
            id: "1",
            date: "2024-12-01",
            total: 89.9,
            status: "Entregue",
            products: ["Buquê Girassol", "Orquídea Mini"]
        },
        {
            id: "2",
            date: "2024-11-10",
            total: 45.0,
            status: "Aguardando pagamento",
            products: ["Ramalhete Clássico"]
        }
    ];

    const addresses = [
        {
            street: "Rua das Flores",
            number: "123",
            neighborhood: "Jardim",
            reference: "Próximo à padaria",
            complement: "Apto 202",
            receiver: "Maria Silva"
        },
        {
            street: "Av. Central",
            number: "456",
            neighborhood: "Centro",
            reference: "Em frente ao mercado",
            complement: "",
            receiver: "João Oliveira"
        }
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Minha Conta</h2>

            <div className={styles.section}>
                <h3>Meus Dados</h3>
                <p><strong>Nome:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email || user?.identifier}</p>
            </div>

            <div className={styles.section}>
                <h3>Meus Endereços</h3>

                {addresses.map((addr, i) => (
                    <div key={i} className={styles.addressCard}>
                        <p><strong>Rua:</strong> {addr.street}, {addr.number}</p>
                        <p><strong>Bairro:</strong> {addr.neighborhood}</p>
                        <p><strong>Referência:</strong> {addr.reference}</p>
                        {addr.complement && (
                            <p><strong>Complemento:</strong> {addr.complement}</p>
                        )}
                        <p><strong>Recebedor:</strong> {addr.receiver}</p>

                        <div className={styles.addressActions}>
                            <button className={styles.editBtn}>Editar</button>
                            <button className={styles.deleteBtn}>Excluir</button>
                        </div>
                    </div>
                ))}

                <button className={styles.addAddress}>+ Adicionar Endereço</button>
            </div>

            <div className={styles.section}>
                <h3>Meus Pedidos</h3>
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className={`${styles.order} ${expanded === order.id ? styles.expanded : ""}`}
                        onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                        <div className={styles.orderHeader}>
                            <span className={styles.orderNumber}>Pedido #{order.id}</span>
                            <span className={styles.date}>{order.date}</span>
                        </div>

                        {expanded === order.id && (
                            <>
                                <ul className={styles.productList}>
                                    {order.products.map((product, i) => (
                                        <li key={i} className={styles.productItem}>{product}</li>
                                    ))}
                                </ul>
                                <div className={styles.orderInfo}>
                                    <span className={styles.total}>Total: R$ {order.total.toFixed(2)}</span>
                                    <span className={`${styles.status} ${styles[order.status.toLowerCase().replace(/\s/g, "-")]}`}>
                                    {order.status}
                                </span>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserProfile;
