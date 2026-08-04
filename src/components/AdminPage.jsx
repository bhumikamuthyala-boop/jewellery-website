import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD || 'sridurga-admin').trim();
const CLOUDINARY_CLOUD_NAME = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim();
const CLOUDINARY_UPLOAD_PRESET = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim();
const CLOUDINARY_FOLDER = (import.meta.env.VITE_CLOUDINARY_FOLDER || 'jewelry-products').trim();

const isPlaceholderCloudinaryPreset = (value) => !value || value.includes('YOUR_') || value.includes('YOUR PRESET');

export default function AdminPage({ onBackToStore }) {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({
        name: '',
        price: '',
        category: 'chains',
        image_url: '',
    });

    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    const fetchProducts = async () => {
        clearMessages();

        if (!supabase) {
            setError('Configure the Supabase connection first by setting VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
            setLoading(false);
            return;
        }

        setLoading(true);
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

    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
        }
    }, [isAuthenticated, supabase]);

    const handleLogin = (event) => {
        event.preventDefault();

        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
            setSuccess('Access enabled.');
        } else {
            setError('The password is incorrect.');
        }
    };

    const loadCloudinaryWidget = () => new Promise((resolve, reject) => {
        if (window.cloudinary?.createUploadWidget) {
            resolve(window.cloudinary);
            return;
        }

        const existingScript = document.querySelector('script[data-cloudinary-script="true"]');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(window.cloudinary), { once: true });
            existingScript.addEventListener('error', () => reject(new Error('The Cloudinary widget could not be loaded.')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://upload.cloudinary.com/modern/global/all.js';
        script.async = true;
        script.setAttribute('data-cloudinary-script', 'true');
        script.onload = () => resolve(window.cloudinary);
        script.onerror = () => reject(new Error('The Cloudinary widget could not be loaded.'));
        document.body.appendChild(script);
    });

    const handleUpload = async () => {
        const resolvedPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim();

        if (!CLOUDINARY_CLOUD_NAME || !resolvedPreset || isPlaceholderCloudinaryPreset(resolvedPreset)) {
            setError('Set a real VITE_CLOUDINARY_UPLOAD_PRESET in your environment before uploading.');
            return;
        }

        try {
            setIsUploading(true);
            setError('');

            const cloudinary = await loadCloudinaryWidget();
            if (typeof cloudinary?.createUploadWidget !== 'function') {
                throw new Error('The Cloudinary widget is not available in this browser session.');
            }

            const widget = cloudinary.createUploadWidget(
                {
                    cloudName: CLOUDINARY_CLOUD_NAME,
                    uploadPreset: resolvedPreset,
                    folder: CLOUDINARY_FOLDER,
                    resourceType: 'image',
                    sources: ['local', 'url'],
                    multiple: false,
                },
                (error, result) => {
                    if (!error && result?.event === 'success') {
                        setForm((prev) => ({ ...prev, image_url: result.info.secure_url }));
                        setSuccess('Image uploaded and ready to save.');
                    }

                    if (error) {
                        setError(error.message || 'Image upload failed.');
                    }

                    setIsUploading(false);
                },
            );

            if (typeof widget?.open !== 'function') {
                throw new Error('The Cloudinary widget could not be opened.');
            }

            widget.open();
        } catch (uploadError) {
            setError(uploadError.message || 'Image upload failed.');
            setIsUploading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!supabase) {
            setError('Supabase is not configured.');
            return;
        }

        if (!form.name.trim() || !form.price || !form.category.trim() || !form.image_url.trim()) {
            setError('Please complete every field, including the uploaded image.');
            return;
        }

        setSubmitting(true);
        setError('');

        const payload = {
            name: form.name.trim(),
            price: Number(form.price),
            category: form.category.trim(),
            image_url: form.image_url.trim(),
        };

        const { data, error: insertError } = await supabase.from('products').insert([payload]).select();

        if (insertError) {
            setError(insertError.message || 'Unable to add the product.');
        } else {
            setProducts((prev) => [data?.[0] || payload, ...prev]);
            setForm({ name: '', price: '', category: 'chains', image_url: '' });
            setSuccess('New product added successfully.');
        }

        setSubmitting(false);
    };

    const handleDelete = async (productId) => {
        if (!supabase) {
            setError('Supabase is not configured.');
            return;
        }

        const { error: deleteError } = await supabase.from('products').delete().eq('id', productId);

        if (deleteError) {
            setError(deleteError.message || 'Unable to delete the product.');
            return;
        }

        setProducts((prev) => prev.filter((item) => item.id !== productId));
        setSuccess('Product removed.');
    };

    return (
        <div className="admin-shell">
            <div className="admin-card">
                <div className="admin-header">
                    <div>
                        <p className="admin-kicker">Secure control panel</p>
                        <h1>Product manager</h1>
                    </div>
                    {isAuthenticated && (
                        <button type="button" className="admin-btn secondary" onClick={() => navigate('/')}>
                            Back to store
                        </button>
                    )}
                </div>

                {error ? <div className="admin-alert error">{error}</div> : null}
                {success ? <div className="admin-alert success">{success}</div> : null}

                {!isAuthenticated ? (
                    <form className="admin-login" onSubmit={handleLogin}>
                        <label htmlFor="admin-password">Enter the admin password</label>
                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Password"
                        />
                        <button type="submit" className="admin-btn">
                            Unlock dashboard
                        </button>
                    </form>
                ) : (
                    <div className="admin-grid">
                        <form className="admin-form" onSubmit={handleSubmit}>
                            <h2>Add new item</h2>
                            <label>
                                Name
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                    placeholder="Example: Pearl Pendant"
                                />
                            </label>

                            <label>
                                Price
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                                    placeholder="1999"
                                />
                            </label>

                            <label>
                                Category
                                <select
                                    value={form.category}
                                    onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                                >
                                    <option value="chains">Chains</option>
                                    <option value="earrings">Earrings</option>
                                    <option value="bracelets">Bracelets</option>
                                    <option value="rings">Rings</option>
                                    <option value="anklets">Anklets</option>
                                    <option value="pooja">Pooja Items</option>
                                </select>
                            </label>

                            <div className="upload-row">
                                <button type="button" className="admin-btn secondary" onClick={handleUpload} disabled={isUploading}>
                                    {isUploading ? 'Uploading…' : 'Upload Image'}
                                </button>
                                {form.image_url ? <span className="upload-chip">Image selected</span> : <span className="upload-chip muted">No image yet</span>}
                            </div>

                            <button type="submit" className="admin-btn" disabled={submitting}>
                                {submitting ? 'Saving…' : 'Add product'}
                            </button>
                        </form>

                        <div className="admin-list">
                            <div className="admin-list-header">
                                <h2>Current inventory</h2>
                                <span>{products.length} item(s)</span>
                            </div>

                            {loading ? (
                                <p className="admin-placeholder">Loading products…</p>
                            ) : products.length === 0 ? (
                                <p className="admin-placeholder">No products are in the Supabase table yet.</p>
                            ) : (
                                <div className="table-wrap">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Category</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product.id}>
                                                    <td>
                                                        {product.image_url ? <img src={product.image_url} alt={product.name} className="product-thumb" /> : '—'}
                                                    </td>
                                                    <td>{product.name}</td>
                                                    <td>₹{Number(product.price).toLocaleString()}</td>
                                                    <td>{product.category}</td>
                                                    <td>
                                                        <button type="button" className="admin-btn delete" onClick={() => handleDelete(product.id)}>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
