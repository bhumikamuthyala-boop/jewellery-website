import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function CircularGallery({ products, onQuickView, onAddToCart, wishlist, toggleWishlist, onContactOwner = () => { } }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [radius, setRadius] = useState(300);

  // Adjust carousel radius based on viewport width for full responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setRadius(180);
      } else if (window.innerWidth < 768) {
        setRadius(220);
      } else {
        setRadius(300);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
        No items found to display.
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Modulo calculation helper for indexing products array
  const getProductAt = (index) => {
    const len = products.length;
    return products[((index % len) + len) % len];
  };

  const activeProduct = getProductAt(currentIndex);

  return (
    <div className="circular-gallery-showcase" style={{ padding: '2rem 0' }}>
      {/* 3D Carousel Stage */}
      <div
        className="carousel-container"
        style={{
          perspective: '1200px',
          width: '100%',
          height: '420px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Nav Arrows */}
        <button
          onClick={handlePrev}
          className="carousel-nav-btn prev"
          aria-label="Previous Product"
          style={{
            position: 'absolute',
            left: '5%',
            zIndex: 15,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <button
          onClick={handleNext}
          className="carousel-nav-btn next"
          aria-label="Next Product"
          style={{
            position: 'absolute',
            right: '5%',
            zIndex: 15,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* 3D Cylindrical Track */}
        <div
          className="carousel-track"
          style={{
            width: '240px',
            height: '320px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: `translateZ(-${products.length > 2 ? Math.max(radius, 200 / (2 * Math.sin(Math.PI / products.length))) : radius}px) rotateY(${currentIndex * -(360 / products.length)}deg)`,
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform'
          }}
        >
          {products.map((product, idx) => {
            const angleSpacing = 360 / products.length;
            const angle = idx * angleSpacing;
            const computedRadius = products.length > 2 ? Math.max(radius, 200 / (2 * Math.sin(Math.PI / products.length))) : radius;
            const isWishlisted = wishlist.includes(product.id);
            const isEarring = product.category === 'earrings';
            const isActive = getProductAt(currentIndex).id === product.id;

            return (
              <div
                key={product.id}
                className="carousel-item"
                style={{
                  position: 'absolute',
                  width: '240px',
                  height: '320px',
                  left: '0',
                  top: '0',
                  transform: `rotateY(${angle}deg) translateZ(${computedRadius}px)`,
                  transition: 'opacity 0.5s ease',
                  opacity: isActive ? 1 : 0.45,
                  backfaceVisibility: 'visible',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    pointerEvents: isActive ? 'auto' : 'none'
                  }}
                >
                  <ProductCard
                    product={product}
                    isWishlisted={isWishlisted}
                    onToggleWishlist={toggleWishlist}
                    onQuickView={onQuickView}
                    onAddToCart={onAddToCart}
                    onContactOwner={onContactOwner}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focus Product Details below the carousel */}
      {activeProduct && (
        <div
          className="active-product-details"
          style={{
            maxWidth: '500px',
            margin: '2rem auto 0 auto',
            textAlign: 'center',
            padding: '0 1.5rem',
            animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--accent-silk)',
              fontWeight: 600
            }}
          >
            Featured Ornament
          </span>
          <h3 style={{ fontSize: '1.6rem', marginTop: '0.4rem', marginBottom: '0.8rem' }}>
            {activeProduct.name}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {activeProduct.description}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => onQuickView(activeProduct)}>
              View Specifications
            </button>
            <button
              className="btn-primary"
              style={{ background: 'var(--accent-silk)', color: '#fff', borderColor: 'var(--accent-silk)' }}
              onClick={() => onAddToCart(activeProduct)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
