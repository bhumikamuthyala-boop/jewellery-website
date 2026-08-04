import React from 'react';

export default function Story() {
    return (
        <section className="story-section section-padding" id="story">
            <div className="container">
                <div className="section-title">
                    <h2>Our <span>Story</span></h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', margin: '1rem auto 0 auto', textAlign: 'center' }}>
                        Discover the heritage of Sri Durga Moon Light Silver. Each piece is crafted to celebrate tradition, elegance, and the radiant beauty of silver.
                    </p>
                </div>

                <div className="story-content" style={{ marginTop: '2rem', lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    <p>
                        For decades, our collection has brought timeless silver designs into modern wardrobes. We blend artisan expertise with premium materials to build pieces that feel personal, meaningful, and unforgettable.
                    </p>
                    <p>
                        Whether you're shopping for yourself or gifting a loved one, our story is grounded in craftsmanship, authenticity, and the belief that the finest jewelry should be accessible to every cherished moment.
                    </p>
                </div>
            </div>
        </section>
    );
}
