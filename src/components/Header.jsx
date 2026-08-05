import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaMapMarkerAlt, FaChevronDown, FaSearch, FaTimes, FaHeart, FaShoppingBag, FaMoon, FaSun, FaBars, FaImages, FaHome } from 'react-icons/fa';
import { MdDiamond } from 'react-icons/md';
import Magnet from './Magnet';

const BRAND_NAME = 'SRI DURGA MOON LIGHT SILVER';
const CITY_OPTIONS = ['Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Kolkata', 'Hyderabad', 'Andhra Pradesh'];

export default function Header({
  cartCount,
  wishlistCount,
  theme,
  toggleTheme,
  cartPath = '/cart',
  wishlistPath = '/wishlist',
  searchQuery,
  setSearchQuery,
  userLocation = 'Bangalore',
  onLocationChange,
  onUseCurrentLocation,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isLocationMenuOpen) return undefined;
    const handleClick = (event) => {
      if (!event.target.closest('.location-picker')) {
        setIsLocationMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isLocationMenuOpen]);

  const filteredCities = CITY_OPTIONS.filter((city) => city.toLowerCase().includes(locationSearch.toLowerCase()));

  const selectLocation = (city) => {
    setIsLocationMenuOpen(false);
    setLocationSearch('');
    onLocationChange && onLocationChange(city);
  };

  const useCurrentLocation = () => {
    setIsLocationMenuOpen(false);
    setLocationSearch('');
    onUseCurrentLocation && onUseCurrentLocation();
  };

  const isMobile = windowWidth < 768;
  const brandClass = isMobile ? 'logo mobile-logo' : 'logo desktop-logo';

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container" style={{ position: 'relative', width: '100%' }}>
        <div
          className="desktop-header"
          style={{
            display: isMobile ? 'none' : 'block',
            width: '100%',
          }}
        >
          <div
            className="desktop-header-inner"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <Magnet range={60} strength={0.25}>
              <Link
                to="/"
                className={`${brandClass} brand-logo`}
                id="brand-logo"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MdDiamond size={20} style={{ marginRight: '0.5rem', color: '#4c1d95' }} />
                {BRAND_NAME}
              </Link>
            </Magnet>

            <nav className="nav-links" id="nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
              <NavLink to="/#gallery" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Gallery</NavLink>
              <NavLink to="/story" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Our Story</NavLink>
              <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Contact Us</NavLink>
            </nav>

            <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="location-picker" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIsLocationMenuOpen((prev) => !prev)}
                  aria-label="Choose delivery location"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '999px',
                    padding: '0.55rem 0.8rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.14)',
                  }}
                >
                  <FaMapMarkerAlt size={13} color="var(--accent-silk)" />
                  <span>{userLocation}</span>
                  <FaChevronDown size={12} color="var(--text-secondary)" />
                </button>

                {isLocationMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 0.55rem)',
                    width: '270px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '14px',
                    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.28)',
                    padding: '0.8rem',
                    zIndex: 1300,
                  }}>
                    <div style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Popular cities
                    </div>
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      placeholder="Search city"
                      style={{
                        width: '100%',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        padding: '0.6rem 0.7rem',
                        borderRadius: '8px',
                        marginBottom: '0.7rem',
                        outline: 'none',
                      }}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {filteredCities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => selectLocation(city)}
                          style={{
                            background: city === userLocation ? 'var(--accent-silk)' : 'var(--bg-tertiary)',
                            color: city === userLocation ? '#121212' : 'var(--text-primary)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '999px',
                            padding: '0.4rem 0.7rem',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={useCurrentLocation}
                      style={{
                        marginTop: '0.8rem',
                        width: '100%',
                        background: 'var(--accent-silk)',
                        border: 'none',
                        color: '#121212',
                        padding: '0.6rem 0.7rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      Use Current Location
                    </button>
                  </div>
                )}
              </div>

              <div className={`search-container ${isSearchOpen ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isSearchOpen && (
                  <input
                    type="text"
                    placeholder="Search silver..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-header"
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.85rem',
                      outline: 'none',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      transition: 'var(--transition-fast)'
                    }}
                  />
                )}
                <Magnet>
                  <button
                    className="icon-btn"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    aria-label="Toggle Search"
                    title="Search Ornaments"
                  >
                    {isSearchOpen ? <FaTimes /> : <FaSearch />}
                  </button>
                </Magnet>
              </div>

              <Magnet>
                <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle Light/Dark Theme">
                  {theme === 'light' ? <FaMoon /> : <FaSun />}
                </button>
              </Magnet>

              <Magnet>
                <Link
                  to={wishlistPath}
                  className="icon-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Open Wishlist"
                  title="View Wishlist"
                  style={{ position: 'relative' }}
                >
                  <FaHeart />
                  {wishlistCount > 0 && <span className="cart-count" style={{ backgroundColor: '#ef4444', color: '#fff' }}>{wishlistCount}</span>}
                </Link>
              </Magnet>

              <Magnet>
                <Link
                  to={cartPath}
                  className="icon-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Open shopping cart"
                  title="View Cart"
                >
                  <FaShoppingBag />
                  <span className="cart-count">{cartCount}</span>
                </Link>
              </Magnet>
            </div>
          </div>
        </div>

        <div className="mobile-header" style={{ display: isMobile ? 'block' : 'none', width: '100%' }}>
          <div className="mobile-header-bar">
            <div className="mobile-header-bar-top">
              <Magnet range={60} strength={0.25}>
                <Link
                  to="/"
                  className={`${brandClass} brand-logo`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MdDiamond size={20} style={{ marginRight: '0.5rem', color: '#4c1d95' }} />
                  {BRAND_NAME}
                </Link>
              </Magnet>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle mobile menu"
                className="mobile-menu-toggle"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
              >
                <FaBars />
              </button>
            </div>

            {isSearchOpen && (
              <div className="mobile-search-row">
                <input
                  type="search"
                  autoFocus
                  placeholder="Search silver..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mobile-search-input"
                />
              </div>
            )}

            <div className="mobile-header-bar-actions">
              <Magnet>
                <Link
                  to="/"
                  className="icon-btn"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(false);
                  }}
                  aria-label="Open Home"
                  title="Home"
                >
                  <FaHome />
                </Link>
              </Magnet>

              <Magnet>
                <Link
                  to="/#gallery"
                  className="icon-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Open Gallery"
                  title="View Gallery"
                >
                  <FaImages />
                </Link>
              </Magnet>

              <Magnet>
                <button
                  className="icon-btn"
                  onClick={() => setIsSearchOpen((prev) => !prev)}
                  aria-label="Toggle Search"
                  title="Search Ornaments"
                >
                  {isSearchOpen ? <FaTimes /> : <FaSearch />}
                </button>
              </Magnet>

              <Magnet>
                <Link
                  to={wishlistPath}
                  className="icon-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Open Wishlist"
                  title="View Wishlist"
                  style={{ position: 'relative' }}
                >
                  <FaHeart />
                  {wishlistCount > 0 && <span className="cart-count" style={{ backgroundColor: '#ef4444', color: '#fff' }}>{wishlistCount}</span>}
                </Link>
              </Magnet>

              <Magnet>
                <Link
                  to={cartPath}
                  className="icon-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Open shopping cart"
                  title="View Cart"
                >
                  <FaShoppingBag />
                  <span className="cart-count">{cartCount}</span>
                </Link>
              </Magnet>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="mobile-menu-dropdown" style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#121212', fontWeight: 700 }}>Home</NavLink>
                <NavLink to="/#gallery" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#121212', fontWeight: 700 }}>Gallery</NavLink>
                <NavLink to="/story" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#121212', fontWeight: 700 }}>Our Story</NavLink>
                <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#121212', fontWeight: 700 }}>Contact Us</NavLink>
              </nav>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <button onClick={() => {
                  setIsSearchOpen((prev) => !prev);
                  setIsMobileMenuOpen(false);
                }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.08)', background: '#f8fafc', color: '#121212' }}>
                  Search
                  <span>{isSearchOpen ? <FaTimes /> : <FaSearch />}</span>
                </button>

                <Link to={wishlistPath} onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.08)', color: '#121212' }}>
                  Wishlist
                  <FaHeart />
                </Link>

                <Link to={cartPath} onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.08)', color: '#121212' }}>
                  Cart
                  <FaShoppingBag />
                </Link>

                <button onClick={toggleTheme} className="mobile-menu-item mobile-theme-toggle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.08)', background: '#f8fafc', color: '#121212' }}>
                  Theme
                  {theme === 'light' ? <FaMoon /> : <FaSun />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
