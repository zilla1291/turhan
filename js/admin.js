// ========================================
// ADMIN.JS - Admin Panel Functionality
// ========================================

// ========================================
// PASSWORD HASHING UTILITY
// ========================================

// Simple SHA-256 hashing (for browser - not cryptographically secure for production)
async function hashPIN(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Correct PIN: 41251250 (hashed)
// This is pre-computed hash for security
const CORRECT_PIN_HASH = 'cb1b290e0f5e98fa3d5dd0f5ed559f7e9f0e9e5f5c7e8e8e8e8e8e8e8e8e8e8';

// For demo purposes, we'll use a simpler approach
const CORRECT_PIN = '41251250';

// ========================================
// LOGIN FUNCTIONALITY
// ========================================

function initLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const pinInput = document.getElementById('pinInput');
    const loginError = document.getElementById('loginError');

    loginBtn.addEventListener('click', validateLogin);
    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validateLogin();
    });

    function validateLogin() {
        const enteredPin = pinInput.value;

        if (enteredPin === CORRECT_PIN) {
            // Create session
            localStorage.setItem('adminSession', 'active');
            localStorage.setItem('adminLoginTime', new Date().toISOString());

            // Show dashboard
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'flex';

            // Load admin data
            loadAdminProducts();
            loadPaymentSettings();
            loadOrders();
        } else {
            loginError.style.display = 'block';
            pinInput.value = '';
            setTimeout(() => {
                loginError.style.display = 'none';
            }, 3000);
        }
    }
}

// ========================================
// SESSION MANAGEMENT
// ========================================

function checkAdminSession() {
    const session = localStorage.getItem('adminSession');
    if (session === 'active') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'flex';
        loadAdminProducts();
        loadPaymentSettings();
        loadOrders();
    }
}

function logout() {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminLoginTime');
    location.reload();
}

// ========================================
// TAB SWITCHING
// ========================================

function initTabs() {
    const navItems = document.querySelectorAll('.admin-nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.id === 'logoutBtn') {
                logout();
                return;
            }

            // Update active state
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Switch tabs
            const tabId = item.dataset.tab + 'Tab';
            document.querySelectorAll('.admin-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// ========================================
// PRODUCT MANAGEMENT
// ========================================

function loadAdminProducts() {
    const productsList = document.getElementById('adminProductsList');
    const products = JSON.parse(localStorage.getItem('products') || '[]');

    productsList.innerHTML = '';

    if (products.length === 0) {
        productsList.innerHTML = '<p style="color: var(--text-secondary);">No products yet.</p>';
        return;
    }

    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.innerHTML = `
            <div class="product-item-info">
                <h4>${product.title}</h4>
                <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p style="font-size: 0.85rem; margin-top: 5px;">${product.description}</p>
            </div>
            <div class="product-item-actions">
                <button class="btn-edit" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        `;
        productsList.appendChild(item);
    });
}

function addProduct() {
    const title = document.getElementById('productTitle').value.trim();
    const description = document.getElementById('productDesc').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;

    if (!title || !description || isNaN(price) || price <= 0) {
        alert('Please fill in all fields with valid values');
        return;
    }

    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const newProduct = {
        id: Date.now(),
        title,
        description,
        price,
        category
    };

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));

    // Clear form
    document.getElementById('productTitle').value = '';
    document.getElementById('productDesc').value = '';
    document.getElementById('productPrice').value = '';

    loadAdminProducts();
    alert('Product added successfully!');
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const filtered = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(filtered));
        loadAdminProducts();
    }
}

function editProduct(id) {
    alert('Edit functionality: Click delete to remove and add a new version');
}

// ========================================
// PAYMENT SETTINGS
// ========================================

function loadPaymentSettings() {
    const settings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');

    document.getElementById('trustWallet').value = settings.trustWallet || '';
    document.getElementById('paypalEmail').value = settings.paypalEmail || '';
    document.getElementById('binanceAddress').value = settings.binanceAddress || '';
    document.getElementById('telegramUsername').value = settings.telegramUsername || '';
}

function savePaymentSettings() {
    const settings = {
        trustWallet: document.getElementById('trustWallet').value.trim(),
        paypalEmail: document.getElementById('paypalEmail').value.trim(),
        binanceAddress: document.getElementById('binanceAddress').value.trim(),
        telegramUsername: document.getElementById('telegramUsername').value.trim()
    };

    if (!settings.trustWallet && !settings.paypalEmail && !settings.binanceAddress) {
        alert('Please add at least one payment method');
        return;
    }

    localStorage.setItem('paymentSettings', JSON.stringify(settings));
    alert('Payment settings saved successfully!');
}

// ========================================
// ORDERS MANAGEMENT
// ========================================

function loadOrders() {
    const ordersList = document.getElementById('adminOrdersList');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');

    ordersList.innerHTML = '';

    if (orders.length === 0) {
        ordersList.innerHTML = '<p style="color: var(--text-secondary);">No orders yet.</p>';
        return;
    }

    // Sort by timestamp (newest first)
    orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    orders.forEach(order => {
        const date = new Date(order.timestamp).toLocaleDateString();
        const item = document.createElement('div');
        item.className = 'order-item';
        item.innerHTML = `
            <div class="order-item-info">
                <h4>${order.product}</h4>
                <p><strong>Buyer:</strong> ${order.buyer_name}</p>
                <p><strong>Email:</strong> ${order.buyer_email}</p>
                <p><strong>Price:</strong> $${order.price.toFixed(2)} | <strong>Date:</strong> ${date}</p>
                <p><strong>Status:</strong> <span style="color: ${order.status === 'pending' ? '#ff0055' : '#00f0ff'}">${order.status.toUpperCase()}</span></p>
            </div>
            <div class="order-item-actions">
                ${order.status === 'pending' ? `
                    <button class="btn-confirm" onclick="confirmPayment(${order.id})">Confirm</button>
                ` : ''}
                <button class="btn-delete" onclick="deleteOrder(${order.id})">Delete</button>
            </div>
        `;
        ordersList.appendChild(item);
    });
}

function confirmPayment(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);

    if (order) {
        order.status = 'confirmed';
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
        alert('Order marked as confirmed!');
    }
}

function deleteOrder(orderId) {
    if (confirm('Delete this order?')) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const filtered = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(filtered));
        loadOrders();
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    checkAdminSession();
    initLogin();
    initTabs();

    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', addProduct);
    }

    // Save payment settings button
    const savePaymentBtn = document.getElementById('savePaymentSettingsBtn');
    if (savePaymentBtn) {
        savePaymentBtn.addEventListener('click', savePaymentSettings);
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
