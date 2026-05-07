import { useCart } from "../Context/CartContex";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link, } from "react-router-dom";
import "./Cart.css"
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, subtotal } = useCart();

    if (cart.length === 0) {
        return (
        <div>
            <Navbar/>
            <div className="empty-cart">
                <ShoppingBag size={64} className="empty-cart-icon" />
                <h2 className="empty-cart-title">Your Bag is Empty</h2>
                <p className="empty-cart-text">Looks like you haven't picked up any  yet.</p>
                <Link to="/shop" className="empty-cart-button">
                    Shop New Arrivals
                </Link>
            </div>
            <Footer/>
        </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="cart-page">
                <h1 className="cart-title">Your Locker</h1>

                <div className="cart-grid">

                    <div className="cart-items-section">
                        {cart.map((item) => (
                            <div key={`${item._id}-${item.size}`} className="cart-item">

                                <div className="cart-item-image-container">
                                    <img
                                        src={item.productId.image}
                                        alt={item.productId.name}
                                        className="cart-item-image"
                                    />
                                </div>

                                <div className="cart-item-info">
                                    <div>
                                        <div className="cart-item-header">
                                            <h3 className="cart-item-name">{item.productId.name}</h3>
                                            <p className="cart-item-price">₹{item.productId.price}</p>
                                        </div>
                                        <p className="cart-item-size">Size: US {item.size}</p>
                                        <p className="cart-item-size">Quantity {item.quantity}</p>
                                    </div>

                                    <div className="cart-item-controls">

                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item, item.quantity - 1)}
                                                className="quantity-button"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="quantity-display">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item, item.quantity + 1)}
                                                className="quantity-button"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item)}
                                            className="remove-button"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Link to="/shop" className="continue-shopping">
                            <ArrowLeft size={16} className="continue-shopping-icon" /> Continue Shopping
                        </Link>
                    </div>


                    <div className="summary-section">
                        <div className="summary-card">
                            <h2 className="summary-title">Summary</h2>

                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Estimated Shipping</span>

                                </div>

                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>₹{(subtotal).toFixed(2)}</span>
                                </div>
                            </div>

                            <Link to={"/checkout"}>
                                <button className="checkout-button">
                                    Checkout
                                </button>
                            </Link>


                            <div className="secure-checkout">
                                <span className="secure-checkout-text">Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
