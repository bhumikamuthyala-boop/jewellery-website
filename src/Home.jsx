import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabaseClient';
import ProductCard from './components/ProductCard';
import CircularGallery from './components/CircularGallery';
import QuickViewModal from './components/QuickViewModal';
import Magnet from './components/Magnet';
import { useCart } from './CartContext';

const WHATSAPP_NUMBER = '919876543210';

export default function Home({ searchQuery = '' }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [activeFilter, setActiveFilter] = useState('all');
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const { wishlistItems, addToCart, toggleWishlist } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            if (!supabase) {
                setError('Supabase is not configured yet.');
                setLoading(false);
                return;
            }

            const { data, error: fetchError } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: false });

            if (fetchError) {
                setError(fetchError.message || 'Unable to load products.');
                setProducts([]);
            } else {
                setProducts(data || []);
            }

            setLoading(false);
        };

        fetchProducts();
    }, []);


    const handleSearch = (query) => {
        const term = (query || '').trim().toLowerCase();
        if (!term) return products;

        return products.filter((product) => {
            const searchable = [
                product.name,
                product.category,
                product.description,
                product.badge,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return searchable.includes(term);
        });
    };

    const handleSearchSelect = (productId) => {
        const element = document.querySelector(`[data-id="${productId}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const searchedProducts = useMemo(() => handleSearch(searchQuery), [products, searchQuery]);

    const filteredProducts = useMemo(() => {
        const base = activeFilter === 'all' ? searchedProducts : searchedProducts.filter((product) => product.category === activeFilter);
        return base;
    }, [activeFilter, searchedProducts]);

    const searchResults = useMemo(() => {
        const term = (searchQuery || '').trim();
        return term ? searchedProducts.slice(0, 8) : [];
    }, [searchedProducts, searchQuery]);

    const handleQuickView = (product) => {
        setQuickViewProduct(product);
        setIsQuickViewOpen(true);
    };

    const closeQuickView = () => {
        setIsQuickViewOpen(false);
        setQuickViewProduct(null);
    };

    const handleAddToCart = (product, qty = 1) => {
        addToCart(product, qty);
    };

    const handleContactOwner = (product) => {
        const message = `Hi, I am interested in ${product.name}. Please let me know more details about this piece.`;
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <section className="hero">
                <div className="hero-content">
                    <p className="hero-subtitle">Pure Moonlit Silver</p>
                    <h1>SHINE WITH PURE MOONLIT GRACE</h1>
                    <p className="hero-desc">
                        Discover handcrafted silver ornaments designed to glow with every moment.
                        Browse our selection of rings, chains, bracelets, and earrings made for modern elegance.
                    </p>
                    <button
                        className="btn-primary"
                        type="button"
                        onClick={() => {
                            const gallerySection = document.getElementById('gallery');
                            if (gallerySection) {
                                gallerySection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        EXPLORE ORNAMENTS
                    </button>
                </div>
            </section>

            <section className="gallery-section section-padding" id="gallery">
                <div className="container">
                    <div className="section-title">
                        <h2>Our Silver <span>Gallery</span></h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto 0 auto', textAlign: 'center' }}>
                            Browse the latest pieces added from your Supabase catalog.
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
                        {['all', 'chains', 'bracelets', 'rings', 'earrings', 'anklets', 'pooja'].map((key) => {
                            const label = key === 'all'
                                ? 'All Ornaments'
                                : key === 'chains'
                                    ? 'Chains & Necklaces'
                                    : key === 'pooja'
                                        ? 'Pooja Items'
                                        : key === 'anklets'
                                            ? 'Anklets'
                                            : key.charAt(0).toUpperCase() + key.slice(1);
                            return (
                                <Magnet key={key}>
                                    <button
                                        className={`filter-btn ${activeFilter === key ? 'active' : ''}`}
                                        onClick={() => setActiveFilter(key)}
                                    >
                                        {label}
                                    </button>
                                </Magnet>
                            );
                        })}
                    </div>

                    {searchResults.length > 0 && (
                        <div style={{ marginBottom: '1.5rem', maxWidth: '900px', margin: '0 auto 1.5rem auto' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                                {searchResults.map((product) => (
                                    <button
                                        key={product.id}
                                        type="button"
                                        onClick={() => handleSearchSelect(product.id)}
                                        className="filter-btn"
                                        style={{ padding: '0.7rem 1rem' }}
                                    >
                                        {product.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading products...</p>
                    ) : error ? (
                        <p style={{ textAlign: 'center', color: '#fca5a5' }}>{error}</p>
                    ) : filteredProducts.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No products available yet.</p>
                    ) : viewMode === 'showcase' ? (
                        <CircularGallery
                            products={filteredProducts}
                            wishlist={wishlistItems.map((item) => item.id)}
                            toggleWishlist={toggleWishlist}
                            onQuickView={handleQuickView}
                            onAddToCart={handleAddToCart}
                            onContactOwner={handleContactOwner}
                        />
                    ) : (
                        <div className="product-grid" id="product-grid">
                            {filteredProducts.map((product) => {
                                const isWishlisted = wishlistItems.some((item) => item.id === product.id);
                                return (
                                    <Magnet key={product.id} strength={0.15} range={30}>
                                        <ProductCard
                                            product={product}
                                            isWishlisted={isWishlisted}
                                            onToggleWishlist={toggleWishlist}
                                            onQuickView={handleQuickView}
                                            onAddToCart={handleAddToCart}
                                            onContactOwner={handleContactOwner}
                                        />
                                    </Magnet>
                                );
                            })}
                        </div>
                    )}
                </div>
                <QuickViewModal
                    product={quickViewProduct}
                    isOpen={isQuickViewOpen}
                    onClose={closeQuickView}
                    onAddToCart={(product) => {
                        handleAddToCart(product);
                        closeQuickView();
                    }}
                    onContactOwner={handleContactOwner}
                />
            </section>
        </>
    );
}
