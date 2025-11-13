// Language and theme state
let currentLang = localStorage.getItem("lang") || "en";
let isDarkMode = false;

// Data variables - will be loaded from JSON
let classificationConfig = {};
let products = [];
let bestSellingProducts = [];
let searchTerm = '';

// Pagination variables
const PRODUCTS_PER_PAGE = 20;
let currentPage = 1;
let displayedProducts = [];
let allFilteredProducts = [];

// Load data from JSON files
async function loadData() {
    try {
        const [productsResponse, categoriesResponse] = await Promise.all([
            fetch('/api/products'),
            fetch('/api/categories')
        ]);
        
        if (!productsResponse.ok || !categoriesResponse.ok) {
            throw new Error('API request failed, falling back to JSON files');
        }
        
        const rawProducts = await productsResponse.json();
        classificationConfig = await categoriesResponse.json();
        
        // Filter and validate products data
        products = rawProducts.filter(product => 
            product && product.id && product.name && product.primaryCategory
        );
        
        // Build bestsellers array from products data (products with isBestseller flag)
        bestSellingProducts = products
            .filter(product => product.isBestseller)
            .map(product => ({
                ...product,
                originalPrice: product.price,
                discount: product.discountPercent || 0
            }));
        
        console.log('Data loaded successfully from API');
        return true;
    } catch (error) {
        console.error('Error loading data from API, trying fallback:', error);
        
        // Fallback to JSON files if API fails
        try {
            const [productsResponse, categoriesResponse, bestsellersResponse] = await Promise.all([
                fetch('data/products.json'),
                fetch('data/categories.json'),
                fetch('data/bestsellers.json')
            ]);
            
            const rawProducts = await productsResponse.json();
            classificationConfig = await categoriesResponse.json();
            const bestsellersData = await bestsellersResponse.json();
            
            // Filter and validate products data
            products = rawProducts.filter(product => 
                product && product.id && product.name && product.description && product.category
            );
            
            // Build bestsellers array from products and bestsellers data
            bestSellingProducts = bestsellersData
                .map(bestseller => {
                    const product = products.find(p => p.id === bestseller.productId);
                    if (!product) return null;
                    return {
                        ...product,
                        originalPrice: bestseller.originalPrice,
                        discount: bestseller.discount
                    };
                })
                .filter(item => item !== null);
            
            console.log('Data loaded successfully from JSON fallback');
            return true;
        } catch (fallbackError) {
            console.error('Error loading fallback data:', fallbackError);
            return false;
        }
    }
}

// Current filter state
let currentPrimaryCategory = null;
let currentSecondaryCategory = null;
let currentTertiaryCategory = null;
let hasSelectedCategory = false;

// Language switching functionality
function toggleLanguage() {
    currentLang = currentLang === "en" ? "ar" : "en";
    localStorage.setItem("lang", currentLang);
  
    const html = document.documentElement;
    if (currentLang === "ar") {
      html.setAttribute("lang", "ar");
      html.setAttribute("dir", "rtl");
    } else {
      html.setAttribute("lang", "en");
      html.setAttribute("dir", "ltr");
    }
  
    updateTextContent();
}
  
// Dark mode functionality
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    const html = document.documentElement;
  
    if (isDarkMode) {
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("darkMode", "true");
    } else {
      html.setAttribute("data-theme", "light");
      localStorage.setItem("darkMode", "false");
    }
  
    updateDarkModeIcon();
}
  
// Update dark mode icon
function updateDarkModeIcon() {
    const darkModeIcon = document.querySelector(".dark-mode-icon");
    if (darkModeIcon) {
      darkModeIcon.textContent = isDarkMode ? "☀️" : "🌙";
    }
}

// Initialize dark mode from localStorage (called early to prevent FOUC)
function initializeDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    const html = document.documentElement;
    
    if (savedMode === 'true') {
        isDarkMode = true;
        html.setAttribute('data-theme', 'dark');
    } else {
        isDarkMode = false;
        html.setAttribute('data-theme', 'light');
    }
    
    // Update icon after DOM is ready
    setTimeout(() => updateDarkModeIcon(), 0);
}

// Initialize theme immediately to prevent FOUC
(function() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();

// Update all text content based on current language
function updateTextContent() {
    const elements = document.querySelectorAll('[data-en][data-ar]');
    elements.forEach(element => {
        if (currentLang === 'ar') {
            if (element.children.length === 0) {
                element.textContent = element.getAttribute('data-ar');
            } else {
                element.innerHTML = element.getAttribute('data-ar');
            }
        } else {
            if (element.children.length === 0) {
                element.textContent = element.getAttribute('data-en');
            } else {
                element.innerHTML = element.getAttribute('data-en');
            }
        }
    });
    
    // Update form placeholders and options if on contact page
    updateFormContent();
    
    // Re-render products and update classification bars if secondary bar is visible
    if (document.getElementById('primaryBar')) {
        if (currentSecondaryCategory && document.getElementById('secondaryBar').style.display !== 'none') {
            populateSecondaryBar(currentPrimaryCategory);
        }
        if (currentTertiaryCategory && document.getElementById('tertiaryBar').style.display !== 'none') {
            populateTertiaryBar(currentPrimaryCategory, currentSecondaryCategory);
        }
        // Display products if a category has been selected OR if search is active
        if (hasSelectedCategory || searchTerm) {
            displayProducts();
        }
    }
}

function updateFormContent() {
    // Update search input placeholder
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const placeholder = currentLang === 'ar' ? 'البحث عن المنتجات...' : 'Search products...';
        searchInput.placeholder = placeholder;
    }
}

// Search functionality with debouncing
let searchTimeout;
function performSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const searchInput = document.getElementById('searchInput');
        searchTerm = searchInput.value.toLowerCase().trim();
        
        // Reset category selection if searching
        if (searchTerm) {
            currentPrimaryCategory = null;
            currentSecondaryCategory = null;
            currentTertiaryCategory = null;
            hasSelectedCategory = false;
            
            // Hide classification bars when searching
            const primaryBar = document.getElementById('primaryBar');
            const secondaryBar = document.getElementById('secondaryBar');
            const tertiaryBar = document.getElementById('tertiaryBar');
            if (primaryBar) primaryBar.style.display = 'none';
            if (secondaryBar) secondaryBar.style.display = 'none';
            if (tertiaryBar) tertiaryBar.style.display = 'none';
        } else {
            // Show primary bar when search is cleared
            const primaryBar = document.getElementById('primaryBar');
            if (primaryBar) primaryBar.style.display = 'block';
        }
        
        resetPagination();
        displayProducts();
    }, 300);
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    searchTerm = '';
    currentPrimaryCategory = null;
    currentSecondaryCategory = null;
    currentTertiaryCategory = null;
    hasSelectedCategory = false;
    
    // Show primary bar
    const primaryBar = document.getElementById('primaryBar');
    const secondaryBar = document.getElementById('secondaryBar');
    const tertiaryBar = document.getElementById('tertiaryBar');
    if (primaryBar) primaryBar.style.display = 'block';
    if (secondaryBar) secondaryBar.style.display = 'none';
    if (tertiaryBar) tertiaryBar.style.display = 'none';
    
    resetPagination();
    
    // Show initial message
    const container = document.getElementById('productsContainer');
    if (container && primaryBar) {
        container.innerHTML = `
            <div class="no-products">
                <p data-en="Please select a category above to view products" data-ar="يرجى اختيار فئة أعلاه لعرض المنتجات">
                    ${currentLang === 'ar' ? 'يرجى اختيار فئة أعلاه لعرض المنتجات' : 'Please select a category above to view products'}
                </p>
            </div>
        `;
    }
}

function filterProductsBySearch(products) {
    if (!searchTerm) return products;
    
    return products.filter(product => {
        const name = product.name[currentLang].toLowerCase();
        const description = product.description[currentLang].toLowerCase();
        const id = product.id.toLowerCase();
        
        return name.includes(searchTerm) || 
               description.includes(searchTerm) || 
               id.includes(searchTerm);
    });
}

function setupSearchListeners() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Escape') {
                clearSearch();
            }
        });
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearSearch);
    }
}

// WhatsApp functionality
function openWhatsAppOrder(productId) {
    const whatsappNumber = "+9647819914700"; // Replace with actual WhatsApp business number
    const message = currentLang === 'ar' 
        ? `مرحبا! أود طلب المنتج رقم: ${productId}` 
        : `Hello! I would like to order product ID: ${productId}`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Primary category selection
function selectPrimaryCategory(primaryCategory) {
    currentPrimaryCategory = primaryCategory;
    currentSecondaryCategory = null;
    currentTertiaryCategory = null;
    hasSelectedCategory = true;
    
    // Update primary buttons
    document.querySelectorAll('.primary-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-primary="${primaryCategory}"]`).classList.add('active');
    
    // Hide primary bar and show secondary bar
    document.getElementById('primaryBar').style.display = 'none';
    document.getElementById('secondaryBar').style.display = 'block';
    document.getElementById('tertiaryBar').style.display = 'none';
    
    // Populate secondary bar
    populateSecondaryBar(primaryCategory);
    
    resetPagination();
    // Display all products for this primary category
    displayProducts();
}

// Populate secondary classification bar
function populateSecondaryBar(primaryCategory) {
    const secondaryBar = document.getElementById('secondaryBar');
    const categoryButtons = secondaryBar.querySelector('.category-buttons');
    
    const config = classificationConfig[primaryCategory];
    if (!config) return;
    
    categoryButtons.innerHTML = config.subcategories.map(subcat => `
        <button class="category-btn secondary-btn" 
                data-secondary="${subcat.key}" 
                data-en="${subcat.name.en}" 
                data-ar="${subcat.name.ar}"
                onclick="selectSecondaryCategory('${subcat.key}')">
            ${subcat.name[currentLang]}
        </button>
    `).join('') + `
        <button class="category-btn secondary-btn back-btn" 
                data-en="Back" 
                data-ar="رجوع"
                onclick="goBackToPrimary()">
            ${currentLang === 'ar' ? 'رجوع' : 'Back'}
        </button>
    `;
    
    // Restore active state for currently selected secondary category
    if (currentSecondaryCategory) {
        const activeBtn = categoryButtons.querySelector(`[data-secondary="${currentSecondaryCategory}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
}

// Secondary category selection
function selectSecondaryCategory(secondaryCategory) {
    currentSecondaryCategory = secondaryCategory;
    currentTertiaryCategory = null;
    
    // Update secondary buttons
    document.querySelectorAll('.secondary-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-secondary="${secondaryCategory}"]`).classList.add('active');
    
    // Hide secondary bar and show tertiary bar
    document.getElementById('secondaryBar').style.display = 'none';
    document.getElementById('tertiaryBar').style.display = 'block';
    
    // Populate tertiary bar
    populateTertiaryBar(currentPrimaryCategory, secondaryCategory);
    
    resetPagination();
    // Display filtered products
    displayProducts();
}

// Populate tertiary classification bar
function populateTertiaryBar(primaryCategory, secondaryCategory) {
    const tertiaryBar = document.getElementById('tertiaryBar');
    const categoryButtons = tertiaryBar.querySelector('.category-buttons');
    
    const config = classificationConfig[primaryCategory];
    if (!config) return;
    
    const subCategory = config.subcategories.find(sub => sub.key === secondaryCategory);
    if (!subCategory || !subCategory.tertiary) return;
    
    categoryButtons.innerHTML = subCategory.tertiary.map(tertiary => `
        <button class="category-btn tertiary-btn" 
                data-tertiary="${tertiary.key}" 
                data-en="${tertiary.name.en}" 
                data-ar="${tertiary.name.ar}"
                onclick="selectTertiaryCategory('${tertiary.key}')">
            ${tertiary.name[currentLang]}
        </button>
    `).join('') + `
        <button class="category-btn tertiary-btn back-btn" 
                data-en="Back" 
                data-ar="رجوع"
                onclick="goBackToSecondary()">
            ${currentLang === 'ar' ? 'رجوع' : 'Back'}
        </button>
    `;
    
    // Restore active state for currently selected tertiary category
    if (currentTertiaryCategory) {
        const activeBtn = categoryButtons.querySelector(`[data-tertiary="${currentTertiaryCategory}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
}

// Tertiary category selection
function selectTertiaryCategory(tertiaryCategory) {
    currentTertiaryCategory = tertiaryCategory;
    
    // Update tertiary buttons
    document.querySelectorAll('.tertiary-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tertiary="${tertiaryCategory}"]`).classList.add('active');
    
    resetPagination();
    // Display filtered products
    displayProducts();
}

// Go back to secondary categories
function goBackToSecondary() {
    currentTertiaryCategory = null;
    
    // Show secondary bar and hide tertiary bar
    document.getElementById('secondaryBar').style.display = 'block';
    document.getElementById('tertiaryBar').style.display = 'none';
    
    resetPagination();
    // Display all products for current secondary category
    displayProducts();
}

// Go back to primary categories
function goBackToPrimary() {
    currentSecondaryCategory = null;
    currentTertiaryCategory = null;
    
    // Show primary bar and hide secondary/tertiary bars
    document.getElementById('primaryBar').style.display = 'block';
    document.getElementById('secondaryBar').style.display = 'none';
    document.getElementById('tertiaryBar').style.display = 'none';
    
    resetPagination();
    // Display all products for current primary category
    displayProducts();
}

// Pagination variables
let isLoading = false;
let hasMoreProducts = true;
let scrollObserver = null;

// Pagination functions
function resetPagination() {
    currentPage = 1;
    displayedProducts = [];
    hasMoreProducts = true;
    isLoading = false;
    
    // Remove existing observer
    if (scrollObserver) {
        scrollObserver.disconnect();
        scrollObserver = null;
    }
}

function loadMoreProducts() {
    if (isLoading || !hasMoreProducts) return;
    
    isLoading = true;
    showLoadingIndicator();
    
    // Simulate loading delay for smooth UX
    setTimeout(() => {
        const startIndex = currentPage * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_PER_PAGE;
        const newProducts = allFilteredProducts.slice(startIndex, endIndex);
        
        if (newProducts.length > 0) {
            displayedProducts = displayedProducts.concat(newProducts);
            currentPage++;
            renderProducts(displayedProducts);
            
            // Check if there are more products
            if (displayedProducts.length >= allFilteredProducts.length) {
                hasMoreProducts = false;
            }
            
            // Re-setup scroll observer for new products
            setupScrollObserver();
        } else {
            hasMoreProducts = false;
        }
        
        isLoading = false;
        hideLoadingIndicator();
    }, 300);
}

function showLoadingIndicator() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingIndicator';
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = currentLang === 'ar' 
        ? 'جاري تحميل المزيد...' 
        : 'Loading more products...';
    
    container.appendChild(loadingDiv);
}

function hideLoadingIndicator() {
    const loadingDiv = document.getElementById('loadingIndicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function setupScrollObserver() {
    // Remove existing observer
    if (scrollObserver) {
        scrollObserver.disconnect();
    }
    
    if (!hasMoreProducts) return;
    
    // Create a sentinel element at the bottom of the products container
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    // Remove existing sentinel
    const existingSentinel = document.getElementById('scrollSentinel');
    if (existingSentinel) {
        existingSentinel.remove();
    }
    
    const sentinel = document.createElement('div');
    sentinel.id = 'scrollSentinel';
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    container.appendChild(sentinel);
    
    // Create intersection observer
    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && hasMoreProducts && !isLoading) {
                loadMoreProducts();
            }
        });
    }, {
        root: null,
        rootMargin: '100px', // Start loading when sentinel is 100px from viewport
        threshold: 0.1
    });
    
    scrollObserver.observe(sentinel);
}

function updateLoadMoreButton() {
    // Hide the load more button container since we're using scroll-based loading
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    if (loadMoreContainer) {
        loadMoreContainer.style.display = 'none';
    }
}

// Products functionality with images and pagination
function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    let filteredProducts;
    
    if (searchTerm) {
        // Search mode - search all products
        filteredProducts = filterProductsBySearch(products);
    } else if (currentTertiaryCategory) {
        // Filter by specific tertiary category
        filteredProducts = products.filter(product => 
            product.primaryCategory === currentPrimaryCategory && 
            product.category === currentSecondaryCategory &&
            product.tertiaryCategory === currentTertiaryCategory
        );
    } else if (currentSecondaryCategory) {
        // Filter by specific secondary category
        filteredProducts = products.filter(product => 
            product.primaryCategory === currentPrimaryCategory && 
            product.category === currentSecondaryCategory
        );
    } else if (currentPrimaryCategory) {
        // Show all products for current primary category
        filteredProducts = products.filter(product => 
            product.primaryCategory === currentPrimaryCategory
        );
    } else {
        // No selection made
        return;
    }
    
    allFilteredProducts = filteredProducts;
    
    if (filteredProducts.length === 0) {
        const noResultsMessage = searchTerm 
            ? (currentLang === 'ar' ? 'لا توجد منتجات تطابق البحث' : 'No products match your search')
            : (currentLang === 'ar' ? 'لا توجد منتجات في هذه الفئة' : 'No products found in this category');
            
        container.innerHTML = `
            <div class="no-products">
                <p>${noResultsMessage}</p>
            </div>
        `;
        
        document.getElementById('loadMoreContainer').style.display = 'none';
        return;
    }
    
    // Reset pagination and display first page
    resetPagination();
    displayedProducts = filteredProducts.slice(0, PRODUCTS_PER_PAGE);
    renderProducts(displayedProducts);
    
    // Check if there are more products and setup scroll observer
    if (filteredProducts.length > PRODUCTS_PER_PAGE) {
        hasMoreProducts = true;
        setupScrollObserver();
    } else {
        hasMoreProducts = false;
    }
    
    updateLoadMoreButton();
}

function renderProducts(productsToRender) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name[currentLang]}" loading="lazy">
                <div class="product-id">ID: ${product.id}</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name[currentLang]}</h3>
                <p class="product-description">${product.description[currentLang]}</p>
                <div class="product-price">${product.price}</div>
            </div>
            <button class="whatsapp-btn" onclick="openWhatsAppOrder('${product.id}')" data-en="Order via WhatsApp" data-ar="اطلب عبر واتساب">
                <span class="whatsapp-icon">📱</span>
                ${currentLang === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
            </button>
        </div>
    `).join('');
}

// Setup classification bars
function setupClassificationBars() {
    // Only setup if primary bar exists (products page)
    const primaryBar = document.getElementById('primaryBar');
    if (!primaryBar) return;
    
    const primaryButtons = document.querySelectorAll('.primary-btn');
    primaryButtons.forEach(button => {
        // Check if listener already attached to prevent duplicates
        if (!button.dataset.initialized) {
            button.dataset.initialized = 'true';
            button.addEventListener('click', () => {
                const primaryCategory = button.getAttribute('data-primary');
                selectPrimaryCategory(primaryCategory);
            });
        }
    });
    
    // Setup load more button (keep as fallback, but hide by default)
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn && !loadMoreBtn.dataset.initialized) {
        loadMoreBtn.dataset.initialized = 'true';
        loadMoreBtn.addEventListener('click', loadMoreProducts);
    }
}

// Best-selling products for homepage
function displayBestSellers() {
    const container = document.getElementById('bestSellersContainer');
    if (!container) return;
    
    container.innerHTML = bestSellingProducts.map(product => `
        <div class="bestseller-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name[currentLang]}" loading="lazy">
                ${product.discount ? `<div class="discount-badge">${product.discount} ${currentLang === 'ar' ? 'خصم' : 'OFF'}</div>` : ''}
                <div class="product-id">ID: ${product.id}</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name[currentLang]}</h3>
                <p class="product-description">${product.description[currentLang]}</p>
                <div class="price-section">
                    <div class="current-price">${product.price}</div>
                    ${product.originalPrice ? `<div class="original-price">${product.originalPrice}</div>` : ''}
                </div>
            </div>
            <button class="whatsapp-btn" onclick="openWhatsAppOrder('${product.id}')" data-en="Order via WhatsApp" data-ar="اطلب عبر واتساب">
                <span class="whatsapp-icon">📱</span>
                ${currentLang === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
            </button>
        </div>
    `).join('');
}

// Contact form functionality
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
   
}

// Initialize language from localStorage
const savedLang = localStorage.getItem("lang") || "en";
currentLang = savedLang;
if (currentLang === "ar") {
    document.documentElement.setAttribute("lang", "ar");
    document.documentElement.setAttribute("dir", "rtl");
} else {
    document.documentElement.setAttribute("lang", "en");
    document.documentElement.setAttribute("dir", "ltr");
}

// Initialize page functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize dark mode from saved preference
    initializeDarkMode();
    
    // Load data from JSON files
    const dataLoaded = await loadData();
    if (!dataLoaded) {
        console.error('Failed to load data');
        return;
    }
    
    // Setup classification bars
    setupClassificationBars();
    
    // Setup search functionality
    setupSearchListeners();
    
    // Ensure primary bar is visible initially (only if elements exist)
    const primaryBar = document.getElementById('primaryBar');
    const secondaryBar = document.getElementById('secondaryBar');
    const tertiaryBar = document.getElementById('tertiaryBar');
    if (primaryBar) {
        primaryBar.style.display = 'block';
    }
    if (secondaryBar) {
        secondaryBar.style.display = 'none';
    }
    if (tertiaryBar) {
        tertiaryBar.style.display = 'none';
    }

    // Initialize best sellers display on homepage
    displayBestSellers();
    
    // Set up contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Update form placeholders on page load
    updateFormContent();
    
    // Update text content for current language
    updateTextContent();
    
    // Display initial message since no category is selected (only on products page)
    const container = document.getElementById('productsContainer');
    if (container && primaryBar) {
        container.innerHTML = `
            <div class="no-products">
                <p data-en="Please select a category above to view products" data-ar="يرجى اختيار فئة أعلاه لعرض المنتجات">
                    ${currentLang === 'ar' ? 'يرجى اختيار فئة أعلاه لعرض المنتجات' : 'Please select a category above to view products'}
                </p>
            </div>
        `;
    }
});