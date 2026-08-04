import React, { useState, useEffect } from 'react';

export default function UserProfile({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  wishlistProducts,
  onRemoveFromWishlist,
  onQuickView,
  onAddToCart,
}) {
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'wishlist'
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    location: profile?.location || 'Bangalore',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        location: profile.location || 'Bangalore',
      });
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSaving(true);

    try {
      const success = await onUpdateProfile(formData);
      if (success) {
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setErrorMsg('Failed to update profile. Email might already be in use.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div
      className="modal-overlay open"
      style={{ zIndex: 1150 }}
      onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) onClose();
      }}
    >
      <div
        className="modal-content-wrapper"
        style={{
          maxWidth: '800px',
          gridTemplateColumns: '1fr',
          borderRadius: '8px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <button
          className="close-modal-btn"
          onClick={onClose}
          aria-label="Close Profile"
          style={{ top: '1rem', right: '1rem' }}
        >
          &times;
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px' }}>
          {/* Dashboard Header */}
          <div
            style={{
              padding: '2.5rem 2.5rem 1rem 2.5rem',
              borderBottom: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-tertiary)',
            }}
          >
            <h2 style={{ fontSize: '1.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Boutique <span style={{ color: 'var(--accent-silver)' }}>Dashboard</span>
            </h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
              <button
                style={{
                  paddingBottom: '0.5rem',
                  borderBottom: activeTab === 'details' ? '2px solid var(--accent-silver)' : '2px solid transparent',
                  color: activeTab === 'details' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}
                onClick={() => setActiveTab('details')}
              >
                Profile Details
              </button>
              <button
                style={{
                  paddingBottom: '0.5rem',
                  borderBottom: activeTab === 'wishlist' ? '2px solid var(--accent-silver)' : '2px solid transparent',
                  color: activeTab === 'wishlist' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}
                onClick={() => setActiveTab('wishlist')}
              >
                Saved Wishlist ({wishlistProducts.length})
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div style={{ padding: '2.5rem', flexGrow: 1, overflowY: 'auto' }}>
            {activeTab === 'details' ? (
              <div>
                {successMsg && (
                  <div style={{ color: '#10b981', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    <i className="fas fa-check-circle"></i> {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div style={{ color: '#ef4444', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    <i className="fas fa-exclamation-circle"></i> {errorMsg}
                  </div>
                )}

                {!isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', fontSize: '0.95rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Client Name:</span>
                      <span>{profile?.name}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', fontSize: '0.95rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Email Address:</span>
                      <span>{profile?.email}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', fontSize: '0.95rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Phone Desk:</span>
                      <span>{profile?.phone || 'Not Provided'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', fontSize: '0.95rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Delivery Address:</span>
                      <span>{profile?.address || 'Not Provided'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', fontSize: '0.95rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Active Location:</span>
                      <span>{profile?.location || 'Bangalore'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', fontSize: '0.95rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Member Since:</span>
                      <span>{profile?.member_since || 'July 2026'}</span>
                    </div>

                    <button
                      className="btn-primary"
                      style={{ marginTop: '1.5rem', width: 'fit-content' }}
                      onClick={() => {
                        setFormData({
                          name: profile?.name || '',
                          email: profile?.email || '',
                          phone: profile?.phone || '',
                          address: profile?.address || '',
                          location: profile?.location || 'Bangalore',
                        });
                        setIsEditing(true);
                      }}
                    >
                      Edit Info
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-primary)',
                          padding: '0.8rem',
                          outline: 'none',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-primary)',
                          padding: '0.8rem',
                          outline: 'none',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-primary)',
                          padding: '0.8rem',
                          outline: 'none',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Preferred Location</label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-primary)',
                          padding: '0.8rem',
                          outline: 'none',
                          borderRadius: '4px',
                          fontFamily: 'inherit'
                        }}
                      >
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Boutique Shipping Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-primary)',
                          padding: '0.8rem',
                          outline: 'none',
                          borderRadius: '4px',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={isSaving}
                        style={{ padding: '0.8rem 2rem', letterSpacing: '0.1em' }}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => setIsEditing(false)}
                        style={{ padding: '0.8rem 2rem', letterSpacing: '0.1em', borderColor: 'transparent' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div>
                {wishlistProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                    <i className="far fa-heart" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}></i>
                    <p>No items saved to your wishlist yet.</p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '1.5rem',
                    }}
                  >
                    {wishlistProducts.map((product) => (
                      <div
                        key={product.id}
                        className="product-card"
                        style={{ margin: 0, backgroundColor: 'var(--bg-tertiary)' }}
                      >
                        <div className="product-image-container" style={{ aspectRatio: '1' }}>
                          <button
                            className="wishlist-toggle-btn active"
                            onClick={() => onRemoveFromWishlist(product.id)}
                            style={{ top: '10px', right: '10px' }}
                            title="Remove from Saved"
                          >
                            <i className="fas fa-heart"></i>
                          </button>
                          <img
                            src={product.image}
                            alt={product.name}
                            className={`product-image ${product.category === 'earrings' ? 'sharpened-image' : ''}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div className="product-actions-overlay" style={{ padding: '1rem' }}>
                            <button
                              className="overlay-btn view-btn"
                              style={{ fontSize: '0.65rem', padding: '0.5rem' }}
                              onClick={() => onQuickView(product)}
                            >
                              View
                            </button>
                            <button
                              className="overlay-btn add-btn"
                              style={{ fontSize: '0.65rem', padding: '0.5rem' }}
                              onClick={() => onAddToCart(product)}
                            >
                              Add
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
