import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import UserProfile from './components/UserProfile';

export default function ProfilePage({ profile, setProfile, wishlistItems, removeFromWishlist }) {
    const navigate = useNavigate();
    const { cartItems, addToCart } = useCart();

    const handleUpdateProfile = async (updates) => {
        setProfile((prev) => ({ ...prev, ...updates }));
        return true;
    };

    const onQuickView = (product) => {
        if (!product) return;
        navigate('/');
    };

    return (
        <div className="profile-page section-padding">
            <div className="container">
                <UserProfile
                    isOpen={true}
                    onClose={() => navigate('/')}
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                    wishlistProducts={wishlistItems}
                    onRemoveFromWishlist={removeFromWishlist}
                    onQuickView={onQuickView}
                    onAddToCart={addToCart}
                />
            </div>
        </div>
    );
}
