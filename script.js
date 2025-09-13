// Portfolio Data Integration
function loadPortfolioData() {
    // Check both data sources - enhanced admin and original admin
    const enhancedData = localStorage.getItem('enhancedPortfolioData');
    const originalData = localStorage.getItem('portfolioData');
    
    let data = null;
    if (enhancedData) {
        data = JSON.parse(enhancedData);
    } else if (originalData) {
        data = JSON.parse(originalData);
    }
    
    if (data) {
        updatePortfolioContent(data);
    }
}

function updatePortfolioContent(data) {
    // Update navigation
    if (data.navigation) {
        const logoElement = document.querySelector('.logo');
        if (logoElement && data.navigation.logoText) {
            logoElement.innerHTML = `<i class="${data.navigation.logoIcon || 'fas fa-mountain'}"></i> ${data.navigation.logoText}`;
        }
    }

    // Update hero section with comprehensive structure
    if (data.hero) {
        const heroTitle = document.getElementById('heroTitle');
        const heroDescription = document.getElementById('heroDescription');
        const heroCTA = document.querySelector('.hero .cta-button');
        
        if (heroTitle && data.hero.mainTitle && data.hero.highlight) {
            const fullTitle = `${data.hero.mainTitle} <span class="highlight">${data.hero.highlight}</span>`;
            startTypewriter(heroTitle, fullTitle, 100, true);
        }
        if (heroDescription && data.hero.subtitle) {
            heroDescription.textContent = data.hero.subtitle;
        }
        if (heroCTA && data.hero.ctaText) {
            heroCTA.innerHTML = `${data.hero.ctaText} <i class="fas fa-arrow-right"></i>`;
            if (data.hero.ctaLink) {
                heroCTA.href = data.hero.ctaLink;
            }
        }
    }

    // Update about section
    if (data.about) {
        const aboutTitle = document.querySelector('.about h2');
        const aboutIntro = document.querySelector('.about-intro');
        const aboutParagraphs = document.querySelectorAll('.about-text p:not(.about-intro)');
        
        if (aboutTitle && data.about.title) aboutTitle.textContent = data.about.title;
        if (aboutIntro && data.about.intro) aboutIntro.textContent = data.about.intro;
        
        if (aboutParagraphs.length >= 3) {
            if (data.about.paragraph1) aboutParagraphs[0].textContent = data.about.paragraph1;
            if (data.about.paragraph2) aboutParagraphs[1].textContent = data.about.paragraph2;
            if (data.about.paragraph3) aboutParagraphs[2].textContent = data.about.paragraph3;
        }
    }

    // Update skills section
    if (data.skills) {
        const skillCategories = document.querySelectorAll('.skill-category');
        if (skillCategories.length >= 2) {
            // Design skills
            const designTitle = skillCategories[0].querySelector('h3');
            const designList = skillCategories[0].querySelector('ul');
            if (designTitle && data.skills.designTitle) designTitle.textContent = data.skills.designTitle;
            if (designList && data.skills.designSkills) {
                designList.innerHTML = data.skills.designSkills.map(skill => `<li>${skill}</li>`).join('');
            }
            
            // Technical skills
            const technicalTitle = skillCategories[1].querySelector('h3');
            const technicalList = skillCategories[1].querySelector('ul');
            if (technicalTitle && data.skills.technicalTitle) technicalTitle.textContent = data.skills.technicalTitle;
            if (technicalList && data.skills.technicalSkills) {
                technicalList.innerHTML = data.skills.technicalSkills.map(skill => `<li>${skill}</li>`).join('');
            }
        }
    }

    // Update stats section
    if (data.stats && Array.isArray(data.stats)) {
        const statElements = document.querySelectorAll('.stat');
        data.stats.forEach((stat, index) => {
            if (statElements[index]) {
                const numberEl = statElements[index].querySelector('.stat-number');
                const labelEl = statElements[index].querySelector('.stat-label');
                if (numberEl) numberEl.textContent = stat.number;
                if (labelEl) labelEl.textContent = stat.label;
            }
        });
    }

    // Update contact section
    if (data.contact) {
        const contactTitle = document.getElementById('contactTitle');
        const contactSubtitle = document.getElementById('contactSubtitle');
        const emailLink = document.getElementById('contactEmail');
        const phoneLink = document.getElementById('contactPhone');
        const contactCTA = document.querySelector('.contact .cta-button');
        
        if (contactTitle && data.contact.title) contactTitle.innerHTML = data.contact.title;
        if (contactSubtitle && data.contact.subtitle) contactSubtitle.textContent = data.contact.subtitle;
        if (emailLink && data.contact.email) {
            emailLink.href = `mailto:${data.contact.email}`;
            emailLink.textContent = data.contact.email;
        }
        if (phoneLink && data.contact.phone) {
            phoneLink.href = `tel:${data.contact.phone}`;
            phoneLink.textContent = data.contact.phone;
        }
        if (contactCTA && data.contact.ctaText) {
            contactCTA.innerHTML = `${data.contact.ctaText} <i class="fas fa-paper-plane"></i>`;
        }
    }

    // Update footer
    if (data.footer) {
        const footerText = document.querySelector('.footer p');
        if (footerText && data.footer.text) {
            footerText.textContent = data.footer.text;
        }
    }

    // Update site title
    if (data.settings && data.settings.siteTitle) {
        document.title = data.settings.siteTitle;
    }

    // Update logo
    if (data.settings && data.settings.logo) {
        const logoElements = document.querySelectorAll('.nav-brand .logo, .admin-brand i');
        logoElements.forEach(logo => {
            if (data.settings.logo) {
                logo.innerHTML = `<img src="${data.settings.logo}" alt="Logo" style="width: 30px; height: 30px; object-fit: contain;">`;
            } else {
                logo.innerHTML = '<i class="fas fa-mountain"></i>';
            }
        });
    }

    // Update portfolio items
    if (data.portfolioItems) {
        loadPortfolioItems();
    }
}

function loadPortfolioItems() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) return;

    const portfolioData = JSON.parse(localStorage.getItem('portfolio_data')) || { portfolioItems: [] };
    const items = portfolioData.portfolioItems || [];

    if (items.length === 0) {
        portfolioGrid.innerHTML = `
            <div class="no-items">
                <h3>No portfolio items yet</h3>
                <p>Visit the admin panel to add your first portfolio item</p>
                <a href="admin.html" class="btn btn-primary">Go to Admin Panel</a>
            </div>
        `;
        return;
    }

    // Sort items by order
    const sortedItems = items.sort((a, b) => a.order - b.order);

    portfolioGrid.innerHTML = '';
    
    sortedItems.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = `portfolio-item ${item.size} ${item.template}`;
        
        // Use the item's cover image as background, fallback to first image
        let backgroundImage = 'none';
        if (item.coverImage) {
            backgroundImage = `url('${item.coverImage}')`;
        } else if (item.images && item.images.length > 0) {
            backgroundImage = `url('${item.images[0].url}')`;
        }
        
        // Count images for display
        const imageCount = item.images ? item.images.length : 0;
        const imageText = imageCount === 1 ? '1 image' : `${imageCount} images`;
        
        portfolioItem.innerHTML = `
            <div class="image-card" style="background-image: ${backgroundImage};">
                <div class="image-overlay">
                    <div class="image-content">
                        <h3 class="image-title">${item.title}</h3>
                        <p class="image-category">${item.category}</p>
                        <p class="image-count">${imageText}</p>
                        <button class="view-project-btn" onclick="viewProject('${item.id}')">
                            View Collection
                        </button>
                    </div>
                </div>
                ${imageCount > 1 ? '<div class="collection-badge">Collection</div>' : ''}
            </div>
        `;

        // Apply custom colors if available
        if (item.colors) {
            const overlay = portfolioItem.querySelector('.image-overlay');
            overlay.style.setProperty('--primary-color', item.colors.primary);
            overlay.style.setProperty('--secondary-color', item.colors.secondary);
            overlay.style.setProperty('--text-color', item.colors.text);
        }

        portfolioGrid.appendChild(portfolioItem);
    });

    // Add smooth entrance animations
    portfolioGrid.querySelectorAll('.portfolio-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// View project function
function viewProject(itemId) {
    window.location.href = `portfolio-item.html?id=${itemId}`;
}

// Typewriter effect function
function startTypewriter(element, text, speed = 100, isHTML = false) {
    element.innerHTML = '';
    
    // If it's HTML, we need to handle it differently
    if (isHTML) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        const textContent = tempDiv.textContent || tempDiv.innerText;
        
        // Split into two parts: greeting and name
        const greeting = "Hi, I'm ";
        const name = "Ghulam-Asheeq Salifu";
        
        let currentPhase = 'greeting';
        let i = 0;
        
        const typeWriter = function() {
            if (currentPhase === 'greeting') {
                if (i < greeting.length) {
                    // Type greeting with bold formatting
                    element.innerHTML = '<span style="font-weight: 700;">' + greeting.substring(0, i + 1) + '</span>';
                    i++;
                    setTimeout(typeWriter, speed);
                } else {
                    // Move to name phase
                    currentPhase = 'name';
                    i = 0;
                    setTimeout(typeWriter, speed);
                }
            } else if (currentPhase === 'name') {
                if (i < name.length) {
                    // Type name with light formatting
                    const currentName = name.substring(0, i + 1);
                    element.innerHTML = '<span style="font-weight: 700;">' + greeting + '</span><span class="highlight">' + currentName + '</span>';
                    i++;
                    setTimeout(typeWriter, speed);
                } else {
                    // Typing complete - add glow effect
                    element.innerHTML = '<span style="font-weight: 700;">' + greeting + '</span><span class="highlight">' + name + '</span>';
                    
                    // Add glow effect smoothly after typing completes
                    setTimeout(() => {
                        const highlightSpan = element.querySelector('.highlight');
                        if (highlightSpan) {
                            highlightSpan.classList.add('glow-effect');
                            
                            // Remove glow effect after 2000ms and clean up inline styles
                            setTimeout(() => {
                                highlightSpan.classList.remove('glow-effect');
                                // Final clean HTML
                                element.innerHTML = text;
                            }, 2000);
                        }
                    }, 100);
                }
            }
        };
        
        setTimeout(typeWriter, 0);
    } else {
        let i = 0;
        const typeWriter = function() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        };
        
        setTimeout(typeWriter, 0);
    }
}

// Page transition functionality
function initPageTransitions() {
    const pageTransition = document.getElementById('pageTransition');
    
    // Handle all internal links
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:') && !link.href.startsWith('#')) {
            // Check if it's an internal link
            const currentDomain = window.location.origin;
            if (link.href.startsWith(currentDomain) || link.href.startsWith('./') || link.href.startsWith('../') || !link.href.includes('://')) {
                e.preventDefault();
                
                // Show transition overlay
                pageTransition.classList.add('active');
                
                // Navigate after animation
                setTimeout(() => {
                    window.location.href = link.href;
                }, 400);
            }
        }
    });
    
    // Hide transition overlay on page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            pageTransition.classList.remove('active');
            document.body.classList.add('loaded');
        }, 100);
    });
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page transitions
    initPageTransitions();
    
    // Start typewriter effect for hero title
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
        const defaultText = "Hi, I'm <span class=\"highlight\">Ghulam-Asheeq Salifu</span>";
        startTypewriter(heroTitle, defaultText, 100, true);
    }
    
    loadPortfolioData();
    
    // Listen for storage changes to update content when admin makes changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'portfolio_data') {
            portfolioManager.updateContent();
            portfolioManager.loadPortfolioItems();
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Portfolio item hover effects
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe portfolio items for scroll animations
    portfolioItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Portfolio item click handler for future lightbox functionality
    portfolioItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Prevent default if clicking on the card itself
            if (e.target.closest('.portfolio-card')) {
                // Future: Add lightbox functionality here
                console.log('Portfolio item clicked:', this);
            }
        });
    });

    // Contact form handling (if added later)
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click tracking or analytics here if needed
            console.log('Contact link clicked:', this.href);
        });
    });

    // Add scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #007bff, #0056b3);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', function() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // Legacy typing effect - removed to avoid conflicts

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }

    // Add hover sound effects (optional)
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Future: Add subtle hover sound effect
        });
    });

    // Performance optimization: Debounce scroll events
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

    // Apply debouncing to scroll-heavy functions
    const debouncedScrollHandler = debounce(function() {
        // Additional scroll handling if needed
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);
});

// Add CSS for mobile menu animation
const style = document.createElement('style');
style.textContent = `
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        padding: 1rem 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        animation: slideDown 0.3s ease;
    }

    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .loaded {
        animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;
document.head.appendChild(style);
