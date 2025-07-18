// HomLet - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeAlerts();
    initializeImagePreviews();
    initializeFormValidation();
    initializeMobileMenu();
    initializeAnimations();
    initializePropertyFilters();
});

// Alert auto-dismiss functionality
function initializeAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }, 5000);

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 1rem;
            background: none;
            border: none;
            color: inherit;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0.7;
        `;
        closeBtn.addEventListener('click', () => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        });
        
        alert.style.position = 'relative';
        alert.appendChild(closeBtn);
    });
}

// Image preview functionality
function initializeImagePreviews() {
    const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    imageInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const files = e.target.files;
            let previewContainer = document.getElementById(input.id + '-preview');
            
            // Create preview container if it doesn't exist
            if (!previewContainer) {
                previewContainer = document.createElement('div');
                previewContainer.id = input.id + '-preview';
                previewContainer.style.cssText = `
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 1rem;
                    margin-top: 1rem;
                `;
                input.parentNode.appendChild(previewContainer);
            }
            
            previewContainer.innerHTML = '';
            
            Array.from(files).forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imgContainer = document.createElement('div');
                        imgContainer.style.cssText = `
                            position: relative;
                            border-radius: 8px;
                            overflow: hidden;
                            background: rgba(255, 255, 255, 0.05);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                        `;
                        
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.cssText = `
                            width: 100%;
                            height: 80px;
                            object-fit: cover;
                            display: block;
                        `;
                        
                        const label = document.createElement('div');
                        label.textContent = `Image ${index + 1}`;
                        label.style.cssText = `
                            padding: 0.5rem;
                            font-size: 0.75rem;
                            text-align: center;
                            color: rgba(255, 255, 255, 0.8);
                        `;
                        
                        imgContainer.appendChild(img);
                        imgContainer.appendChild(label);
                        previewContainer.appendChild(imgContainer);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                clearFieldError(field);
                
                if (!field.value.trim()) {
                    showFieldError(field, 'This field is required');
                    isValid = false;
                } else {
                    // Email validation
                    if (field.type === 'email' && !isValidEmail(field.value)) {
                        showFieldError(field, 'Please enter a valid email address');
                        isValid = false;
                    }
                    
                    // Phone validation
                    if (field.type === 'tel' && !isValidPhone(field.value)) {
                        showFieldError(field, 'Please enter a valid phone number');
                        isValid = false;
                    }
                    
                    // Password validation
                    if (field.type === 'password' && field.value.length < 6) {
                        showFieldError(field, 'Password must be at least 6 characters');
                        isValid = false;
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                // Scroll to first error
                const firstError = form.querySelector('.field-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (nav && navLinks) {
        // Create mobile menu toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '☰';
        toggleBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
        `;
        
        // Add responsive behavior
        function checkScreenSize() {
            if (window.innerWidth <= 768) {
                toggleBtn.style.display = 'block';
                navLinks.style.display = 'none';
                
                toggleBtn.onclick = () => {
                    const isVisible = navLinks.style.display === 'flex';
                    navLinks.style.display = isVisible ? 'none' : 'flex';
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '100%';
                    navLinks.style.left = '0';
                    navLinks.style.right = '0';
                    navLinks.style.background = 'rgba(0, 0, 0, 0.95)';
                    navLinks.style.padding = '1rem';
                    navLinks.style.zIndex = '1000';
                };
            } else {
                toggleBtn.style.display = 'none';
                navLinks.style.display = 'flex';
                navLinks.style.position = 'static';
                navLinks.style.flexDirection = 'row';
                navLinks.style.background = 'none';
            }
        }
        
        nav.appendChild(toggleBtn);
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    }
}

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and other elements
    const animatedElements = document.querySelectorAll('.card, .property-card, .stat-card');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Property filters functionality
function initializePropertyFilters() {
    const filterForm = document.querySelector('form[action*="houses"]');
    if (filterForm) {
        const inputs = filterForm.querySelectorAll('input, select');
        
        // Auto-submit on filter change (debounced)
        let timeout;
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    // Optional: auto-submit filters
                    // filterForm.submit();
                }, 1000);
            });
        });
    }
}

// Utility functions
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ff6b6b';
    field.classList.add('field-error');
    
    const error = document.createElement('div');
    error.className = 'field-error-message';
    error.textContent = message;
    error.style.cssText = `
        color: #ff6b6b;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        animation: slideInDown 0.3s ease;
    `;
    
    field.parentNode.appendChild(error);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.classList.remove('field-error');
    
    const existingError = field.parentNode.querySelector('.field-error-message');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Loading state management
function showLoading(element, text = 'Loading...') {
    const originalContent = element.innerHTML;
    element.dataset.originalContent = originalContent;
    element.innerHTML = `<span class="loading"></span> ${text}`;
    element.disabled = true;
}

function hideLoading(element) {
    const originalContent = element.dataset.originalContent;
    if (originalContent) {
        element.innerHTML = originalContent;
        delete element.dataset.originalContent;
    }
    element.disabled = false;
}

// Notification system
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 10000;
        max-width: 400px;
        animation: slideInDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(amount);
}

// Smooth scroll
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global use
window.HomLet = {
    showLoading,
    hideLoading,
    showNotification,
    copyToClipboard,
    smoothScrollTo,
    formatCurrency,
    debounce
};

// Add some nice hover effects to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Property card interactions
document.addEventListener('DOMContentLoaded', function() {
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});