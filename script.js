// ==========================================
// COMFORT KART - MOBILE-OPTIMIZED JAVASCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== MOBILE NAVIGATION ==========
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
    
    // ========== MOBILE FILTER TOGGLE ==========
    const shopSidebar = document.querySelector('.shop-sidebar');
    const shopContent = document.querySelector('.shop-content');
    
    if (shopSidebar && shopContent) {
        // Create filter toggle button
        const filterToggle = document.createElement('button');
        filterToggle.className = 'btn btn-outline filter-toggle-btn';
        filterToggle.innerHTML = '<i class="fas fa-filter"></i> Filter Products';
        
        // Insert before shop content
        shopContent.parentNode.insertBefore(filterToggle, shopContent);
        
        filterToggle.addEventListener('click', () => {
            shopSidebar.classList.toggle('active');
            filterToggle.innerHTML = shopSidebar.classList.contains('active') 
                ? '<i class="fas fa-times"></i> Close Filters' 
                : '<i class="fas fa-filter"></i> Filter Products';
        });
    }
    
    // ========== TOGGLE PASSWORD VISIBILITY ==========
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    // ========== TOUCH-FRIENDLY PRODUCT CARDS ==========
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add touch feedback
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
        
        // Make entire card clickable on mobile
        card.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && !e.target.closest('.btn-add-cart')) {
                // Navigate to product page
                window.location.href = 'product.html';
            }
        });
    });
    
    // ========== FORM VALIDATION ==========
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('[name="email"]').value;
            const password = this.querySelector('[name="password"]').value;
            
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error');
                return;
            }
            
            showNotification('Login successful!', 'success');
            // Add your backend login logic here
        });
    }
    
    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = this.querySelector('[name="password"]').value;
            const confirmPassword = this.querySelector('[name="confirm_password"]').value;
            const phone = this.querySelector('[name="phone"]').value;
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error');
                return;
            }
            
            if (!validatePhone(phone)) {
                showNotification('Please enter a valid 10-digit phone number', 'error');
                return;
            }
            
            const terms = this.querySelector('[name="terms"]').checked;
            if (!terms) {
                showNotification('Please accept the terms and conditions', 'error');
                return;
            }
            
            showNotification('Registration successful!', 'success');
            // Add your backend registration logic here
        });
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for contacting us! We will get back to you soon.', 'success');
            this.reset();
        });
    }
    
    // Checkout Form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const orderId = 'CK' + Math.floor(Math.random() * 1000000);
            showNotification(`Order placed successfully! Order ID: #${orderId}`, 'success');
            // Add your backend checkout logic here
        });
    }
    
    // ========== SHOPPING CART FUNCTIONALITY ==========
    
    // Add to Cart Buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Animate button
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = 'var(--success-color)';
            
            setTimeout(() => {
                this.innerHTML = 'Add to Cart';
                this.style.background = '';
            }, 2000);
            
            updateCartCount(1);
            showNotification(`${productName} added to cart!`, 'success');
        });
    });
    
    // Cart Quantity Controls
    const qtyMinusButtons = document.querySelectorAll('.qty-btn.minus');
    const qtyPlusButtons = document.querySelectorAll('.qty-btn.plus');
    
    qtyMinusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.qty-input');
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                updateCartItem(this);
                vibrate();
            }
        });
    });
    
    qtyPlusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.qty-input');
            let value = parseInt(input.value);
            input.value = value + 1;
            updateCartItem(this);
            vibrate();
        });
    });
    
    // Remove from Cart
    const removeButtons = document.querySelectorAll('.remove-btn');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Remove this item from cart?')) {
                const cartItem = this.closest('.cart-item');
                cartItem.style.opacity = '0';
                cartItem.style.transform = 'translateX(-100%)';
                setTimeout(() => {
                    cartItem.remove();
                    updateCartCount(-1);
                    showNotification('Item removed from cart', 'info');
                }, 300);
            }
        });
    });
    
    // ========== PRODUCT PAGE FUNCTIONALITY ==========
    
    // Size Selection
    const sizeOptions = document.querySelectorAll('.size-option, .size-btn');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.size-option, .size-btn').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            vibrate();
        });
    });
    
    // Color Selection
    const colorOptions = document.querySelectorAll('.color-option, .color-btn');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.color-option, .color-btn').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            vibrate();
        });
    });
    
    // Product Image Thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image .placeholder-img');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            this.classList.add('active');
            
            if (mainImage) {
                mainImage.style.opacity = '0';
                mainImage.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                    mainImage.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
    
    // Product Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Scroll tab into view on mobile
            if (window.innerWidth <= 768) {
                this.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        });
    });
    
    // ========== WISHLIST FUNCTIONALITY ==========
    const wishlistButtons = document.querySelectorAll('.btn-icon-large');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon && icon.classList.contains('fa-heart')) {
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    this.style.color = 'var(--accent-color)';
                    this.style.borderColor = 'var(--accent-color)';
                    showNotification('Added to wishlist!', 'success');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    this.style.color = '';
                    this.style.borderColor = '';
                    showNotification('Removed from wishlist', 'info');
                }
                vibrate();
            }
        });
    });
    
    // ========== NEWSLETTER FORM ==========
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email', 'error');
            }
        });
    }
    
    // ========== FAQ ACCORDION ==========
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = this.querySelector('i');
            const isOpen = answer.style.display === 'block';
            
            // Close all
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.style.display = 'none';
            });
            document.querySelectorAll('.faq-question i').forEach(ic => {
                ic.style.transform = 'rotate(0deg)';
            });
            
            // Open clicked if it was closed
            if (!isOpen) {
                answer.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
    
    // ========== PROFILE TAB NAVIGATION ==========
    const profileNavItems = document.querySelectorAll('.profile-nav-item');
    const profileTabs = document.querySelectorAll('.profile-tab');
    
    profileNavItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            if (!this.classList.contains('logout')) {
                e.preventDefault();
                
                profileNavItems.forEach(nav => nav.classList.remove('active'));
                profileTabs.forEach(tab => tab.classList.remove('active'));
                
                this.classList.add('active');
                if (profileTabs[index]) {
                    profileTabs[index].classList.add('active');
                }
            }
        });
    });
    
    // ========== SCROLL TO TOP BUTTON ==========
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 400) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        vibrate();
    });
    
    // ========== SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ========== LAZY LOADING IMAGES ==========
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px'
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ========== SWIPE GESTURES FOR PRODUCT IMAGES ==========
    const mainImageContainer = document.querySelector('.main-image');
    
    if (mainImageContainer && thumbnails.length > 0) {
        let touchStartX = 0;
        let touchEndX = 0;
        let currentIndex = 0;
        
        mainImageContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        mainImageContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next image
                    currentIndex = (currentIndex + 1) % thumbnails.length;
                } else {
                    // Swipe right - previous image
                    currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
                }
                
                thumbnails[currentIndex].click();
            }
        }
    }
    
    // ========== PULL TO REFRESH (Optional) ==========
    let pullStartY = 0;
    let pullMoveY = 0;
    let isPulling = false;
    
    document.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
            pullStartY = e.touches[0].clientY;
            isPulling = true;
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (isPulling) {
            pullMoveY = e.touches[0].clientY;
        }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        if (isPulling && pullMoveY - pullStartY > 100) {
            // Could implement page refresh here
            // location.reload();
        }
        isPulling = false;
        pullStartY = 0;
        pullMoveY = 0;
    }, { passive: true });
    
    // ========== INITIALIZE CART COUNT ==========
    updateCartDisplay();
    
    console.log('Comfort Kart Mobile-Optimized Version Loaded!');
});

// ========== HELPER FUNCTIONS ==========

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone (Indian)
function validatePhone(phone) {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone.replace(/\D/g, ''));
}

// Update Cart Count
function updateCartCount(change) {
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(count => {
        let currentCount = parseInt(count.textContent) || 0;
        const newCount = Math.max(0, currentCount + change);
        count.textContent = newCount;
        
        // Animate
        count.style.transform = 'scale(1.3)';
        setTimeout(() => {
            count.style.transform = 'scale(1)';
        }, 200);
    });
    
    // Save to localStorage
    const cart = getCart();
    saveCart(cart);
}

// Update Cart Item Total
function updateCartItem(element) {
    const cartItem = element.closest('.cart-item');
    if (cartItem) {
        const qty = parseInt(cartItem.querySelector('.qty-input').value);
        const priceElement = cartItem.querySelector('.cart-item-price .price');
        const totalElement = cartItem.querySelector('.cart-item-total .total-price');
        
        if (priceElement && totalElement) {
            const price = parseInt(priceElement.textContent.replace(/[₹,]/g, ''));
            const total = price * qty;
            totalElement.textContent = '₹' + total.toLocaleString('en-IN');
        }
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Styles
    const bgColors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '15px 25px',
        backgroundColor: bgColors[type] || bgColors.info,
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontWeight: '500',
        fontSize: '14px',
        maxWidth: '90%',
        textAlign: 'center',
        animation: 'slideInDown 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOutUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Vibration feedback
function vibrate() {
    if ('vibrate' in navigator) {
        navigator.vibrate(10);
    }
}

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('comfortKartCart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('comfortKartCart', JSON.stringify(cart));
}

// Update cart display from localStorage
function updateCartDisplay() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
    
    .notification i {
        font-size: 18px;
    }
    
    /* Smooth transitions for cart items */
    .cart-item {
        transition: all 0.3s ease;
    }
    
    /* Cart count animation */
    .cart-count {
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);