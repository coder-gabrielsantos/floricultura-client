import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getUserData, getCart, getAvailableBlocks, createOrder, startPayment } from "../../api/_index";
import Loader from "../../components/Loader";
import styles from "./Checkout.module.css";

const Checkout = () => {
    const navigate = useNavigate();

    const token = JSON.parse(localStorage.getItem("user"))?.token;

    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(null);
    const [profile, setProfile] = useState(null);

    const [receiverName, setReceiverName] = useState("");
    const [cardMessage, setCardMessage] = useState("");
    const [date, setDate] = useState("");
    const [timeBlock, setTimeBlock] = useState("06:00–08:00");
    const [availableBlocks, setAvailableBlocks] = useState([]);
    const [deliveryType, setDeliveryType] = useState("entrega");
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState("pix");

    const isFormValid =
        receiverName.trim() &&
        date &&
        timeBlock &&
        deliveryType &&
        selectedPayment &&
        (deliveryType === "retirada" || selectedAddress);

    const total = cart?.items?.reduce(
        (sum, item) =>
            item.product ? sum + item.quantity * item.product.price : sum,
        0
    );

    const handleDateChange = async (e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);
        try {
            const blocks = await getAvailableBlocks(selectedDate);
            setAvailableBlocks(blocks);
            setTimeBlock(""); // limpar o horário anterior
        } catch (err) {
            console.error("Erro ao buscar blocos disponíveis:", err);
            setAvailableBlocks([]);
        }
    };

    const handleConfirm = async () => {
        try {
            const orderData = {
                receiverName,
                cardMessage,
                date,
                timeBlock,
                deliveryType,
                paymentMethod: selectedPayment,
                address: deliveryType === "retirada" ? null : selectedAddress,
                products: cart.items.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                }))
            };

            const result = await createOrder(orderData, token);

            if (selectedPayment === "online") {
                const initPoint = await startPayment({
                    description: "Pedido Floricultura",
                    price: total,
                    quantity: 1,
                    orderId: result.order._id
                });
                window.location.href = initPoint;
            } else {
                navigate("/perfil");
            }
        } catch (err) {
            console.error("Erro ao criar pedido:", err);
            alert("Erro ao finalizar pedido.");
        }
    };

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        Promise.all([getCart(token), getUserData()])
            .then(([cartData, userData]) => {
                setCart(cartData);
                setProfile(userData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar checkout:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <Loader />;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Finalizar Pedido</h2>

            <div className={styles.section}>
                <h3>Produtos no Carrinho</h3>
                {cart.items.length > 0 ? (
                    cart.items.map(
                        (item, index) =>
                            item.product && (
                                <div key={index} className={styles.product}>
                                    <span>{item.product.name}</span>
                                    <span>
                                        {item.quantity} x R${" "}
                                        {item.product.price.toFixed(2)}
                                    </span>
                                </div>
                            )
                    )
                ) : (
                    <p>Nenhum produto no carrinho.</p>
                )}
                <p className={styles.total}>Total: R$ {total.toFixed(2)}</p>
            </div>

            <div className={styles.section}>
                <h3>Personalizar seu pedido</h3>
                <input
                    className={styles.input}
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="Nome de quem irá receber"
                />
                <textarea
                    className={styles.textarea}
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value.slice(0, 120))}
                    placeholder="Mensagem opcional (máx. 120 caracteres)"
                />
                <div className={styles.charCount}>
                    {cardMessage.length}/120
                </div>
            </div>

            <div className={styles.section}>
                <h3>Entrega ou Retirada?</h3>
                <div className={styles.paymentGrid}>
                    {["entrega", "retirada"].map((type) => (
                        <div
                            key={type}
                            className={`${styles.paymentOption} ${
                                deliveryType === type ? styles.selected : ""
                            }`}
                            onClick={() => setDeliveryType(type)}
                        >
                            {type.toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>

            {deliveryType === "entrega" && (
                <div className={styles.section}>
                    <h3>Escolha o Endereço</h3>
                    {profile.addresses.length > 0 ? (
                        profile.addresses.map((addr, i) => (
                            <div
                                key={addr._id}
                                className={`${styles.addressCard} ${
                                    selectedAddress === addr._id
                                        ? styles.selected
                                        : ""
                                }`}
                                onClick={() => setSelectedAddress(addr._id)}
                            >
                                <div className={styles.addressTop}>
                                    <p>
                                        {addr.street}, {addr.number}
                                    </p>
                                    <span className={styles.addressIndex}>
                                        Endereço #{i + 1}
                                    </span>
                                </div>
                                <p>Bairro: {addr.neighborhood}</p>
                                <p>Referência: {addr.reference}</p>
                                {addr.complement && (
                                    <p>Complemento: {addr.complement}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>Nenhum endereço cadastrado.</p>
                    )}
                    <button
                        className={styles.addAddress}
                        onClick={() => navigate("/endereco")}
                    >
                        + Adicionar Novo Endereço
                    </button>
                </div>
            )}

            <div className={styles.section}>
                <h3>Data e Horário</h3>
                <div className={styles.datetimeRow}>
                    <div className={styles.dateWrapper}>
                        <input
                            type="date"
                            className={styles.input}
                            value={date}
                            onChange={handleDateChange}
                        />
                    </div>

                    <div className={styles.selectContainer}>
                        <Select
                            isDisabled={!date}
                            options={availableBlocks.map((block) => ({
                                value: block,
                                label: block
                            }))}
                            value={timeBlock ? { value: timeBlock, label: timeBlock } : null}
                            onChange={(option) => setTimeBlock(option.value)}
                            classNamePrefix="custom-select"
                            placeholder="Selecione o horário"
                        />
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h3>Forma de Pagamento</h3>
                <div className={styles.paymentGrid}>
                    {["online", "especie"].map((method) => (
                        <div
                            key={method}
                            className={`${styles.paymentOption} ${
                                selectedPayment === method ? styles.selected : ""
                            }`}
                            onClick={() => setSelectedPayment(method)}
                        >
                            {method === "online" ? "PAGAMENTO ONLINE" : "ESPÉCIE"}
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={handleConfirm}
                className={styles.confirmBtn}
                disabled={!isFormValid}
                style={{ opacity: isFormValid ? 1 : 0.6}}
            >
                {isFormValid ? "Confirmar Pedido" : "Preencha todos os campos"}
            </button>
        </div>
    );
};

export default Checkout;
