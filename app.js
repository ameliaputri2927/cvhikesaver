// Setup simple App State & localStorage Mock DB
const DB_USERS = 'hs_users';
const DB_CART = 'hs_cart';
const DB_ORDERS = 'hs_orders';
const DB_FEEDBACK = 'hs_feedback';
const DB_SESSION = 'hs_session';

// Initialization
function initDB() {
    let users = JSON.parse(localStorage.getItem(DB_USERS)) || [];
    
    // Ensure the required admin account exists
    const hasAdmin = users.find(u => u.email === 'hikesaver@gmail.com');
    if (!hasAdmin) {
        users.push({ id: 0, name: 'HikeSaver Admin', email: 'hikesaver@gmail.com', pass: 'hikesaver_15092025', role: 'admin' });
        localStorage.setItem(DB_USERS, JSON.stringify(users));
    }

    if (!localStorage.getItem(DB_CART)) localStorage.setItem(DB_CART, JSON.stringify([]));
    if (!localStorage.getItem(DB_ORDERS)) localStorage.setItem(DB_ORDERS, JSON.stringify([]));
    if (!localStorage.getItem(DB_FEEDBACK)) localStorage.setItem(DB_FEEDBACK, JSON.stringify([]));
}

// Auth Helpers
function getSession() {
    return JSON.parse(localStorage.getItem(DB_SESSION));
}
function setSession(user) {
    localStorage.setItem(DB_SESSION, JSON.stringify(user));
}
function logout() {
    localStorage.removeItem(DB_SESSION);
    window.location.href = 'login.html';
}

// Cart Helpers
function getCart() {
    return JSON.parse(localStorage.getItem(DB_CART)) || [];
}
function addToCart(product) {
    let cart = getCart();
    let existing = cart.find(i => i.id === product.id);
    if(existing) {
        existing.qty += product.qty;
    } else {
        cart.push(product);
    }
    localStorage.setItem(DB_CART, JSON.stringify(cart));
    updateCartCount();
    alert('Added to cart!');
}
function clearCart() {
    localStorage.setItem(DB_CART, JSON.stringify([]));
    updateCartCount();
}

// UI Injectors
function injectHeader() {
    const session = getSession();
    const isAdmin = session && session.role === 'admin';
    
    let authLinks = '';
    if(session) {
        authLinks = `
            <div style="display:flex; align-items:center; gap:15px; background:rgba(26,67,41,0.05); border: 1px solid rgba(26,67,41,0.1); padding:6px 14px; border-radius:24px; font-size:0.95rem; font-weight:600; color:var(--primary-color);">
                <span>👤 ${session.name}</span>
                <div style="width:1px; height:14px; background:#ccc;"></div>
                <a href="#" onclick="logout()" style="color:#d32f2f; font-weight:500;" title="Logout">Logout</a>
            </div>
        `;
    } else {
        authLinks = '<a href="login.html" class="btn-primary" style="padding: 8px 18px; border-radius: 20px;">Login / Register</a>';
    }

    const headerHTML = `
        <header class="navbar">
            <div class="container nav-container">
                <a href="index.html" class="nav-brand">
                    <img src="LOGO HIKESAVER.jpeg" alt="HikeSaver Logo">
                    HikeSaver
                </a>
                <nav class="nav-links">
                    <a href="index.html">Home</a>
                    <a href="shop.html">Shop</a>
                    <a href="contact.html">Contact</a>
                    <a href="feedback.html">Feedback</a>
                    ${isAdmin ? '<a href="admin.html" style="color:var(--primary-color)">Admin Panel</a>' : ''}
                    <a href="cart.html">Cart <span id="cart-count" class="cart-badge">0</span></a>
                    ${authLinks}
                </nav>
            </div>
        </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    updateCartCount();
}

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if(countEl) {
        const cart = getCart();
        const total = cart.reduce((acc, item) => acc + item.qty, 0);
        countEl.textContent = total;
    }
}

function injectFooter() {
    const footerHTML = `
        <footer class="footer">
            <div class="container footer-content">
                <div class="footer-col">
                    <h3>HikeSaver</h3>
                    <p style="max-width: 300px; margin-top: 15px;">Providing reliable safety and evacuation equipment for hikers. Secure your adventure.</p>
                </div>
                <div class="footer-col">
                    <h3>Quick Links</h3>
                    <div style="display:flex; flex-direction:column; gap:10px; margin-top:15px;">
                        <a href="shop.html">Shop</a>
                        <a href="contact.html">Contact Us</a>
                        <a href="feedback.html">Feedback</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 HikeSaver. All Rights Reserved.</p>
            </div>
        </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// Run basic initializations
document.addEventListener('DOMContentLoaded', () => {
    initDB();
    // Do not inject headers/footers if explicitly disabled (e.g. login pages maybe)
    if (!window.disableInject) {
        injectHeader();
        injectFooter();
    }
});
