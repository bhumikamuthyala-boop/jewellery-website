import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const getDeliveryNote = (city, productId) => {
  const dayOffset = (productId % 2 === 0 ? 1 : 3) + (city === 'Mumbai' ? 1 : city === 'Kolkata' ? 2 : city === 'Delhi' ? 2 : city === 'Chennai' ? 1 : city === 'Hyderabad' ? 1 : 0);
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return `Available for delivery in ${city} by ${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
};

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onContactOwner,
  userLocation = 'Bangalore',
}) {
  if (!isOpen || !product) return null;

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  const isEarring = product.category === 'earrings';
  const city = userLocation || 'Bangalore';
  const imageUrl = product.image_url || product.image || '';

  if (!imageUrl) {
    console.warn('QuickViewModal missing image URL for product:', product);
  }

  return (
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) onClose();
      }}
    >
      <div className="modal-content-wrapper">
        <button className="close-modal-btn" onClick={onClose} aria-label="Close details modal">
          &times;
        </button>

        <div className="modal-img-container">
          <img
            src={imageUrl || 'https://via.placeholder.com/600x600?text=No+Image'}
            alt={product.name}
            className={`modal-img ${isEarring ? 'sharpened-image' : ''}`}
            onError={(e) => {
              console.warn('QuickViewModal image failed to load:', imageUrl, product);
              e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Image';
            }}
          />
        </div>

        <div className="modal-details">
          <span className="modal-cat">
            {product.category === 'chains' ? 'chains / necklaces' : product.category}
          </span>
          <h3 className="modal-title">{product.name}</h3>
          <p className="modal-price">{formatPrice(product.price)}</p>
          {product.isNearbyStock && (
            <div style={{ marginBottom: '0.55rem', color: 'var(--accent-silk)', fontWeight: 700, fontSize: '0.82rem' }}>
              Nearby Stock • Fastest available hub in {city}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', marginBottom: '1.2rem', color: 'var(--accent-silk)', fontWeight: '500' }}>
            <i className="fas fa-shipping-fast"></i>
            <span>{getDeliveryNote(city, product.id)}</span>
          </div>
          <p className="modal-desc">{product.description}</p>

          <div className="modal-spec-row">
            <div className="spec-item">
              <span className="spec-label">Metal Purity</span>
              <span className="spec-val">{product.specs?.metal}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Gemstones</span>
              <span className="spec-val">{product.specs?.stone}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Weight</span>
              <span className="spec-val">{product.specs?.weight}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Certification</span>
              <span className="spec-val">{product.specs?.origin}</span>
            </div>
          </div>

          <div className="modal-actions-row">
            <button
              className="modal-add-btn"
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
            >
              Add to Cart
            </button>
            <button
              className="modal-whatsapp-btn"
              type="button"
              onClick={() => onContactOwner(product)}
            >
              <FaWhatsapp />
              <span>Contact Owner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
