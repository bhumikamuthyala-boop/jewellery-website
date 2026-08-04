import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

export default function CartPage() {
    const navigate = useNavigate();
    const { cartItems, updateCartQuantity, removeFromCart } = useCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <section className="cart-page section-padding">
            <div className="container">
                <div className="section-title">
                    <h2>My <span>Cart</span></h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', margin: '1rem auto 0 auto', textAlign: 'center' }}>
                        Review the pieces you have selected and update quantities before reaching out to confirm your order.
                    </p>
                </div>

                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)' }}>
                        <p>Your cart is empty right now.</p>
                        <button className="btn-primary" type="button" onClick={() => navigate('/')}>Browse Ornaments</button>
                    </div>
                ) : (
                    <div style={{ marginTop: '2rem' }}>
                        <div className="cart-items-container">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <img
                                        src={item.image || item.image_url}
                                        alt={item.name}
                                        className={`cart-item-img ${item.category === 'earrings' ? 'sharpened-image' : ''}`}
                                    />
                                    <div className="cart-item-info">
                                        <h4 className="cart-item-title">{item.name}</h4>
                                        <span className="cart-item-price">{formatPrice(item.price)}</span>
                                        <div className="cart-item-quantity">
                                            <button className="qty-btn" onClick={() => updateCartQuantity(item.id, -1)}>-</button>
                                            <span className="qty-val">{item.quantity}</span>
                                            <button className="qty-btn" onClick={() => updateCartQuantity(item.id, 1)}>+</button>
                                        </div>
                                    </div>
                                    <button
                                        className="remove-item-btn"
                                        onClick={() => removeFromCart(item.id)}
                                        aria-label="Remove item"
                                    >
                                        <i className="far fa-trash-alt"></i>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                                Estimated Total: {formatPrice(totalAmount)}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button className="btn-primary" type="button" onClick={() => navigate('/')}>Continue Browsing</button>
                                <button className="btn-primary" type="button" onClick={() => window.open('https://wa.me/+919876543210?text=' + encodeURIComponent('Hi, I would like help with my order.'), '_blank', 'noopener,noreferrer')}>Contact Owner</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
