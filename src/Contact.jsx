import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';

export default function Contact() {
    return (
        <section className="contact-section section-padding" id="contact">
            <div className="container">
                <div className="section-title">
                    <h2>Contact <span>Us</span></h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', margin: '1rem auto 0 auto', textAlign: 'center' }}>
                        Have a question about our silver collection? Reach out and we will help you choose the perfect piece.
                    </p>
                </div>

                <div className="contact-grid" style={{ gap: '2rem', marginTop: '2.5rem' }}>
                    <div className="contact-info-panel" style={{ padding: '2rem', borderRadius: '18px', background: 'var(--bg-tertiary)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Get in Touch</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            We are here to answer your questions about custom orders, shipping, product details, and more.
                        </p>

                        <div style={{ marginTop: '1.8rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Email:</strong> <a href="mailto:info@sridurgasilver.com">info@sridurgasilver.com</a>
                            </div>
                            <div>
                                <strong>Phone:</strong> <a href="tel:+919876543210">+91 98765 43210</a>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                            <Link
                                to="/profile"
                                className="btn-secondary"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.9rem 1.2rem',
                                    borderRadius: '14px',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-primary)',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                }}
                            >
                                <FaUser />
                                Your Profile
                            </Link>

                            <Link
                                to="/admin"
                                className="btn-secondary"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.9rem 1.2rem',
                                    borderRadius: '14px',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-primary)',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                }}
                            >
                                <FaLock />
                                Admin Access
                            </Link>
                        </div>
                    </div>

                    <div className="contact-form-container" style={{ padding: '2rem', borderRadius: '18px', background: 'var(--bg-secondary)' }}>
                        <form>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    style={{
                                        padding: '0.9rem',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-light)',
                                        background: 'var(--bg-tertiary)',
                                        color: 'var(--text-primary)',
                                    }}
                                />
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    style={{
                                        padding: '0.9rem',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-light)',
                                        background: 'var(--bg-tertiary)',
                                        color: 'var(--text-primary)',
                                    }}
                                />
                                <textarea
                                    placeholder="Your message"
                                    rows="5"
                                    style={{
                                        padding: '0.9rem',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-light)',
                                        background: 'var(--bg-tertiary)',
                                        color: 'var(--text-primary)',
                                        resize: 'vertical',
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn-primary"
                                    style={{ width: 'fit-content' }}
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
