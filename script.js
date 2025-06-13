// Global Variables
let contacts = [];
let newsletters = [];

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');
const newsletterForm = document.getElementById('newsletter-form');
const successMessage = document.getElementById('success-message');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializePricing();
    initializeForms();
    initializeAnimations();
});

// Navigation Functions
function initializeNavigation() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const navHeight = navbar.offsetHeight;
        const elementPosition = element.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Pricing Functions
function initializePricing() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const priceAmounts = document.querySelectorAll('.amount');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the selected period
            const period = this.dataset.period;
            
            // Update prices
            priceAmounts.forEach(amount => {
                const monthlyPrice = amount.dataset.monthly;
                const yearlyPrice = amount.dataset.yearly;
                
                if (period === 'yearly') {
                    amount.textContent = yearlyPrice;
                } else {
                    amount.textContent = monthlyPrice;
                }
            });
        });
    });
}

// Form Functions
function initializeForms() {
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.btn-text');
    const buttonLoading = submitButton.querySelector('.btn-loading');
    
    // Get form data
    const formData = new FormData(contactForm);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Basic validation
    if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(contactData.email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    try {
        // Show loading state
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'flex';

        // Send to API
        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to send message');
        }

        // Show success message
        contactForm.style.display = 'none';
        successMessage.style.display = 'block';

        // Reset form after delay
        setTimeout(() => {
            contactForm.style.display = 'block';
            successMessage.style.display = 'none';
            contactForm.reset();
        }, 5000);

        showToast('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');

    } catch (error) {
        showToast(error.message || 'Error sending message. Please try again later.', 'error');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
    }
}

async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.btn-text');
    const buttonLoading = submitButton.querySelector('.btn-loading');
    const emailInput = document.getElementById('newsletter-email');
    
    const email = emailInput.value.trim();

    // Validation
    if (!email) {
        showToast('Please enter your email address', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    try {
        // Show loading state
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'flex';

        // Send to API
        const response = await fetch('/api/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to subscribe');
        }

        // Reset form
        emailInput.value = '';
        showToast('Successfully subscribed to newsletter!', 'success');

    } catch (error) {
        showToast(error.message || 'Subscription failed. Please try again later.', 'error');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
    }
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .team-card, .pricing-card, .feature');
    animatedElements.forEach((el, index) => {
        el.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both paused`;
        observer.observe(el);
    });

    // Floating animations for hero elements
    initializeFloatingAnimations();

    // Count up animation for stats
    initializeCountUp();
}

function initializeFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        const delay = index * 2;
        element.style.animationDelay = `${delay}s`;
    });
}

function initializeCountUp() {
    const stats = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.match(/\d+/));
                
                if (number) {
                    animateNumber(target, 0, number, 2000);
                }
                
                statsObserver.unobserve(target);
            }
        });
    });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const originalText = element.textContent;
    const prefix = originalText.replace(/\d+/, '');
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.round(start + (end - start) * easeOutQuart(progress));
        element.textContent = originalText.replace(/\d+/, current);
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function simulateApiCall(delay = 1500) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getToastColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        min-width: 300px;
        animation: slideInFromRight 0.3s ease-out;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFromRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .toast-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
        }
        .toast-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 0.25rem;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .toast-close:hover {
            opacity: 1;
            background: rgba(255,255,255,0.1);
        }
    `;
    
    if (!document.querySelector('style[data-toast-styles]')) {
        style.setAttribute('data-toast-styles', '');
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideInFromRight 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getToastColor(type) {
    switch (type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#6366f1';
    }
}

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Smooth scrolling polyfill for older browsers
if (!CSS.supports('scroll-behavior', 'smooth')) {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const targetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: targetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Lazy loading for images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        
        // Close any open modals/toasts
        const toasts = document.querySelectorAll('.toast');
        toasts.forEach(toast => toast.remove());
    }
});

// Focus management for accessibility
document.addEventListener('DOMContentLoaded', function() {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = document.querySelector('.modal'); // If you add modals later
    
    // Trap focus in modals
    if (modal) {
        const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
        const focusableContent = modal.querySelectorAll(focusableElements);
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
});

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
            console.log('FID:', entry.processingStart - entry.startTime);
        }
        if (entry.entryType === 'layout-shift') {
            if (!entry.hadRecentInput) {
                console.log('CLS:', entry.value);
            }
        }
    });
});

try {
    perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
} catch (e) {
    // Performance Observer not supported
}

// Export functions for global access
window.scrollToSection = scrollToSection;
window.showToast = showToast;