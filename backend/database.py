import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "jewelry.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create products table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price INTEGER NOT NULL,
            image TEXT NOT NULL,
            description TEXT NOT NULL,
            badge TEXT,
            metal TEXT NOT NULL,
            stone TEXT NOT NULL,
            weight TEXT NOT NULL,
            origin TEXT NOT NULL
        )
    ''')
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            address TEXT,
            member_since TEXT
        )
    ''')
    
    # Create wishlist table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(product_id) REFERENCES products(id),
            UNIQUE(user_id, product_id)
        )
    ''')
    
    # Seed products if empty
    cursor.execute('SELECT COUNT(*) FROM products')
    if cursor.fetchone()[0] == 0:
        products_data = [
            (
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
            ),
            (
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
            ),
            (
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
            ),
            (
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
            ),
            (
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
            ),
            (
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
            ),
            (
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
            ),
            (
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
            ),
            (
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
            ),
            (
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
            ),
            (
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
            ),
            (
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
            ),
            (
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
            ),
            (
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
            )
        ]
        cursor.executemany('''
            INSERT INTO products (id, name, category, price, image, description, badge, metal, stone, weight, origin)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', products_data)
        print("Products seeded successfully!")

    # Seed default user if empty
    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] == 0:
        cursor.execute('''
            INSERT INTO users (id, name, email, phone, address, member_since)
            VALUES (1, 'Sri Durga Client', 'client@sridurgasilver.com', '+91 80 555-MOON', 'Commercial Street, Bangalore, KA, India', 'July 2026')
        ''')
        print("Default user seeded successfully!")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
