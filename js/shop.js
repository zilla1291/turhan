// ========================================
// SHOP.JS - Shop Functionality
// ========================================

// ========================================
// PRODUCT DATA LOADING
// ========================================

let products = [];

async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();
    } catch (error) {
        console.log('Using localStorage products');
        products = JSON.parse(localStorage.getItem('products') || '[]');
    }

    // If no products exist, use defaults
    if (products.length === 0) {
        products = getDefaultProducts();
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Simulate load delay for effect
    setTimeout(() => {
        renderProducts(products);
        document.getElementById('productsLoader').style.display = 'none';
        document.getElementById('productsGrid').style.display = 'grid';
    }, 300);
}

function getDefaultProducts() {
    return [
        {
            id: 1,
            title: "Cinematic Text Presets",
            description: "20 professional text animation presets for After Effects.",
            price: 29.99,
            category: "presets"
        },
        {
            id: 2,
            title: "Topaz Color Settings",
            description: "15 optimized Topaz color grading profiles.",
            price: 19.99,
            category: "topaz"
        },
        {
            id: 3,
            title: "YouTube Export Bundle",
            description: "Complete export settings for optimal YouTube quality.",
            price: 14.99,
            category: "export"
        },
        {
            id: 4,
            title: "Advanced Glitch Effects",
            description: "10 cinematic glitch effect presets for After Effects.",
            price: 24.99,
            category: "presets"
        },
        {
            id: 5,
            title: "Topaz AI Upscaling Config",
            description: "Professional settings for AI-powered video upscaling.",
            price: 17.99,
            category: "topaz"
        },
        {
            id: 6,
            title: "Multi-Platform Export Pack",
            description: "Settings for YouTube, Vimeo, TikTok, Instagram, and more.",
            price: 22.99,
            category: "export"
        }
    ];
}

// ========================================
// RENDER PRODUCTS
// ========================================

function renderProducts(productsToShow) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h3>${product.title}</h3>
            <span class="category-badge">${getCategoryLabel(product.category)}</span>
            <p class="description">${product.description}</p>
            <div class="price">$${product.price.toFixed(2)}</div>
            <button class="buy-btn" onclick="openCheckout(${product.id}, '${product.title}', ${product.price})">
                Buy Now
            </button>
        `;
        grid.appendChild(card);
    });
}

function getCategoryLabel(category) {
    const labels = {
        presets: 'AE Text Presets',
        topaz: 'Topaz Quality',
        export: 'Export Settings'
    };
    return labels[category] || category;
}

// ========================================
// CATEGORY FILTERING
// ========================================

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            
            if (category === 'all') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });
}

// ========================================
// CHECKOUT MODAL
// ========================================

let currentCheckoutProduct = {
    id: null,
    name: '',
    price: 0
};

function openCheckout(productId, productName, price) {
    currentCheckoutProduct = { id: productId, name: productName, price };
    
    document.getElementById('checkoutProductName').textContent = productName;
    document.getElementById('checkoutPrice').textContent = `$${price.toFixed(2)}`;
    
    loadPaymentMethods();
    
    document.getElementById('checkoutModal').classList.add('active');
}

// ========================================
// PAYMENT METHODS LOADING
// ========================================

function loadPaymentMethods() {
    const paymentOptions = document.getElementById('paymentOptions');
    paymentOptions.innerHTML = '';

    // Get payment settings from localStorage or use defaults
    const paymentSettings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');

    const methods = [
        { name: 'Trust Wallet', key: 'trustWallet', icon: '🔐' },
        { name: 'PayPal', key: 'paypalEmail', icon: '💳' },
        { name: 'Binance', key: 'binanceAddress', icon: '🪙' }
    ];

    methods.forEach(method => {
        if (paymentSettings[method.key]) {
            const option = document.createElement('div');
            option.className = 'payment-option';
            option.innerHTML = `
                <strong>${method.icon} ${method.name}</strong>
                <p>${maskAddress(paymentSettings[method.key])}</p>
            `;
            option.addEventListener('click', function() {
                selectPaymentMethod(method.name, paymentSettings[method.key], this);
            });
            paymentOptions.appendChild(option);
        }
    });
}

function maskAddress(address) {
    if (address.length <= 10) return address;
    return address.substring(0, 6) + '...' + address.substring(address.length - 4);
}

let selectedPaymentMethod = '';
let selectedPaymentAddress = '';

function selectPaymentMethod(method, address, element) {
    selectedPaymentMethod = method;
    selectedPaymentAddress = address;
    
    const options = document.querySelectorAll('.payment-option');
    options.forEach(opt => {
        opt.style.borderColor = 'var(--accent-purple)';
        opt.style.background = 'rgba(138, 43, 226, 0.1)';
    });
    
    element.style.borderColor = 'var(--accent-cyan)';
    element.style.background = 'rgba(0, 240, 255, 0.15)';
};

// ========================================
// CONFIRM PAYMENT
// ========================================

function initCheckout() {
    // Close modal
    document.querySelector('.modal-close').addEventListener('click', () => {
        document.getElementById('checkoutModal').classList.remove('active');
    });

    // Confirm payment
    document.getElementById('confirmPaymentBtn').addEventListener('click', () => {
        const buyerName = document.getElementById('buyerName').value.trim();
        const buyerEmail = document.getElementById('buyerEmail').value.trim();

        if (!buyerName || !buyerEmail) {
            alert('Please fill in your name and email');
            return;
        }

        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
        }

        // Create purchase record
        const purchase = {
            id: Date.now(),
            productId: currentCheckoutProduct.id,
            product: currentCheckoutProduct.name,
            price: currentCheckoutProduct.price,
            buyer_name: buyerName,
            buyer_email: buyerEmail,
            payment_method: selectedPaymentMethod,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        // Store in localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(purchase);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Get telegram username from admin settings
        const paymentSettings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');
        const telegramUsername = paymentSettings.telegramUsername || 'turhanbeyadmin';

        // Redirect to Telegram
        const telegramText = `I%20have%20paid%20for%20${encodeURIComponent(currentCheckoutProduct.name)}%20please%20confirm`;
        const telegramUrl = `https://t.me/${telegramUsername}?text=${telegramText}`;
        
        window.open(telegramUrl, '_blank');

        // Close modal and show message
        document.getElementById('checkoutModal').classList.remove('active');
        alert('Thank you for your purchase! Please complete the payment via Telegram.');

        // Reset form
        document.getElementById('buyerName').value = '';
        document.getElementById('buyerEmail').value = '';
        selectedPaymentMethod = '';
        selectedPaymentAddress = '';
    });

    // Close modal on outside click
    document.getElementById('checkoutModal').addEventListener('click', (e) => {
        if (e.target.id === 'checkoutModal') {
            document.getElementById('checkoutModal').classList.remove('active');
        }
    });
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initFilters();
    initCheckout();
});
