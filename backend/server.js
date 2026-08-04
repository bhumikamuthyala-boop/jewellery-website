const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Database Setup
const dbPath = path.join(__dirname, 'jewelry.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database.');
    initDb();
  }
});

// Initialize database schema and seed data
function initDb() {
  db.serialize(() => {
    // 1. Products Table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT NOT NULL,
        description TEXT,
        badge TEXT,
        metal TEXT,
        stone TEXT,
        weight TEXT,
        origin TEXT
      )
    `);

    // 2. Users Table (with location column)
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        address TEXT,
        location TEXT,
        member_since TEXT
      )
    `);

    // 3. Wishlist Table
    db.run(`
      CREATE TABLE IF NOT EXISTS wishlist (
        user_id INTEGER,
        product_id INTEGER,
        PRIMARY KEY(user_id, product_id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(product_id) REFERENCES products(id),
        UNIQUE(user_id, product_id)
      )
    `);

    // Seed data if empty
    db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
      if (err) return console.error(err);
      if (row.count === 0) {
        const stmt = db.prepare(`
          INSERT INTO products (id, name, category, price, image, description, badge, metal, stone, weight, origin)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const productsData = [
          [
            1,
            "Necklace Set",
            "chains",
            2999,
            "assets/necklace.jpg",
            "A gorgeous, BIS Hallmarked 92.5 Sterling Silver necklace and earring set. Expertly matched for brilliance and styled with rhodium plating for a lifetime tarnish-free wear.",
            "Signature Set",
            "92.5 Sterling Silver",
            "Premium Cubic Zirconia",
            "28.5 Grams",
            "Handcrafted in India"
          ],
          [
            2,
            "Studs",
            "earrings",
            849,
            "assets/studs.jpg",
            "Delicate heart studs in solid 92.5 Sterling Silver. Safe, nickel-free, and hypoallergenic. The perfect addition to your everyday silver style.",
            "Bestseller",
            "92.5 Sterling Silver (Nickel Free)",
            "None",
            "3.2 Grams",
            "Skin-Safe Certified"
          ],
          [
            3,
            "Hoops",
            "earrings",
            949,
            "assets/earrings.jpg",
            "Small sterling silver hoop earrings designed with a secure snap closure. A shimmering classic look with absolute tarnish-free durability.",
            "New",
            "92.5 Sterling Silver",
            "None",
            "4.8 Grams",
            "Artisan Crafted"
          ],
          [
            4,
            "Bracelets",
            "bracelets",
            1449,
            "assets/braclets.jpg",
            "A premium solid 92.5 Sterling Silver bracelet, designed for everyday durability and elegance. Easily adjustable link closure.",
            "92.5 Hallmark",
            "92.5 Sterling Silver",
            "None",
            "12.4 Grams",
            "BIS Certified"
          ],
          [
            5,
            "Solitaire Ring",
            "rings",
            1849,
            "assets/ring_solitaire.jpg",
            "A stunning, BIS Hallmarked 92.5 Sterling Silver solitaire ring featuring a brilliant-cut premium cubic zirconia. Elegant, timeless, and tarnish-free.",
            "Exclusive",
            "92.5 Sterling Silver",
            "Brilliant-Cut Solitaire",
            "5.5 Grams",
            "Handcrafted in India"
          ],
          [
            6,
            "Classic Silver Chain",
            "chains",
            1599,
            "assets/necklace_classic.jpg",
            "A premium classic link chain crafted in solid 92.5 sterling silver, perfect for everyday wear.",
            "Classic",
            "92.5 Sterling Silver",
            "None",
            "8.5 Grams",
            "Handcrafted in India"
          ],
          [
            7,
            "Pendant Silver Chain",
            "chains",
            2199,
            "assets/necklace_pendant.jpg",
            "A beautiful sterling silver necklace featuring a sparkling sapphire pendant. Rhodium polished.",
            "New Arrival",
            "92.5 Sterling Silver",
            "Blue Sapphire CZ",
            "10.2 Grams",
            "Artisan Crafted"
          ],
          [
            8,
            "Delicate Choker",
            "chains",
            1799,
            "assets/necklace_choker.jpg",
            "An elegant slim silver choker necklace with a sleek, minimalist link style.",
            "Minimalist",
            "92.5 Sterling Silver",
            "None",
            "6.8 Grams",
            "BIS Certified"
          ],
          [
            9,
            "Pearl Drop Earrings",
            "earrings",
            1299,
            "assets/earrings_pearl.jpg",
            "Graceful sterling silver drop earrings set with premium white freshwater pearls.",
            "Elegant",
            "92.5 Sterling Silver",
            "Freshwater Pearl",
            "5.4 Grams",
            "Handcrafted in India"
          ],
          [
            10,
            "Teardrop Filigree",
            "earrings",
            1499,
            "assets/earrings_drop.jpg",
            "Exquisite filigree drop earrings handcrafted in pure 92.5 sterling silver.",
            "Handcrafted",
            "92.5 Sterling Silver",
            "None",
            "7.2 Grams",
            "Artisan Crafted"
          ],
          [
            11,
            "Leaf Climbers",
            "earrings",
            1199,
            "assets/earrings_climber.jpg",
            "Stunning leaf climber earrings designed to trace the ear contour elegantly.",
            "Trendy",
            "92.5 Sterling Silver",
            "Mini Cubic Zirconia",
            "4.1 Grams",
            "Skin-Safe Certified"
          ],
          [
            12,
            "Minimalist Cuff",
            "bracelets",
            1999,
            "assets/bracelet_cuff.jpg",
            "A polished solid silver cuff bracelet with a sleek, open-ended minimalist profile.",
            "Bestseller",
            "92.5 Sterling Silver",
            "None",
            "14.5 Grams",
            "Handcrafted in India"
          ],
          [
            13,
            "Celestial Charm",
            "bracelets",
            2399,
            "assets/bracelet_charm.jpg",
            "An elegant link bracelet adorned with dangling sterling silver celestial charms.",
            "Fancy",
            "92.5 Sterling Silver",
            "Star & Moon CZ",
            "11.8 Grams",
            "Artisan Crafted"
          ],
          [
            14,
            "Classic Bangles Set",
            "bracelets",
            2799,
            "assets/bracelet_bangle.jpg",
            "A premium set of three highly-polished sterling silver bangle bracelets.",
            "Set of 3",
            "92.5 Sterling Silver",
            "None",
            "22.1 Grams",
            "BIS Certified"
          ]
        ];

        for (const prod of productsData) {
          stmt.run(prod);
        }
        stmt.finalize();
        console.log('Seeded products database table successfully.');
      }
    });

    // Seed default user if empty
    db.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
      if (err) return console.error(err);
      if (row.count === 0) {
        db.run(`
          INSERT INTO users (id, name, email, phone, address, location, member_since)
          VALUES (1, 'Sri Durga Client', 'client@sridurgasilver.com', '+91 80 555-MOON', 'Commercial Street, Bangalore, KA, India', 'Bangalore', 'July 2026')
        `, (err2) => {
          if (err2) console.error(err2);
          else console.log('Seeded default user profile successfully.');
        });
      }
    });
  });
}

// REST API Endpoints

// 1. GET /api/products
app.get('/api/products', (req, res) => {
  const { category, q, location } = req.query;
  
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (q) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const city = location || 'Bangalore';
    const products = rows.map((r) => {
      // Prioritize / calculate dynamic delivery estimates based on location selection
      const isExpress = r.id % 2 === 0;
      const deliveryInfo = isExpress 
        ? `⚡ Express Delivery (1-2 days) to ${city}` 
        : `Standard Delivery (3-5 days) to ${city}`;

      return {
        id: r.id,
        name: r.name,
        category: r.category,
        price: r.price,
        image: r.image,
        description: r.description,
        badge: r.badge,
        delivery_info: deliveryInfo,
        specs: {
          metal: r.metal,
          stone: r.stone,
          weight: r.weight,
          origin: r.origin
        }
      };
    });

    res.json(products);
  });
});

// 2. GET /api/profile
app.get('/api/profile', (req, res) => {
  const userId = 1;
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      location: row.location || 'Bangalore',
      member_since: row.member_since
    });
  });
});

// 3. PUT /api/profile
app.put('/api/profile', (req, res) => {
  const userId = 1;
  const { name, email, phone, address, location } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required fields.' });
  }

  // Check if another user has this email
  db.get('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    db.run(
      `UPDATE users 
       SET name = ?, email = ?, phone = ?, address = ?, location = ? 
       WHERE id = ?`,
      [name, email, phone || null, address || null, location || 'Bangalore', userId],
      function (err2) {
        if (err2) {
          return res.status(500).json({ error: err2.message });
        }
        res.json({ status: 'success', message: 'Profile updated successfully.' });
      }
    );
  });
});

// 4. GET /api/wishlist
app.get('/api/wishlist', (req, res) => {
  const userId = 1;
  db.all('SELECT product_id FROM wishlist WHERE user_id = ?', [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows.map((r) => r.product_id));
  });
});

// 5. POST /api/wishlist/:productId
app.post('/api/wishlist/:productId', (req, res) => {
  const userId = 1;
  const productId = parseInt(req.params.productId, 10);

  // Check if product exists first
  db.get('SELECT id FROM products WHERE id = ?', [productId], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    db.run(
      'INSERT OR IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [userId, productId],
      (err2) => {
        if (err2) {
          return res.status(500).json({ error: err2.message });
        }
        res.json({ status: 'success', message: 'Added to wishlist.' });
      }
    );
  });
});

// 6. DELETE /api/wishlist/:productId
app.delete('/api/wishlist/:productId', (req, res) => {
  const userId = 1;
  const productId = parseInt(req.params.productId, 10);

  db.run(
    'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
    [userId, productId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ status: 'success', message: 'Removed from wishlist.' });
    }
  );
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
