// Client-side JavaScript for Blog Application

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Blog application loaded successfully! 🚀');
    
    // Initialize all components
    initializeApp();
});

function initializeApp() {
    // Initialize components
    initializeFormValidation();
    initializeConfirmDialogs();
    initializeTooltips();
    initializeAnimations();
    initializeTextAreaAutoResize();
    initializeCharacterCounter();
    
    console.log('All components initialized');
}

// Form validation enhancement
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            // Remove existing error styling
            requiredFields.forEach(field => {
                field.classList.remove('is-invalid');
                const feedback = field.parentNode.querySelector('.invalid-feedback');
                if (feedback) {
                    feedback.remove();
                }
            });
            
            // Check each required field
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    
                    // Create error message
                    const feedback = document.createElement('div');
                    feedback.className = 'invalid-feedback';
                    feedback.textContent = `${field.labels[0]?.textContent || 'This field'} is required`;
                    field.parentNode.appendChild(feedback);
                }
            });
            
            // If form is invalid, prevent submission and scroll to first error
            if (!isValid) {
                e.preventDefault();
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField.call(this);
                }
            });
        });
    });
}

function validateField() {
    const field = this;
    const isValid = field.value.trim() !== '';
    
    field.classList.toggle('is-invalid', !isValid);
    field.classList.toggle('is-valid', isValid);
    
    // Remove existing feedback
    const existingFeedback = field.parentNode.querySelector('.invalid-feedback, .valid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Add appropriate feedback
    const feedback = document.createElement('div');
    if (isValid) {
        feedback.className = 'valid-feedback';
        feedback.textContent = 'Looks good!';
    } else {
        feedback.className = 'invalid-feedback';
        feedback.textContent = `${field.labels[0]?.textContent || 'This field'} is required`;
    }
    field.parentNode.appendChild(feedback);
}

// Confirmation dialogs for delete actions
function initializeConfirmDialogs() {
    const deleteForms = document.querySelectorAll('form[action*="DELETE"]');
    
    deleteForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const postTitle = this.closest('.blog-card')?.querySelector('.card-title')?.textContent?.trim();
            const confirmMessage = postTitle 
                ? `Are you sure you want to delete "${postTitle}"? This action cannot be undone.`
                : 'Are you sure you want to delete this post? This action cannot be undone.';
                
            if (!confirm(confirmMessage)) {
                e.preventDefault();
            }
        });
    });
}

// Initialize Bootstrap tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"], [title]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        // Add Bootstrap tooltip if Bootstrap is available
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        }
    });
}

// Add loading animations to buttons
function initializeAnimations() {
    const buttons = document.querySelectorAll('button[type="submit"], .btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't animate delete buttons or links
            if (this.classList.contains('btn-outline-danger') || this.tagName === 'A') {
                return;
            }
            
            // Add loading state
            const originalText = this.innerHTML;
            const icon = this.querySelector('i');
            
            if (icon) {
                icon.className = 'fas fa-spinner fa-spin me-2';
            }
            
            // Reset after a short delay (for visual feedback)
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 1000);
        });
    });
}

// Auto-resize textarea
function initializeTextAreaAutoResize() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        // Set initial height
        autoResize(textarea);
        
        // Add event listeners
        textarea.addEventListener('input', function() {
            autoResize(this);
        });
        
        textarea.addEventListener('focus', function() {
            this.style.borderColor = '#0d6efd';
        });
        
        textarea.addEventListener('blur', function() {
            this.style.borderColor = '#e9ecef';
        });
    });
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(textarea.scrollHeight, 120) + 'px';
}

// Character counter for textarea
function initializeCharacterCounter() {
    const textareas = document.querySelectorAll('textarea[name="content"]');
    
    textareas.forEach(textarea => {
        const counter = document.createElement('small');
        counter.className = 'form-text text-muted character-counter';
        counter.style.float = 'right';
        
        // Insert counter after textarea
        textarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const length = textarea.value.length;
            counter.textContent = `${length} characters`;
            
            // Color coding based on length
            if (length < 50) {
                counter.className = 'form-text text-danger character-counter';
                counter.textContent += ' (too short)';
            } else if (length > 1000) {
                counter.className = 'form-text text-warning character-counter';
                counter.textContent += ' (quite long)';
            } else {
                counter.className = 'form-text text-success character-counter';
            }
        }
        
        // Initial count
        updateCounter();
        
        // Update on input
        textarea.addEventListener('input', updateCounter);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add fade-in animation for cards
function addFadeInAnimation() {
    const cards = document.querySelectorAll('.blog-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        
        observer.observe(card);
    });
}

// Initialize animations after DOM load
setTimeout(addFadeInAnimation, 100);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit forms
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeForm = document.activeElement.closest('form');
        if (activeForm) {
            const submitBtn = activeForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.click();
            }
        }
    }
    
    // Escape to cancel/go back
    if (e.key === 'Escape') {
        const cancelBtn = document.querySelector('.btn[href="/"], .btn-outline-secondary[href="/"]');
        if (cancelBtn) {
            window.location.href = '/';
        }
    }
});

// Local storage for draft saving
function initializeDraftSaving() {
    const forms = document.querySelectorAll('form[action="/posts"], form[action*="/posts/"]');
    
    forms.forEach(form => {
        const isEdit = form.action.includes('_method=PUT');
        const storageKey = isEdit ? 'blog_edit_draft' : 'blog_create_draft';
        
        // Load draft on page load
        const savedDraft = localStorage.getItem(storageKey);
        if (savedDraft && !isEdit) { // Only load for new posts
            const draft = JSON.parse(savedDraft);
            Object.keys(draft).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && !field.value) {
                    field.value = draft[key];
                }
            });
        }
        
        // Save draft on input
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(function() {
                const formData = {};
                inputs.forEach(field => {
                    formData[field.name] = field.value;
                });
                localStorage.setItem(storageKey, JSON.stringify(formData));
            }, 1000));
        });
        
        // Clear draft on successful submit
        form.addEventListener('submit', function() {
            localStorage.removeItem(storageKey);
        });
    });
}

// Debounce utility function
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

// Initialize draft saving
initializeDraftSaving();

// Print functionality
function printPost() {
    window.print();
}

// Share functionality (if available)
function sharePost(url, title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        }).catch(() => {
            // Fallback: show URL
            prompt('Copy this link:', url);
        });
    }
}

// Search functionality (basic implementation)
function initializeSearch() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const posts = document.querySelectorAll('.blog-card');
        
        posts.forEach(post => {
            const title = post.querySelector('.card-title').textContent.toLowerCase();
            const content = post.querySelector('.card-text').textContent.toLowerCase();
            const author = post.querySelector('.post-meta').textContent.toLowerCase();
            
            const matches = title.includes(query) || content.includes(query) || author.includes(query);
            post.style.display = matches ? 'block' : 'none';
        });
    });
}

// Initialize search if search input exists
initializeSearch();

// Console welcome message
console.log(`
🎉 Welcome to the Blog Application!
📝 Built with this blog console
🚀 Ready to start blogging!

Keyboard shortcuts:
- Ctrl/Cmd + Enter: Submit forms
- Escape: Go back to home
`);

// Export functions for potential use in other scripts
window.BlogApp = {
    printPost,
    sharePost,
    autoResize,
    validateField
};