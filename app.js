// Sri Durga Moon Light Silver - Premium 92.5 Sterling Silver Collection Database
const PRODUCTS = [
  {
    id: 1,
    name: "Necklace Set",
    category: "chains",
    price: 2999,
    image: "assets/necklace.jpg",
    description: "A gorgeous, BIS Hallmarked 92.5 Sterling Silver necklace and earring set. Expertly matched for brilliance and styled with rhodium plating for a lifetime tarnish-free wear.",
    badge: "Signature Set",
    specs: {
      metal: "92.5 Sterling Silver",
      stone: "Premium Cubic Zirconia",
      weight: "28.5 Grams",
      origin: "Handcrafted in India"
    }
  },
  {
    id: 2,
    name: "Studs",
    category: "earrings",
    price: 849,
    image: "assets/Studs.jpeg",
    description: "Delicate heart studs in solid 92.5 Sterling Silver. Safe, nickel-free, and hypoallergenic. The perfect addition to your everyday silver style.",
    badge: "Bestseller",
    specs: {
      metal: "92.5 Sterling Silver (Nickel Free)",
      stone: "None",
      weight: "3.2 Grams",
      origin: "Skin-Safe Certified"
    }
  },
  {
    id: 3,
    name: "Hoops",
    category: "earrings",
    price: 949,
    image: "assets/Earrings.jpeg",
    description: "Small sterling silver hoop earrings designed with a secure snap closure. A shimmering classic look with absolute tarnish-free durability.",
    badge: "New",
    specs: {
      metal: "92.5 Sterling Silver",
      stone: "None",
      weight: "4.8 Grams",
      origin: "Artisan Crafted"
    }
  },
  {
    id: 4,
    name: "Bracelets",
    category: "bracelets",
    price: 1449,
    image: "assets/bracelets.jpeg",
    description: "A premium solid 92.5 Sterling Silver bracelet, designed for everyday durability and elegance. Easily adjustable link closure.",
    badge: "92.5 Hallmark",
    specs: {
      metal: "92.5 Sterling Silver",
      stone: "None",
      weight: "12.4 Grams",
      origin: "BIS Certified"
    }
  },
  {
    id: 5,
    name: "Solitaire Ring",
    category: "rings",
    price: 1849,
    image: "assets/ring_solitaire.jpg",
    description: "A stunning, BIS Hallmarked 92.5 Sterling Silver solitaire ring featuring a brilliant-cut premium cubic zirconia. Elegant, timeless, and tarnish-free.",
    badge: "Exclusive",
    specs: {
      metal: "92.5 Sterling Silver",
      stone: "Brilliant-Cut Solitaire",
      weight: "5.5 Grams",
      origin: "Handcrafted in India"
    }
  }
];

// App State
let cart = JSON.parse(localStorage.getItem('sridurga_cart')) || [];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  renderProducts(PRODUCTS);
  initFilters();
  initCart();
  initProductModal();
  initContactForm();
  initNewsletter();
});

/* ==========================================================================
   1. Theme Toggle System
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  
  const savedTheme = localStorage.getItem('sridurga_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, themeIcon);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('sridurga_theme', newTheme);
    updateThemeIcon(newTheme, themeIcon);
  });
}

function updateThemeIcon(theme, iconEl) {
  if (theme === 'light') {
    iconEl.className = 'fas fa-moon';
  } else {
    iconEl.className = 'fas fa-sun';
  }
}

/* ==========================================================================
   2. Sticky Navbar & Responsive Menu
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      
      navLinks.querySelectorAll('a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

/* ==========================================================================
   3. Product Rendering & Gallery Filters
   ========================================================================== */
function renderProducts(productsList) {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';

  if (productsList.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem 0;">No items found in this category.</div>`;
    return;
  }

  productsList.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.category = product.category;

    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(product.price);

    card.innerHTML = `
      <div class="product-image-container">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <img src="${product.image}" alt="${product.name}" class="product-image ${product.category === 'earrings' ? 'sharpened-image' : ''}" loading="lazy">
        <div class="product-actions-overlay">
          <button class="overlay-btn view-btn" onclick="openQuickView(${product.id})">Quick View</button>
          <button class="overlay-btn add-btn" onclick="handleAddToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-cat">${product.category === 'chains' ? 'chains / necklaces' : product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${formattedPrice}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const productGrid = document.getElementById('product-grid');

      productGrid.style.opacity = 0;
      productGrid.style.transform = 'translateY(15px)';
      productGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

      setTimeout(() => {
        if (filter === 'all') {
          renderProducts(PRODUCTS);
        } else {
          const filtered = PRODUCTS.filter(p => p.category === filter);
          renderProducts(filtered);
        }
        productGrid.style.opacity = 1;
        productGrid.style.transform = 'translateY(0)';
      }, 300);
    });
  });
}

/* ==========================================================================
   4. Interactive Cart System
   ========================================================================== */
function initCart() {
  const cartBtn = document.getElementById('cart-btn');
  const closeCart = document.getElementById('close-cart');
  const cartDrawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('drawer-backdrop');

  cartBtn.addEventListener('click', () => {
    cartDrawer.classList.add('open');
    backdrop.classList.add('open');
  });

  const closeCartFunc = () => {
    cartDrawer.classList.remove('open');
    backdrop.classList.remove('open');
  };

  closeCart.addEventListener('click', closeCartFunc);
  backdrop.addEventListener('click', closeCartFunc);

  updateCartUI();
}

function handleAddToCart(productId) {
  addToCart(productId);
  openCartDrawer();
}

function openCartDrawer() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('drawer-backdrop').classList.add('open');
}

function addToCart(productId, qty = 1) {
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    const product = PRODUCTS.find(p => p.id === productId);
    cart.push({
      ...product,
      quantity: qty
    });
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartUI();
    }
  }
}

function saveCart() {
  localStorage.setItem('sridurga_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartCountBubble = document.getElementById('cart-count');
  const cartContainer = document.getElementById('cart-items');
  const cartTotalPrice = document.getElementById('cart-total');
  
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountBubble.textContent = totalCount;
  
  cartContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty-message">
        <i class="fas fa-gem" style="display: block;"></i>
        <p>Your silver collection is empty</p>
      </div>
    `;
    cartTotalPrice.textContent = "₹0";
    return;
  }

  let totalAmount = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(item.price);

    const itemRow = document.createElement('div');
    itemRow.className = 'cart-item';
    itemRow.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img ${item.category === 'earrings' ? 'sharpened-image' : ''}">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <span class="cart-item-price">${formattedPrice}</span>
        <div class="cart-item-quantity">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
        <i class="far fa-trash-alt"></i>
      </button>
    `;
    cartContainer.appendChild(itemRow);
  });

  cartTotalPrice.textContent = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(totalAmount);
}

function checkout() {
  if (cart.length === 0) return;
  alert("Thank you for choosing Sri Durga Moon Light Silver. Our customer care will contact you shortly to confirm your certified 92.5 silver purchase details.");
  cart = [];
  saveCart();
  updateCartUI();
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('drawer-backdrop').classList.remove('open');
}

/* ==========================================================================
   5. Product Quick View Modal
   ========================================================================== */
function initProductModal() {
  const modal = document.getElementById('product-modal');
  const closeModal = document.getElementById('close-modal');

  const closeModalFunc = () => {
    modal.classList.remove('open');
  };

  closeModal.addEventListener('click', closeModalFunc);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModalFunc();
    }
  });
}

function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('product-modal');
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  const modalImg = modal.querySelector('.modal-img');
  modalImg.src = product.image;
  modalImg.alt = product.name;
  if (product.category === 'earrings') {
    modalImg.classList.add('sharpened-image');
  } else {
    modalImg.classList.remove('sharpened-image');
  }
  modal.querySelector('.modal-cat').textContent = product.category === 'chains' ? 'chains / necklaces' : product.category;
  modal.querySelector('.modal-title').textContent = product.name;
  modal.querySelector('.modal-price').textContent = formattedPrice;
  modal.querySelector('.modal-desc').textContent = product.description;
  
  modal.querySelector('#spec-metal').textContent = product.specs.metal;
  modal.querySelector('#spec-stone').textContent = product.specs.stone;
  modal.querySelector('#spec-weight').textContent = product.specs.weight;
  modal.querySelector('#spec-origin').textContent = product.specs.origin;

  const addBtn = modal.querySelector('.modal-add-btn');
  addBtn.onclick = () => {
    handleAddToCart(product.id);
    modal.classList.remove('open');
  };

  modal.classList.add('open');
}

// Global exposing for inline HTML event click callbacks
window.openQuickView = openQuickView;
window.handleAddToCart = handleAddToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;

/* ==========================================================================
   6. Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('.form-input');
  
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    input.addEventListener('input', () => {
      const group = input.parentElement;
      group.classList.remove('invalid');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      const submitBtn = form.querySelector('.form-submit-btn');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = "Connecting with boutique...";
      
      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        const successAlert = document.getElementById('form-success');
        successAlert.style.display = 'block';
        
        setTimeout(() => {
          successAlert.style.display = 'none';
        }, 5000);
      }, 1500);
    }
  });
}

function validateField(input) {
  const group = input.parentElement;
  const val = input.value.trim();
  let isValid = true;
  let errorMsg = "This field is required";

  if (val === '') {
    isValid = false;
  } else if (input.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      isValid = false;
      errorMsg = "Please enter a valid email address";
    }
  } else if (input.id === 'message' && val.length < 10) {
    isValid = false;
    errorMsg = "Message must be at least 10 characters long";
  }

  if (!isValid) {
    group.classList.add('invalid');
    group.querySelector('.error-message').textContent = errorMsg;
  } else {
    group.classList.remove('invalid');
  }

  return isValid;
}

/* ==========================================================================
   7. Newsletter Form Handling
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const val = input.value.trim();
    
    if (val === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      alert("Please enter a valid email address.");
      return;
    }

    alert("Welcome to the exclusive circle of Sri Durga Moon Light Silver. You are now subscribed.");
    input.value = '';
  });
}
