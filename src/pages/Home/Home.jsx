import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import styles from "./Home.module.css";

const linkImage = "https://content.clara.es/medio/2022/10/04/plantas-con-flores-rojas-rosa_8afd8936_1280x1820.jpg";

const mockProducts = [
    {
        id: 1,
        name: "Buquê com Girassol",
        description: "Um buquê alegre com girassóis e folhagens verdes. Ideal para iluminar qualquer ambiente.",
        price: 89.9,
        image: linkImage
    },
    {
        id: 2,
        name: "Ramalhete Clássico",
        description: "Flores tradicionais em tons suaves para ocasiões elegantes.",
        price: 59.9,
        image: linkImage
    },
    {
        id: 3,
        name: "Mini Orquídea",
        description: "Orquídea phalaenopsis em cachepô de cerâmica.",
        price: 45.0,
        image: linkImage
    },
    {
        id: 4,
        name: "Arranjo Exuberante Tropical",
        description: "Arranjo vibrante com flores tropicais coloridas e estrutura alta, perfeito para centros de mesa ou recepções.",
        price: 159.9,
        image: linkImage
    },
    {
        id: 5,
        name: "Cacto Decorativo",
        description: "Pequeno cacto com vaso decorativo. Ótimo para presentear amantes de plantas resistentes.",
        price: 24.9,
        image: linkImage
    },
    {
        id: 6,
        name: "Rosas Vermelhas Luxo",
        description: "Buquê com 24 rosas vermelhas embaladas em papel especial.",
        price: 120.0,
        image: linkImage
    },
    {
        id: 7,
        name: "Mix de Flores do Campo",
        description: "Combinação de flores do campo coloridas com folhagem rústica.",
        price: 69.5,
        image: linkImage
    },
    {
        id: 8,
        name: "Arranjo Elegante Branco e Verde",
        description: "Arranjo minimalista com flores brancas e verdes em base moderna.",
        price: 99.0,
        image: linkImage
    }
];

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const isLoggedIn = false; // simulado

    useEffect(() => {
        setProducts(mockProducts);
    }, []);

    const handleAddToCart = (product) => {
        if (!isLoggedIn) {
            navigate("/login");
        } else {
            setCart([...cart, product]);
        }
    };

    const total = cart.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className={styles.container}>
            <div className={styles.products}>
                <h1 className={styles.title}>Flores para todas as ocasiões</h1>
                <div className={styles.grid}>
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart}/>
                    ))}
                </div>
            </div>

            <div className={styles.cart}>
                <h2 className={styles.cartTitle}>Sua sacola</h2>
                {cart.length === 0 ? (
                    <p className={styles.empty}>Sua sacola está vazia.</p>
                ) : (
                    <>
                        <ul className={styles.itemList}>
                            {cart.map((item, i) => (
                                <li key={i} className={styles.item}>
                                    <span>{item.name}</span>
                                    <strong>R$ {item.price.toFixed(2)}</strong>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.totalBox}>
                            <span>Total:</span>
                            <strong>R$ {total.toFixed(2)}</strong>
                        </div>
                        <button className={styles.checkoutButton}>Finalizar Pedido</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
