import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import Magnet from './Magnet';
import CircularGallery from './CircularGallery';

const getDeliveryNote = (city, productId) => {
  const dayOffset = (productId % 2 === 0 ? 1 : 3) + (city === 'Mumbai' ? 1 : city === 'Kolkata' ? 2 : city === 'Delhi' ? 2 : city === 'Chennai' ? 1 : city === 'Hyderabad' ? 1 : 0);
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return `Available for delivery in ${city} by ${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
};

export default function ProductGallery({
  products,
  wishlist,
  toggleWishlist,
  activeFilter,
  setActiveFilter,
  onQuickView,
  onAddToCart,
  onContactOwner,
  userLocation = 'Bangalore',
}) {
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { key: 'all', label: 'All Ornaments' },
    { key: 'chains', label: 'Chains & Necklaces' },
    { key: 'bracelets', label: 'Bracelets' },
    { key: 'rings', label: 'Rings' },
    { key: 'earrings', label: 'Earrings' },
    { key: 'anklets', label: 'Anklets' },
    { key: 'pooja', label: 'Pooja Items' },
  ];

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <section className="gallery-section section-padding" id="gallery">
      <div className="container">
        <div className="section-title">
          <h2>Our Silver <span>Gallery</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto 0 auto', textAlign: 'center' }}>
            Browse our signature sterling silver chains, link bracelets, hoop earrings, and rings.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginBottom: '3rem' }}>
          <Magnet>
            <button
              className={`filter-btn ${viewMode === 'showcase' ? 'active' : ''}`}
              onClick={() => setViewMode('showcase')}
              style={{ borderRadius: '25px', padding: '0.6rem 1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <i className="fas fa-circle-notch"></i> Showcase View
            </button>
          </Magnet>
          <Magnet>
            <button
              className={`filter-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              style={{ borderRadius: '25px', padding: '0.6rem 1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <i className="fas fa-th"></i> Grid View
            </button>
          </Magnet>
        </div>

        <div className="filters-container" style={{ marginBottom: viewMode === 'showcase' ? '1rem' : '3.5rem' }}>
          {categories.map((cat) => (
            <Magnet key={cat.key}>
              <button
                className={`filter-btn ${activeFilter === cat.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat.key)}
              >
                {cat.label}
              </button>
            </Magnet>
          ))}
        </div>

        {viewMode === 'showcase' ? (
          <CircularGallery
            products={products}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
            onContactOwner={onContactOwner}
          />
        ) : (
          <div className="product-grid" id="product-grid">
            {products.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem 0' }}>
                No items found in this category.
              </div>
            ) : (
              products.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                const isEarring = product.category === 'earrings';
                const city = userLocation || 'Bangalore';

                return (
                  <Magnet key={product.id} strength={0.15} range={30}>
                    <div className="product-card" data-id={product.id}>
                      <div className="product-image-container">
                        {product.badge && <span className="product-badge">{product.badge}</span>}
                        {product.isNearbyStock && (
                          <span style={{ position: 'absolute', top: '0.7rem', right: '0.7rem', background: 'rgba(255,255,255,0.92)', color: '#111', borderRadius: '999px', padding: '0.25rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, zIndex: 2 }}>
                            Nearby Stock
                          </span>
                        )}
                        <button
                          className={`wishlist-toggle-btn ${isWishlisted ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          aria-label="Toggle Wishlist"
                          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`} style={{ fontSize: '1.05rem' }}></i>
                        </button>

                        <img
                          src={product.image}
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
                        <div style={{ fontSize: '0.77rem', marginTop: '0.65rem', color: 'var(--accent-silk)', fontWeight: '600' }}>
                          {getDeliveryNote(city, product.id)}
                        </div>
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
                  </Magnet>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}
