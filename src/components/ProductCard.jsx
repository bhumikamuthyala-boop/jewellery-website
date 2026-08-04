import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
}).format(price);

export default function ProductCard({
    product,
    isWishlisted,
    onToggleWishlist = () => { },
    onQuickView = () => { },
    onAddToCart = () => { },
    onContactOwner = () => { },
    featured = false,
}) {
    const isEarring = product.category === 'earrings';
    const badgeText = product.badge || (product.category === 'chains' ? 'Signature Piece' : product.category);

    return (
        <div className={`product-card ${featured ? 'featured' : ''}`} data-id={product.id}>
            <div className="product-image-container">
                {badgeText && <span className="product-badge">{badgeText}</span>}
                <button
                    className={`wishlist-toggle-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                    }}
                    aria-label="Toggle Wishlist"
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                    <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`} style={{ fontSize: '1.05rem' }}></i>
                </button>

                <img
                    src={product.image_url || product.image}
                    alt={product.name}
                    className={`product-image ${isEarring ? 'sharpened-image' : ''}`}
                    loading="lazy"
                />

                <div className="product-actions-overlay">
                    <button className="overlay-btn view-btn" onClick={() => onQuickView(product)}>Quick View</button>
                    <button className="overlay-btn add-btn" onClick={() => onAddToCart(product)}>Add to Cart</button>
                </div>
            </div>

            <div className="product-info">
                <span className="product-cat">
                    {product.category === 'chains' ? 'chains / necklaces' : product.category}
                </span>
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">{formatPrice(product.price)}</p>
                {product.description ? (
                    <p className="product-description">{product.description}</p>
                ) : null}
                <button
                    className="whatsapp-action-btn"
                    type="button"
                    onClick={() => onContactOwner(product)}
                    aria-label={`Contact owner about ${product.name}`}
                >
                    <FaWhatsapp />
                    <span>Contact Owner</span>
                </button>
            </div>
        </div>
    );
}
