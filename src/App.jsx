import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import CartPage from './CartPage';
import ProfilePage from './ProfilePage';
import WishlistPage from './WishlistPage';
import AdminPage from './components/AdminPage';
import Home from './Home';
import Story from './Story';
import Contact from './Contact';
import { useCart } from './CartContext';

const WHATSAPP_NUMBER = '+919876543210';
const CITY_OPTIONS = ['Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Kolkata', 'Hyderabad', 'Andhra Pradesh'];
const CITY_HUBS = {
  Bangalore: [1, 2, 4, 5, 7, 8, 10, 12],
  Chennai: [2, 3, 6, 8, 10, 11],
  Mumbai: [1, 4, 6, 7, 9, 12, 13],
  Delhi: [3, 5, 7, 9, 10, 11, 14],
  Kolkata: [2, 4, 6, 8, 11, 13, 14],
  Hyderabad: [1, 3, 5, 7, 9, 12, 14],
  'Andhra Pradesh': [1, 5, 10, 12],
};

const normalizeCityName = (city) => {
  if (!city) return 'Bangalore';
  const cleaned = city.trim();
  const aliases = {
    Bengaluru: 'Bangalore',
    Bombay: 'Mumbai',
    'New Delhi': 'Delhi',
    'Delhi NCR': 'Delhi',
    'Nellore': 'Andhra Pradesh'
  };
  if (aliases[cleaned]) return aliases[cleaned];
  return CITY_OPTIONS.includes(cleaned) ? cleaned : 'Bangalore';
};

export default function App() {
  const { cartItems, wishlistItems, addToCart, updateCartQuantity, removeFromCart, removeFromWishlist } = useCart();
  const [theme, setTheme] = useState('dark');
  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState('Bangalore');
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  // Initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('sridurga_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedProfile = localStorage.getItem('sridurga_profile');

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      if (parsed.location) setUserLocation(normalizeCityName(parsed.location));
    } else {
      setProfile({ name: 'Sri Durga Client', email: 'client@sridurgasilver.com', phone: '', address: '', location: 'Bangalore' });
    }
  }, []);

  // Syncs
  useEffect(() => { if (profile) localStorage.setItem('sridurga_profile', JSON.stringify(profile)); }, [profile]);

  // API Fix: Using a CORS-friendly location provider
  const detectUserLocation = async () => {
    try {
      const res = await fetch('https://api.db-ip.com/v2/free/self');
      if (!res.ok) throw new Error('Location lookup failed');
      const data = await res.json();
      return normalizeCityName(data.city || data.stateProv || 'Bangalore');
    } catch (err) {
      console.warn('Location service failed, defaulting to Bangalore');
      return 'Bangalore';
    }
  };

  useEffect(() => {
    detectUserLocation().then(loc => {
      setUserLocation(loc);
      setProfile(prev => ({ ...prev, location: loc }));
    });
  }, []);

  const handleLocationChange = (newLocation) => {
    const normalized = normalizeCityName(newLocation);
    setUserLocation(normalized);
    setProfile((prev) => ({ ...prev, location: normalized }));
    setToastMessage(`Location updated to ${normalized}.`);
  };

  // State Handlers
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/" element={
        <Layout
          cartCount={cartCount}
          wishlistCount={wishlistItems.length}
          theme={theme}
          toggleTheme={() => {
            const newTheme = theme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('sridurga_theme', newTheme);
          }}
          cartPath="/cart"
          profilePath="/profile"
          wishlistPath="/wishlist"
          onOpenAdmin={() => navigate('/admin')}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userLocation={userLocation}
          onLocationChange={handleLocationChange}
        />
      }>
        <Route index element={<Home searchQuery={searchQuery} />} />
        <Route path="story" element={<Story />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="profile" element={<ProfilePage
          profile={profile}
          setProfile={setProfile}
          wishlistItems={wishlistItems}
          removeFromWishlist={removeFromWishlist}
        />} />
        <Route path="wishlist" element={<WishlistPage />} />
      </Route>
      <Route path="*" element={<Home searchQuery={searchQuery} />} />
    </Routes>
  );
}