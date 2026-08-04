import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

export default function WishlistPage() {
    const navigate = useNavigate();
    const { wishlistItems, toggleWishlist, addToCart } = useCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <section className="wishlist-page section-padding">
            <div className="container">
                <div className="section-title">
                    <h2>Saved <span>Wishlist</span></h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', margin: '1rem auto 0 auto', textAlign: 'center' }}>
                        Your favorite pieces are saved here. Add them to your cart or remove them from the wishlist anytime.
                    </p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)' }}>
                        <p>Your wishlist is empty.</p>
                        <button className="btn-primary" type="button" onClick={() => navigate('/')}>Browse Products</button>
                    </div>
                ) : (
                    <div className="product-grid" style={{ marginTop: '2rem' }}>
                        {wishlistItems.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-image-container">
                                    <button
                                        className="wishlist-toggle-btn active"
                                        onClick={() => toggleWishlist(product)}
                                        title="Remove from wishlist"
                                        style={{ top: '10px', right: '10px' }}
                                    >
                                        <i className="fas fa-heart"></i>
                                    </button>
                                    <img
                                        src={product.image || product.image_url}
                                        alt={product.name}
                                        className={`product-image ${product.category === 'earrings' ? 'sharpened-image' : ''}`}
                                    />
                                    <div className="product-actions-overlay" style={{ padding: '1rem' }}>
                                        <button className="overlay-btn view-btn" type="button" onClick={() => navigate('/')}>View</button>
                                        <button className="overlay-btn add-btn" type="button" onClick={() => addToCart(product)}>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                                <div className="product-info" style={{ padding: '1rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {product.name}
                                    </h4>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
