import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
  onContactOwner,
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartSummary = cart.length > 0
    ? cart.map((item) => `${item.name} x${item.quantity}`).join(', ')
    : 'no items selected';
  const whatsappMessage = `Hi, I have these items in my cart: ${cartSummary}. Can you please help me with my order?`;

  const handleContactOwner = () => {
    if (typeof onContactOwner === 'function') {
      onContactOwner(whatsappMessage);
      return;
    }

    const url = `https://wa.me/+919876543210?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        style={{ display: isOpen ? 'block' : 'none' }}
      ></div>

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="cart-header">
          <h3>Your Silver Cart</h3>
          <button className="close-cart-btn" onClick={onClose} aria-label="Close cart drawer">
            &times;
          </button>
        </div>

        <div className="cart-items-container">
          {cart.length === 0 ? (
            <div className="cart-empty-message">
              <i className="fas fa-gem" style={{ display: 'block' }}></i>
              <p>Your silver collection is empty</p>
            </div>
          ) : (
            cart.map((item) => (
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
                    <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, -1)}>-</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => onRemoveFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <i className="far fa-trash-alt"></i>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total-row">
            <span>Estimated Total:</span>
            <span className="cart-total-price">{formatPrice(totalAmount)}</span>
          </div>
          <div className="cart-footer-actions">
            <button className="checkout-btn" onClick={onClose} disabled={cart.length === 0}>
              Continue Browsing
            </button>
            <button className="contact-owner-btn" onClick={handleContactOwner} type="button">
              <FaWhatsapp />
              <span>Contact Owner</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
