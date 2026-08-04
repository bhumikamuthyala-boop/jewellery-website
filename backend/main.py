from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import database

# Initialize Database on Startup
database.init_db()

app = FastAPI(title="Sri Durga Moon Light Silver Full-Stack API")

# Enable CORS for frontend port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User Profile Schema
class UserProfileUpdate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None

@app.get("/api/products")
def get_products(q: Optional[str] = None, category: Optional[str] = None):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM products WHERE 1=1"
    params = []
    
    if category and category != 'all':
        query += " AND category = ?"
        params.append(category)
        
    if q:
        query += " AND (name LIKE ? OR description LIKE ?)"
        params.append(f"%{q}%")
        params.append(f"%{q}%")
        
    cursor.execute(query, params)
    rows = cursor.fetchall()
    
    products = []
    for r in rows:
        products.append({
            "id": r["id"],
            "name": r["name"],
            "category": r["category"],
            "price": r["price"],
            "image": r["image"],
            "description": r["description"],
            "badge": r["badge"],
            "specs": {
                "metal": r["metal"],
                "stone": r["stone"],
                "weight": r["weight"],
                "origin": r["origin"]
            }
        })
        
    conn.close()
    return products

@app.get("/api/profile")
def get_profile(user_id: int = 1):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    return {
        "id": row["id"],
        "name": row["name"],
        "email": row["email"],
        "phone": row["phone"],
        "address": row["address"],
        "member_since": row["member_since"]
    }

@app.put("/api/profile")
def update_profile(profile: UserProfileUpdate, user_id: int = 1):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    
    # Check if another user already has this email
    cursor.execute("SELECT id FROM users WHERE email = ? AND id != ?", (profile.email, user_id))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already in use")
        
    cursor.execute('''
        UPDATE users 
        SET name = ?, email = ?, phone = ?, address = ?
        WHERE id = ?
    ''', (profile.name, profile.email, profile.phone, profile.address, user_id))
    conn.commit()
    conn.close()
    
    return {"status": "success", "message": "Profile updated successfully"}

@app.get("/api/wishlist")
def get_wishlist(user_id: int = 1):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT product_id FROM wishlist WHERE user_id = ?", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    
    return [r["product_id"] for r in rows]

@app.post("/api/wishlist/{product_id}")
def add_to_wishlist(product_id: int, user_id: int = 1):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    
    # Check if product exists
    cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")
        
    try:
        cursor.execute("INSERT OR IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)", (user_id, product_id))
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
        
    conn.close()
    return {"status": "success", "message": "Added to wishlist"}

@app.delete("/api/wishlist/{product_id}")
def remove_from_wishlist(product_id: int, user_id: int = 1):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?", (user_id, product_id))
    conn.commit()
    conn.close()
    
    return {"status": "success", "message": "Removed from wishlist"}
