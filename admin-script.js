// Admin Panel JavaScript
class PortfolioAdmin {
    constructor() {
        this.currentUser = null;
        this.portfolioData = this.loadPortfolioData();
        this.mediaFiles = this.loadMediaFiles();
        this.currentEditingItem = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialData();
        this.checkAuthStatus();
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
        this.loadPortfolioItems();
        this.loadMediaLibrary();
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

    // Data Management
    loadPortfolioData() {
        const defaultData = {
            hero: {
                title: 'Your Name',
                description: 'Your professional tagline or description'
            },
            about: {
                title: 'About Me',
                description: 'Tell your story here...'
            },
            contact: {
                email: 'your.email@example.com',
                phone: '+1 (555) 123-4567'
            },
            settings: {
                siteTitle: 'My Portfolio',
                logoText: 'Portfolio',
                adminPassword: 'admin123'
            },
            portfolioItems: []
        };

        const saved = localStorage.getItem('portfolioData');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    savePortfolioData() {
        localStorage.setItem('portfolioData', JSON.stringify(this.portfolioData));
    }

    loadMediaFiles() {
        const saved = localStorage.getItem('mediaFiles');
        return saved ? JSON.parse(saved) : [];
    }

    saveMediaFiles() {
        localStorage.setItem('mediaFiles', JSON.stringify(this.mediaFiles));
    }

    loadInitialData() {
        // Load hero section
        if (document.getElementById('heroTitle')) {
            document.getElementById('heroTitle').value = this.portfolioData.hero.title;
        }
        if (document.getElementById('heroDescription')) {
            document.getElementById('heroDescription').value = this.portfolioData.hero.description;
        }

        // Load contact section
        if (document.getElementById('contactEmail')) {
            document.getElementById('contactEmail').value = this.portfolioData.contact.email;
        }
        if (document.getElementById('contactPhone')) {
            document.getElementById('contactPhone').value = this.portfolioData.contact.phone;
        }
        if (document.getElementById('contactTitle')) {
            document.getElementById('contactTitle').value = this.portfolioData.contact.title || 'Let\'s Create Something Amazing';
        }
        if (document.getElementById('contactSubtitle')) {
            document.getElementById('contactSubtitle').value = this.portfolioData.contact.subtitle || 'Ready to elevate your brand with professional design solutions?';
        }

        // Load settings
        if (document.getElementById('siteTitle')) {
            document.getElementById('siteTitle').value = this.portfolioData.settings.siteTitle;
        }
        if (document.getElementById('logoText')) {
            document.getElementById('logoText').value = this.portfolioData.settings.logoText;
        }
        if (document.getElementById('adminPassword')) {
            document.getElementById('adminPassword').value = this.portfolioData.settings.adminPassword;
        }

        // Load comprehensive page content
        this.loadPageContent();
    }

    loadPageContent() {
        // Initialize enhanced data structure if needed
        if (!this.portfolioData.navigation) {
            this.portfolioData.navigation = {
                logoText: this.portfolioData.settings.logoText || 'Portfolio',
                logoIcon: 'fas fa-mountain'
            };
        }
        if (!this.portfolioData.about) {
            this.portfolioData.about = {
                title: 'About Me',
                intro: 'Brief introduction...',
                paragraph1: 'First paragraph...',
                paragraph2: 'Second paragraph...',
                paragraph3: 'Third paragraph...'
            };
        }
        if (!this.portfolioData.skills) {
            this.portfolioData.skills = {
                designTitle: 'Design Skills',
                designSkills: ['Brand Identity', 'Event Design', 'Tech & Gaming', 'Food & Lifestyle', 'Personal Projects'],
                technicalTitle: 'Technical Skills',
                technicalSkills: ['Adobe Creative Suite', 'Figma', 'HTML/CSS']
            };
        }
        if (!this.portfolioData.stats) {
            this.portfolioData.stats = [
                { number: '150+', label: 'Projects Completed' },
                { number: '50+', label: 'Happy Clients' },
                { number: '5+', label: 'Years Experience' }
            ];
        }
        if (!this.portfolioData.footer) {
            this.portfolioData.footer = {
                text: '© 2025 Your Name. All rights reserved.'
            };
        }

        // Load navigation content
        const navLogoText = document.getElementById('navLogoText');
        const navLogoIcon = document.getElementById('navLogoIcon');
        if (navLogoText) navLogoText.value = this.portfolioData.navigation.logoText;
        if (navLogoIcon) navLogoIcon.value = this.portfolioData.navigation.logoIcon;

        // Load about content
        const aboutSectionTitle = document.getElementById('aboutSectionTitle');
        const aboutIntro = document.getElementById('aboutIntro');
        const aboutPara1 = document.getElementById('aboutPara1');
        const aboutPara2 = document.getElementById('aboutPara2');
        const aboutPara3 = document.getElementById('aboutPara3');
        
        if (aboutSectionTitle) aboutSectionTitle.value = this.portfolioData.about.title;
        if (aboutIntro) aboutIntro.value = this.portfolioData.about.intro;
        if (aboutPara1) aboutPara1.value = this.portfolioData.about.paragraph1;
        if (aboutPara2) aboutPara2.value = this.portfolioData.about.paragraph2;
        if (aboutPara3) aboutPara3.value = this.portfolioData.about.paragraph3;

        // Load skills content
        const designSkillsTitle = document.getElementById('designSkillsTitle');
        const designSkillsList = document.getElementById('designSkillsList');
        const technicalSkillsTitle = document.getElementById('technicalSkillsTitle');
        const technicalSkillsList = document.getElementById('technicalSkillsList');
        
        if (designSkillsTitle) designSkillsTitle.value = this.portfolioData.skills.designTitle;
        if (designSkillsList) designSkillsList.value = this.portfolioData.skills.designSkills.join('\n');
        if (technicalSkillsTitle) technicalSkillsTitle.value = this.portfolioData.skills.technicalTitle;
        if (technicalSkillsList) technicalSkillsList.value = this.portfolioData.skills.technicalSkills.join('\n');

        // Load stats content
        const stat1Number = document.getElementById('stat1Number');
        const stat1Label = document.getElementById('stat1Label');
        const stat2Number = document.getElementById('stat2Number');
        const stat2Label = document.getElementById('stat2Label');
        const stat3Number = document.getElementById('stat3Number');
        const stat3Label = document.getElementById('stat3Label');
        
        if (stat1Number) stat1Number.value = this.portfolioData.stats[0].number;
        if (stat1Label) stat1Label.value = this.portfolioData.stats[0].label;
        if (stat2Number) stat2Number.value = this.portfolioData.stats[1].number;
        if (stat2Label) stat2Label.value = this.portfolioData.stats[1].label;
        if (stat3Number) stat3Number.value = this.portfolioData.stats[2].number;
        if (stat3Label) stat3Label.value = this.portfolioData.stats[2].label;

        // Load footer content
        const footerText = document.getElementById('footerText');
        if (footerText) footerText.value = this.portfolioData.footer.text;
    }

    // Event Binding
    bindEvents() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            if (!this.login(password)) {
                this.showAlert('Invalid password', 'error');
            }
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Navigation
        this.bindNavigation();

        // Logo management
        const logoFileInput = document.getElementById('logoFileInput');
        if (logoFileInput) {
            logoFileInput.addEventListener('change', (e) => {
                this.handleLogoUpload(e.target.files[0]);
            });
        }

        const resetLogoBtn = document.getElementById('resetLogoBtn');
        if (resetLogoBtn) {
            resetLogoBtn.addEventListener('click', () => {
                this.resetLogo();
            });
        }

        // Portfolio management buttons
        const addPortfolioBtn = document.getElementById('addPortfolioItem');
        if (addPortfolioBtn) {
            addPortfolioBtn.addEventListener('click', () => {
                this.openPortfolioItemModal();
            });
        }

        // File upload
        this.setupFileUpload();

        // Form inputs
        this.bindFormInputs();

        // Modal events
        this.bindModalEvents();

        // Page editor events
        this.bindPageEditorEvents();
    }

    bindNavigation() {
        // Sidebar navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
                
                // Update active state
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
    }

    switchSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.editor-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName + 'Section');
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    bindFormInputs() {
        // Hero section
        document.getElementById('heroTitle').addEventListener('input', (e) => {
            this.portfolioData.hero.title = e.target.value;
            this.savePortfolioData();
        });

        document.getElementById('heroDescription').addEventListener('input', (e) => {
            this.portfolioData.hero.description = e.target.value;
            this.savePortfolioData();
        });

        // About section
        document.getElementById('aboutTitle').addEventListener('input', (e) => {
            this.portfolioData.about.title = e.target.value;
            this.savePortfolioData();
        });

        document.getElementById('aboutDescription').addEventListener('input', (e) => {
            this.portfolioData.about.description = e.target.value;
            this.savePortfolioData();
        });

        // Contact section
        document.getElementById('contactEmail').addEventListener('input', (e) => {
            this.portfolioData.contact.email = e.target.value;
            this.savePortfolioData();
        });

        document.getElementById('contactPhone').addEventListener('input', (e) => {
            this.portfolioData.contact.phone = e.target.value;
            this.savePortfolioData();
        });

        // Settings
        document.getElementById('siteTitle').addEventListener('input', (e) => {
            this.portfolioData.settings.siteTitle = e.target.value;
            this.savePortfolioData();
        });

        document.getElementById('logoText').addEventListener('input', (e) => {
            this.portfolioData.settings.logoText = e.target.value;
            this.updateLogoText(e.target.value);
            this.savePortfolioData();
        });

        document.getElementById('adminPassword').addEventListener('input', (e) => {
            this.portfolioData.settings.adminPassword = e.target.value;
            this.savePortfolioData();
        });
    }

    bindModalEvents() {
        // Image selector
        document.getElementById('selectCoverImageBtn').addEventListener('click', () => {
            this.openImageSelector('cover');
        });

        // Image collection management
        document.getElementById('addImagesBtn').addEventListener('click', () => {
            this.openImageSelector('images');
        });

        document.getElementById('uploadMultipleBtn').addEventListener('click', () => {
            document.getElementById('multipleFileInput').click();
        });

        document.getElementById('multipleFileInput').addEventListener('change', (e) => {
            this.handleMultipleFileUpload(e.target.files);
            e.target.value = ''; // Reset input to allow same files again
        });

        document.getElementById('savePortfolioItemBtn').addEventListener('click', () => {
            this.savePortfolioItem();
        });

        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveAllChanges();
        });

        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => {
            window.open('index.html', '_blank');
        });

        // Modal close events
        document.getElementById('saveItemBtn')?.addEventListener('click', () => {
            this.savePortfolioItem();
        });

        document.getElementById('cancelBtn')?.addEventListener('click', () => {
            this.closeModals();
        });

        // Modal click outside to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModals();
                }
            });
        });
    }

    // File Upload
    setupFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        if (!uploadArea || !fileInput) return;

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            this.handleFileUpload(files);
        });

        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFileUpload(files);
            e.target.value = ''; // Reset input to allow same files again
        });
    }

    handleFileUpload(files) {
        const fileArray = Array.from(files);
        let processedCount = 0;
        
        if (fileArray.length === 0) return;
        
        fileArray.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const mediaItem = {
                        id: Date.now() + Math.random() + index,
                        name: file.name,
                        url: e.target.result,
                        type: file.type,
                        size: file.size,
                        uploadDate: new Date().toISOString()
                    };
                    
                    this.mediaFiles.push(mediaItem);
                    processedCount++;
                    
                    // Save and refresh grid only after all files are processed
                    if (processedCount === fileArray.length) {
                        this.saveMediaFiles();
                        this.loadMediaGrid();
                        this.showAlert(`${processedCount} files uploaded successfully!`, 'success');
                    }
                };
                reader.readAsDataURL(file);
            } else {
                processedCount++;
                if (processedCount === fileArray.length) {
                    this.saveMediaFiles();
                    this.loadMediaGrid();
                }
            }
        });
    }

    // Multiple file upload for image collections
    handleMultipleFileUpload(files) {
        const uploadedFiles = [];
        let processedCount = 0;
        const fileArray = Array.from(files);
        
        if (fileArray.length === 0) return;
        
        fileArray.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = {
                        id: Date.now() + Math.random() + index,
                        name: file.name,
                        url: e.target.result,
                        size: file.size,
                        type: file.type
                    };
                    this.mediaFiles.push(imageData);
                    uploadedFiles.push(imageData);
                    processedCount++;
                    
                    if (processedCount === fileArray.length) {
                        this.saveMediaFiles();
                        this.loadMediaGrid();
                        // Auto-add uploaded files to current image collection
                        if (this.currentEditingItem) {
                            uploadedFiles.forEach(file => {
                                this.addImageToCollection(file);
                            });
                        }
                        this.showAlert(`${uploadedFiles.length} files uploaded successfully!`, 'success');
                    }
                };
                reader.readAsDataURL(file);
            } else {
                processedCount++;
                if (processedCount === fileArray.length && uploadedFiles.length > 0) {
                    this.saveMediaFiles();
                    this.loadMediaGrid();
                    if (this.currentEditingItem) {
                        uploadedFiles.forEach(file => {
                            this.addImageToCollection(file);
                        });
                    }
                }
            }
        });
    }

    // Image Collection Management
    addImageToCollection(imageData) {
        if (!this.currentEditingItem) return;
        
        const item = this.portfolioData.portfolioItems.find(i => i.id === this.currentEditingItem);
        if (!item) return;
        
        const imageItem = {
            id: imageData.id,
            url: imageData.url,
            title: imageData.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            description: '',
            caption: '',
            order: item.images ? item.images.length : 0
        };
        
        if (!item.images) {
            item.images = [];
        }
        
        item.images.push(imageItem);
        this.savePortfolioData();
        this.loadImageCollection();
    }

    // Portfolio Item Management
    loadPortfolioItems() {
        const container = document.getElementById('portfolioItemsGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.portfolioData.portfolioItems.forEach(item => {
            const itemElement = this.createPortfolioItemElement(item);
            container.appendChild(itemElement);
        });
    }

    createPortfolioItemElement(item) {
        const div = document.createElement('div');
        div.className = 'portfolio-item-card';
        
        const imageCount = item.images ? item.images.length : 0;
        const coverImage = item.coverImage || (item.images && item.images[0] ? item.images[0].url : '');
        
        div.innerHTML = `
            <div class="portfolio-item-preview" ${coverImage ? `style="background-image: url('${coverImage}')"` : ''}>
                <div class="portfolio-item-overlay">
                    <h3>${item.title}</h3>
                    <p>${imageCount} images</p>
                </div>
            </div>
            <div class="portfolio-item-actions">
                <button class="btn btn-primary" onclick="admin.editPortfolioItem('${item.id}')">Edit</button>
                <button class="btn btn-danger" onclick="admin.deletePortfolioItem('${item.id}')">Delete</button>
            </div>
        `;
        
        return div;
    }

    openPortfolioItemModal(itemId = null) {
        const modal = document.getElementById('portfolioItemModal');
        if (!modal) return;
        
        this.currentEditingItem = itemId;
        
        if (itemId) {
            // Edit existing item
            const item = this.portfolioData.portfolioItems.find(i => i.id === itemId);
            if (item) {
                document.getElementById('itemTitle').value = item.title || '';
                document.getElementById('itemDescription').value = item.description || '';
                document.getElementById('itemCategory').value = item.category || '';
                document.getElementById('itemTags').value = item.tags ? item.tags.join(', ') : '';
                this.loadImageCollection();
            }
        } else {
            // New item
            document.getElementById('itemTitle').value = '';
            document.getElementById('itemDescription').value = '';
            document.getElementById('itemCategory').value = '';
            document.getElementById('itemTags').value = '';
            document.getElementById('imageCollectionGrid').innerHTML = '';
        }
        
        modal.classList.add('active');
    }

    editPortfolioItem(itemId) {
        this.openPortfolioItemModal(itemId);
    }

    deletePortfolioItem(itemId) {
        if (confirm('Are you sure you want to delete this portfolio item?')) {
            this.portfolioData.portfolioItems = this.portfolioData.portfolioItems.filter(i => i.id !== itemId);
            this.savePortfolioData();
            this.loadPortfolioItems();
            this.showAlert('Portfolio item deleted successfully!', 'success');
        }
    }

    savePortfolioItem() {
        const title = document.getElementById('itemTitle').value.trim();
        const description = document.getElementById('itemDescription').value.trim();
        const category = document.getElementById('itemCategory').value.trim();
        const tags = document.getElementById('itemTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        if (!title) {
            this.showAlert('Please enter a title for the portfolio item', 'error');
            return;
        }
        
        let item;
        if (this.currentEditingItem) {
            // Update existing item
            item = this.portfolioData.portfolioItems.find(i => i.id === this.currentEditingItem);
            if (!item) return;
        } else {
            // Create new item
            item = {
                id: Date.now().toString(),
                images: []
            };
            this.portfolioData.portfolioItems.push(item);
        }
        
        item.title = title;
        item.description = description;
        item.category = category;
        item.tags = tags;
        
        this.savePortfolioData();
        this.loadPortfolioItems();
        this.closeModals();
        this.showAlert('Portfolio item saved successfully!', 'success');
    }

    // Media Library Management
    loadMediaLibrary() {
        this.loadMediaGrid();
    }

    loadMediaGrid() {
        const container = document.getElementById('mediaGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.mediaFiles.forEach(file => {
            const mediaElement = this.createMediaElement(file);
            container.appendChild(mediaElement);
        });
    }

    createMediaElement(file) {
        const div = document.createElement('div');
        div.className = 'media-item';
        div.innerHTML = `
            <img src="${file.url}" alt="${file.name}" loading="lazy">
            <div class="media-item-overlay">
                <div class="media-item-info">
                    <div class="media-item-name">${file.name}</div>
                    <div class="media-item-size">${this.formatFileSize(file.size)}</div>
                </div>
                <div class="media-item-actions">
                    <button class="btn btn-sm btn-primary" onclick="admin.selectMedia('${file.id}')">Select</button>
                    <button class="btn btn-sm btn-danger" onclick="admin.deleteMedia('${file.id}')">Delete</button>
                </div>
            </div>
        `;
        return div;
    }

    selectMedia(fileId) {
        const file = this.mediaFiles.find(f => f.id === fileId);
        if (!file) return;
        
        if (this.currentEditingItem) {
            this.addImageToCollection(file);
        }
        
        this.closeModals();
    }

    deleteMedia(fileId) {
        if (confirm('Are you sure you want to delete this media file?')) {
            this.mediaFiles = this.mediaFiles.filter(f => f.id !== fileId);
            this.saveMediaFiles();
            this.loadMediaGrid();
            this.showAlert('Media file deleted successfully!', 'success');
        }
    }

    // Image Collection for Portfolio Items
    loadImageCollection() {
        const container = document.getElementById('imageCollectionGrid');
        if (!container || !this.currentEditingItem) return;
        
        const item = this.portfolioData.portfolioItems.find(i => i.id === this.currentEditingItem);
        if (!item || !item.images) {
            container.innerHTML = '<div class="no-images">No images in this collection</div>';
            return;
        }
        
        container.innerHTML = '';
        
        item.images.forEach((image, index) => {
            const imageElement = this.createImageCollectionElement(image, index);
            container.appendChild(imageElement);
        });
    }

    createImageCollectionElement(image, index) {
        const div = document.createElement('div');
        div.className = 'image-collection-item';
        div.innerHTML = `
            <img src="${image.url}" alt="${image.title}" loading="lazy">
            <div class="image-collection-overlay">
                <input type="text" class="image-title-input" value="${image.title || ''}" 
                       onchange="admin.updateImageTitle('${image.id}', this.value)" placeholder="Image title">
                <textarea class="image-description-input" 
                          onchange="admin.updateImageDescription('${image.id}', this.value)" 
                          placeholder="Description">${image.description || ''}</textarea>
                <input type="text" class="image-caption-input" value="${image.caption || ''}" 
                       onchange="admin.updateImageCaption('${image.id}', this.value)" placeholder="Caption">
                <div class="image-actions">
                    <button class="btn btn-sm btn-danger" onclick="admin.removeImageFromCollection('${image.id}')">Remove</button>
                </div>
            </div>
        `;
        return div;
    }

    updateImageTitle(imageId, title) {
        if (!this.currentEditingItem) return;
        
        const item = this.portfolioData.portfolioItems.find(i => i.id === this.currentEditingItem);
        if (!item || !item.images) return;
        
        const image = item.images.find(img => img.id === imageId);
        if (image) {
            image.title = title;
            this.savePortfolioData();
        }
    }

    updateImageDescription(imageId, description) {
        if (!this.currentEditingItem) return;
        
        const item = this.portfolioData.portfolioItems.find(i => i.id === this.currentEditingItem);
        if (!item || !item.images) return;
        
        const image = item.images.find(img => img.id === imageId);
        if (image) {
            image.description = description;
            this.savePortfolioData();
        }
    }

    updateImageCaption(imageId, caption) {
        if (!this.currentEditingItem) return;
        
        const item = this.portfolioData.portfolioItems.find(i => i.id === this.currentEditingItem);
        if (!item || !item.images) return;
        
        const image = item.images.find(img => img.id === imageId);
        if (image) {
            image.caption = caption;
            this.savePortfolioData();
        }
    }

    removeImageFromCollection(imageId) {
        if (!this.currentEditingItem) return;
        
        const item = this.portfolioData.portfolioItems.find(i => i.id === this.currentEditingItem);
        if (!item || !item.images) return;
        
        item.images = item.images.filter(img => img.id !== imageId);
        this.savePortfolioData();
        this.loadImageCollection();
        this.showAlert('Image removed from collection!', 'success');
    }

    // Image Selector Modal
    openImageSelector(type) {
        const modal = document.getElementById('imageSelectorModal');
        if (!modal) return;
        
        this.currentSelectorType = type;
        this.loadImageSelectorGrid();
        modal.classList.add('active');
    }

    loadImageSelectorGrid() {
        const container = document.getElementById('imageSelectorGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.mediaFiles.forEach(file => {
            const div = document.createElement('div');
            div.className = 'image-selector-item';
            div.innerHTML = `
                <img src="${file.url}" alt="${file.name}" loading="lazy">
                <button class="btn btn-primary" onclick="admin.selectImageFromSelector('${file.id}')">Select</button>
            `;
            container.appendChild(div);
        });
    }

    selectImageFromSelector(fileId) {
        const file = this.mediaFiles.find(f => f.id === fileId);
        if (!file) return;
        
        if (this.currentSelectorType === 'cover' && this.currentEditingItem) {
            const item = this.portfolioData.portfolioItems.find(i => i.id === this.currentEditingItem);
            if (item) {
                item.coverImage = file.url;
                this.savePortfolioData();
            }
        } else if (this.currentSelectorType === 'images' && this.currentEditingItem) {
            this.addImageToCollection(file);
        }
        
        this.closeModals();
    }

    // Logo Management
    handleLogoUpload(file) {
        if (!file || !file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.portfolioData.settings.logoImage = e.target.result;
            this.savePortfolioData();
            this.updateLogoDisplay();
            this.showAlert('Logo uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }

    resetLogo() {
        this.portfolioData.settings.logoImage = null;
        this.savePortfolioData();
        this.updateLogoDisplay();
        this.showAlert('Logo reset successfully!', 'success');
    }

    updateLogoDisplay() {
        const logoPreview = document.getElementById('logoPreview');
        if (!logoPreview) return;
        
        if (this.portfolioData.settings.logoImage) {
            logoPreview.innerHTML = `<img src="${this.portfolioData.settings.logoImage}" alt="Logo">`;
        } else {
            logoPreview.innerHTML = `<div class="logo-text">${this.portfolioData.settings.logoText}</div>`;
        }
    }

    updateLogoText(text) {
        this.updateLogoDisplay();
    }

    // Modal Management
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.currentEditingItem = null;
        this.currentSelectorType = null;
    }

    // Utility Functions
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showAlert(message, type = 'info') {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        // Add to page
        document.body.appendChild(alert);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 3000);
    }

    bindPageEditorEvents() {
        // Page selector
        const pageSelector = document.getElementById('pageSelector');
        if (pageSelector) {
            pageSelector.addEventListener('change', (e) => this.switchPageEditor(e.target.value));
        }

        // Save all pages button
        const saveAllPages = document.getElementById('saveAllPages');
        if (saveAllPages) {
            saveAllPages.addEventListener('click', () => this.saveAllPageContent());
        }

        // Bind all page content inputs
        this.bindPageContentInputs();
    }

    switchPageEditor(pageType) {
        // Hide all page editors
        document.querySelectorAll('.page-editor').forEach(editor => {
            editor.classList.remove('active');
        });

        // Show selected page editor
        const targetEditor = document.getElementById(pageType + 'PageEditor');
        if (targetEditor) {
            targetEditor.classList.add('active');
        }
    }

    bindPageContentInputs() {
        // Navigation inputs
        const navLogoText = document.getElementById('navLogoText');
        const navLogoIcon = document.getElementById('navLogoIcon');
        if (navLogoText) {
            navLogoText.addEventListener('input', (e) => {
                this.portfolioData.navigation.logoText = e.target.value;
                this.savePortfolioData();
            });
        }
        if (navLogoIcon) {
            navLogoIcon.addEventListener('input', (e) => {
                this.portfolioData.navigation.logoIcon = e.target.value;
                this.savePortfolioData();
            });
        }

        // About section inputs
        const aboutInputs = ['aboutSectionTitle', 'aboutIntro', 'aboutPara1', 'aboutPara2', 'aboutPara3'];
        const aboutFields = ['title', 'intro', 'paragraph1', 'paragraph2', 'paragraph3'];
        
        aboutInputs.forEach((inputId, index) => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.portfolioData.about[aboutFields[index]] = e.target.value;
                    this.savePortfolioData();
                });
            }
        });

        // Skills inputs
        const skillInputs = ['designSkillsTitle', 'technicalSkillsTitle'];
        const skillFields = ['designTitle', 'technicalTitle'];
        
        skillInputs.forEach((inputId, index) => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.portfolioData.skills[skillFields[index]] = e.target.value;
                    this.savePortfolioData();
                });
            }
        });

        // Skills lists
        const designSkillsList = document.getElementById('designSkillsList');
        const technicalSkillsList = document.getElementById('technicalSkillsList');
        if (designSkillsList) {
            designSkillsList.addEventListener('input', (e) => {
                this.portfolioData.skills.designSkills = e.target.value.split('\n').filter(skill => skill.trim());
                this.savePortfolioData();
            });
        }
        if (technicalSkillsList) {
            technicalSkillsList.addEventListener('input', (e) => {
                this.portfolioData.skills.technicalSkills = e.target.value.split('\n').filter(skill => skill.trim());
                this.savePortfolioData();
            });
        }

        // Stats inputs
        const statInputs = ['stat1Number', 'stat1Label', 'stat2Number', 'stat2Label', 'stat3Number', 'stat3Label'];
        statInputs.forEach((inputId, index) => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', (e) => {
                    const statIndex = Math.floor(index / 2);
                    const field = index % 2 === 0 ? 'number' : 'label';
                    this.portfolioData.stats[statIndex][field] = e.target.value;
                    this.savePortfolioData();
                });
            }
        });

        // Footer input
        const footerText = document.getElementById('footerText');
        if (footerText) {
            footerText.addEventListener('input', (e) => {
                this.portfolioData.footer.text = e.target.value;
                this.savePortfolioData();
            });
        }
    }

    saveAllPageContent() {
        this.savePortfolioData();
        this.showAlert('All page content saved successfully!', 'success');
    }

    // Portfolio Items Management - Fix the display
    loadPortfolioItems() {
        const container = document.getElementById('portfolioItems');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!this.portfolioData.portfolioItems || this.portfolioData.portfolioItems.length === 0) {
            container.innerHTML = '<div class="no-items">No portfolio items yet. Click "Add New Item" to get started.</div>';
            return;
        }
        
        this.portfolioData.portfolioItems.forEach(item => {
            const itemElement = this.createPortfolioItemElement(item);
            container.appendChild(itemElement);
        });
    }

    saveAllChanges() {
        this.savePortfolioData();
        this.saveMediaFiles();
        this.showAlert('All changes saved successfully!', 'success');
    }
}

// Initialize admin when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new PortfolioAdmin();
});
