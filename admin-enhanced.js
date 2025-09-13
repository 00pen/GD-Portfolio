// Enhanced Portfolio Admin JavaScript
class EnhancedPortfolioAdmin {
    constructor() {
        this.currentUser = null;
        this.portfolioData = this.loadPortfolioData();
        this.mediaFiles = this.loadMediaFiles();
        this.currentPage = null;
        this.selectedModule = null;
        this.previewMode = 'desktop';
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoSteps = 50;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialData();
        this.checkAuthStatus();
    }

    // Enhanced Data Management - Integrated with existing portfolio data
    loadPortfolioData() {
        // Load existing portfolio data first
        const existingData = localStorage.getItem('portfolioData');
        const existingParsed = existingData ? JSON.parse(existingData) : {};
        
        const defaultData = {
            // Existing structure compatibility
            hero: existingParsed.hero || {
                title: 'Hi, I\'m Ghulam-Asheeq Salifu',
                description: 'Creative graphic designer specializing in brand identity, digital marketing, and visual storytelling.'
            },
            about: existingParsed.about || {
                title: 'About Me',
                description: 'Tell your story here...'
            },
            contact: existingParsed.contact || {
                email: 'salifughulamasheeq@gmail.com',
                phone: '+233 53 060 0158'
            },
            portfolioItems: existingParsed.portfolioItems || [],
            
            // Enhanced structure
            pages: [
                {
                    id: 'home',
                    title: 'Home',
                    slug: '/',
                    type: 'home',
                    visible: true,
                    modules: [],
                    seo: {
                        title: existingParsed.settings?.siteTitle || 'My Portfolio',
                        description: 'Welcome to my portfolio'
                    }
                }
            ],
            theme: {
                primaryColor: '#007bff',
                secondaryColor: '#6c757d',
                fontFamily: 'Inter, sans-serif',
                layoutStyle: 'modern'
            },
            settings: {
                siteTitle: existingParsed.settings?.siteTitle || 'Ghulam-Asheeq Salifu - Portfolio',
                siteDescription: 'Creative graphic designer portfolio',
                contactEmail: existingParsed.contact?.email || 'salifughulamasheeq@gmail.com',
                socialLinks: {
                    linkedin: '',
                    twitter: '',
                    instagram: '',
                    github: ''
                },
                adminPassword: existingParsed.settings?.adminPassword || 'admin123'
            }
        };

        const saved = localStorage.getItem('enhancedPortfolioData');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    savePortfolioData() {
        this.saveToUndoStack();
        localStorage.setItem('enhancedPortfolioData', JSON.stringify(this.portfolioData));
        
        // Also save to the original portfolio data format for backward compatibility
        const legacyData = {
            hero: this.portfolioData.hero,
            about: this.portfolioData.about,
            contact: this.portfolioData.contact,
            portfolioItems: this.portfolioData.portfolioItems,
            settings: this.portfolioData.settings
        };
        localStorage.setItem('portfolioData', JSON.stringify(legacyData));
        
        this.updateUI();
    }

    // Undo/Redo System
    saveToUndoStack() {
        this.undoStack.push(JSON.stringify(this.portfolioData));
        if (this.undoStack.length > this.maxUndoSteps) {
            this.undoStack.shift();
        }
        this.redoStack = [];
        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.undoStack.length > 0) {
            this.redoStack.push(JSON.stringify(this.portfolioData));
            const previousState = this.undoStack.pop();
            this.portfolioData = JSON.parse(previousState);
            this.updateUI();
            this.updateUndoRedoButtons();
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            this.undoStack.push(JSON.stringify(this.portfolioData));
            const nextState = this.redoStack.pop();
            this.portfolioData = JSON.parse(nextState);
            this.updateUI();
            this.updateUndoRedoButtons();
        }
    }

    updateUndoRedoButtons() {
        document.getElementById('undoBtn').disabled = this.undoStack.length === 0;
        document.getElementById('redoBtn').disabled = this.redoStack.length === 0;
    }

    // Authentication
    checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('portfolio_admin_logged_in');
        if (isLoggedIn === 'true') {
            this.showAdminPanel();
        } else {
            this.showLoginScreen();
        }
    }

    showLoginScreen() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('adminPanel').classList.add('hidden');
    }

    showAdminPanel() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        this.loadPages();
        this.loadMediaLibrary();
        this.loadThemeSettings();
        this.loadSiteSettings();
    }

    login(password) {
        const adminPassword = this.portfolioData.settings?.adminPassword || 'admin123';
        if (password === adminPassword) {
            localStorage.setItem('portfolio_admin_logged_in', 'true');
            this.showAdminPanel();
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem('portfolio_admin_logged_in');
        this.showLoginScreen();
    }

    // Event Binding
    bindEvents() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeEvents());
        } else {
            this.initializeEvents();
        }
    }

    initializeEvents() {
        try {
            // Login
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const password = document.getElementById('password').value;
                    if (!this.login(password)) {
                        this.showAlert('Invalid password', 'error');
                    }
                });
            }

            // Header buttons
            this.bindHeaderButtons();
            this.bindPreviewModes();
            this.bindSidebarTabs();
            this.bindContentBlocks();
            this.bindThemeEvents();
            this.bindSettingsEvents();
            this.bindModalEvents();
            this.bindMediaEvents();

            console.log('Enhanced admin events initialized successfully');
        } catch (error) {
            console.error('Error initializing events:', error);
        }
    }

    bindHeaderButtons() {
        const buttons = [
            { id: 'undoBtn', handler: () => this.undo() },
            { id: 'redoBtn', handler: () => this.redo() },
            { id: 'saveBtn', handler: () => this.savePortfolioData() },
            { id: 'previewBtn', handler: () => this.openPreview() },
            { id: 'publishBtn', handler: () => this.publishSite() },
            { id: 'logoutBtn', handler: () => this.logout() }
        ];

        buttons.forEach(({ id, handler }) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', handler);
            } else {
                console.warn(`Button ${id} not found`);
            }
        });
    }

    bindPreviewModes() {
        document.querySelectorAll('.preview-mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode || e.target.getAttribute('data-mode');
                if (mode) this.setPreviewMode(mode);
            });
        });
    }

    bindSidebarTabs() {
        document.querySelectorAll('.sidebar-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab || e.target.getAttribute('data-tab');
                if (tabName) this.switchSidebarTab(tabName);
            });
        });
    }

    bindContentBlocks() {
        document.querySelectorAll('.content-block').forEach(block => {
            block.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type || e.currentTarget.getAttribute('data-type');
                if (type) this.addContentModule(type);
            });
        });
    }

    bindMediaEvents() {
        // Media upload
        const mediaUpload = document.getElementById('mediaUpload');
        if (mediaUpload) {
            mediaUpload.addEventListener('change', (e) => this.handleMediaUpload(e));
        }

        // Media upload button
        const uploadBtn = document.getElementById('uploadMediaBtn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                if (mediaUpload) mediaUpload.click();
            });
        }
    }

    bindThemeEvents() {
        document.getElementById('primaryColor').addEventListener('change', (e) => {
            this.updateTheme('primaryColor', e.target.value);
        });
        document.getElementById('secondaryColor').addEventListener('change', (e) => {
            this.updateTheme('secondaryColor', e.target.value);
        });
        document.getElementById('fontFamily').addEventListener('change', (e) => {
            this.updateTheme('fontFamily', e.target.value);
        });
        document.getElementById('layoutStyle').addEventListener('change', (e) => {
            this.updateTheme('layoutStyle', e.target.value);
        });
    }

    bindSettingsEvents() {
        document.getElementById('siteTitle').addEventListener('input', (e) => {
            this.updateSetting('siteTitle', e.target.value);
        });
        document.getElementById('siteDescription').addEventListener('input', (e) => {
            this.updateSetting('siteDescription', e.target.value);
        });
        document.getElementById('contactEmail').addEventListener('input', (e) => {
            this.updateSetting('contactEmail', e.target.value);
        });
    }

    bindModalEvents() {
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('active');
            });
        });
    }

    // Page Management
    loadPages() {
        const pagesList = document.getElementById('pagesList');
        pagesList.innerHTML = '';

        this.portfolioData.pages.forEach(page => {
            const pageElement = this.createPageElement(page);
            pagesList.appendChild(pageElement);
        });

        if (this.portfolioData.pages.length > 0 && !this.currentPage) {
            this.selectPage(this.portfolioData.pages[0].id);
        }
    }

    createPageElement(page) {
        const div = document.createElement('div');
        div.className = 'page-item';
        div.dataset.pageId = page.id;
        
        div.innerHTML = `
            <div class="page-info">
                <div class="page-title">${page.title}</div>
                <div class="page-meta">${page.type} • ${page.modules?.length || 0} modules</div>
            </div>
        `;

        div.addEventListener('click', () => this.selectPage(page.id));
        return div;
    }

    selectPage(pageId) {
        this.currentPage = pageId;
        
        document.querySelectorAll('.page-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page-id="${pageId}"]`)?.classList.add('active');

        this.loadPageContent(pageId);
    }

    loadPageContent(pageId) {
        const page = this.portfolioData.pages.find(p => p.id === pageId);
        if (!page) return;

        const canvas = document.getElementById('pageCanvas');
        canvas.innerHTML = '';

        if (!page.modules || page.modules.length === 0) {
            canvas.innerHTML = `
                <div class="canvas-placeholder">
                    <i class="fas fa-plus-circle"></i>
                    <p>Start adding content to this page</p>
                </div>
            `;
        } else {
            page.modules.forEach((module, index) => {
                const moduleElement = this.createModuleElement(module, index);
                canvas.appendChild(moduleElement);
            });
        }
    }

    // Content Module Management
    createModuleElement(module, index) {
        const div = document.createElement('div');
        div.className = 'content-module';
        div.dataset.moduleId = module.id;
        
        div.innerHTML = `
            <div class="module-content">
                ${this.renderModuleContent(module)}
            </div>
        `;

        return div;
    }

    renderModuleContent(module) {
        switch (module.type) {
            case 'text':
                return `<div class="text-content">${module.content || 'Click to edit text'}</div>`;
            case 'image':
                return `<div class="image-content">
                    ${module.src ? `<img src="${module.src}" alt="${module.alt || ''}" style="max-width: 100%;">` : 
                    '<div class="placeholder">Click to add image</div>'}
                </div>`;
            case 'button':
                return `<div class="button-content">
                    <a href="${module.href || '#'}" class="btn btn-primary">
                        ${module.text || 'Button Text'}
                    </a>
                </div>`;
            default:
                return '<div class="placeholder">Content module</div>';
        }
    }

    addContentModule(type) {
        if (!this.currentPage) {
            this.showAlert('Please select a page first', 'error');
            return;
        }

        const page = this.portfolioData.pages.find(p => p.id === this.currentPage);
        if (!page) return;

        const module = {
            id: Date.now().toString(),
            type: type,
            content: ''
        };

        switch (type) {
            case 'text':
                module.content = 'Enter your text here...';
                break;
            case 'button':
                module.text = 'Click Here';
                module.href = '#';
                break;
        }

        if (!page.modules) page.modules = [];
        page.modules.push(module);

        this.savePortfolioData();
        this.loadPageContent(this.currentPage);
    }

    // Media Management
    loadMediaLibrary() {
        const mediaGrid = document.getElementById('mediaGrid');
        mediaGrid.innerHTML = '';

        this.mediaFiles.forEach(file => {
            const div = document.createElement('div');
            div.className = 'media-item';
            div.innerHTML = `<img src="${file.url}" alt="${file.name}">`;
            mediaGrid.appendChild(div);
        });
    }

    loadMediaFiles() {
        const saved = localStorage.getItem('mediaFiles');
        return saved ? JSON.parse(saved) : [];
    }

    // Theme Management
    loadThemeSettings() {
        document.getElementById('primaryColor').value = this.portfolioData.theme.primaryColor;
        document.getElementById('secondaryColor').value = this.portfolioData.theme.secondaryColor;
        document.getElementById('fontFamily').value = this.portfolioData.theme.fontFamily;
        document.getElementById('layoutStyle').value = this.portfolioData.theme.layoutStyle;
    }

    updateTheme(property, value) {
        this.portfolioData.theme[property] = value;
        this.savePortfolioData();
    }

    // Settings Management
    loadSiteSettings() {
        document.getElementById('siteTitle').value = this.portfolioData.settings.siteTitle;
        document.getElementById('siteDescription').value = this.portfolioData.settings.siteDescription;
        document.getElementById('contactEmail').value = this.portfolioData.settings.contactEmail;
    }

    updateSetting(key, value) {
        this.portfolioData.settings[key] = value;
        this.savePortfolioData();
    }

    // Preview Mode Management
    setPreviewMode(mode) {
        this.previewMode = mode;
        
        document.querySelectorAll('.preview-mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        const container = document.querySelector('.canvas-container');
        container.className = `canvas-container ${mode}-mode`;
    }

    // Sidebar Management
    switchSidebarTab(tabName) {
        document.querySelectorAll('.sidebar-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.sidebar-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}Panel`).classList.add('active');
    }

    // Utility Methods
    updateUI() {
        this.loadPages();
        this.loadMediaLibrary();
        this.loadThemeSettings();
        this.loadSiteSettings();
        if (this.currentPage) {
            this.loadPageContent(this.currentPage);
        }
    }

    openPreview() {
        window.open('index.html', '_blank');
    }

    publishSite() {
        this.showAlert('Site published successfully!', 'success');
    }

    loadInitialData() {
        // Initialize with default data if needed
    }

    showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.375rem;
            color: white;
            z-index: 10000;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 3000);
    }
}

// Initialize admin when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new EnhancedPortfolioAdmin();
});
