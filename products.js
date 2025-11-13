// products.js - ملف مبسط للمنتجات متوافق مع نظام اللغة الجديد

const API_URL = '/api/products';
let allProducts = [];

// دوال الترجمة المتوافقة مع النظام الجديد
function getCategoryName(key) {
    const names = {
        'Oral': { en: '🦷 Oral and dental care', ar: '🦷  العناية ب الفم و الاسنان' },
        'Hair & Body Care': { en: '🧴 Hair & Body Care', ar: '🧴 العناية بالشعر والجسم' },
        'Personal Care': { en: '🧼 Personal Care', ar: '🧼 العناية الشخصية' },
        'baby': { en: '👶 Baby Products', ar: '👶 منتجات الأطفال' },
        'Health': { en: '🩺 Health & First Aid', ar: '🩺 الصحة والإسعافات' },
        'Specialv': { en: 'Special Products', ar: 'منتجات خاصة' },
        'Food': { en: 'Food & Sweeteners', ar: 'أغذية ومحليات' },
        'supplies': { en: 'Medical Supplies', ar: 'اللوازم الطبية' },
        'medicines': { en: 'Medicines', ar: 'الأدوية' },
        'equipment': { en: 'Medical Equipment', ar: 'الأجهزة الطبية' },
        'first_aid': { en: 'First Aid', ar: 'الإسعافات الأولية' }
    };
    
    const currentLang = window.languageManager.getCurrentLanguage();
    const category = names[key];
    return category ? category[currentLang] || category.ar : key;
}

function getTertiaryName(key) {
    const names = {
        // Oral Care
        'toothpaste': { en: 'Toothpaste', ar: 'معجون أسنان' },
        'toothbrush': { en: 'Toothbrushes', ar: 'فرش أسنان' },
        'mouthwash': { en: 'Mouthwash', ar: 'غسول فم' },
        
        // Hair & Body Care
        'shampoo': { en: 'Shampoo', ar: 'شامبو' },
        'conditioner': { en: 'Conditioner', ar: 'بلسم' },
        'bodywash': { en: 'Body Wash', ar: 'غسول جسم' },
        
        // Personal Care
        'soap': { en: 'Soap', ar: 'صابون' },
        'deodorant': { en: 'Deodorant', ar: 'مزيل عرق' },
        'skincare': { en: 'Skincare', ar: 'العناية بالبشرة' },
        
        // Baby Products
        'diapers': { en: 'Diapers', ar: 'حفاضات' },
        'babyfood': { en: 'Baby Food', ar: 'طعام أطفال' },
        'babywipes': { en: 'Baby Wipes', ar: 'مناديل أطفال' },
        
        // Health & First Aid
        'thermometer': { en: 'Thermometers', ar: 'موازين حرارة' },
        'bandages': { en: 'Bandages', ar: 'ضمادات' },
        'antiseptic': { en: 'Antiseptics', ar: 'مطهرات' },
        
        // Special Products
        'wheelchairs': { en: 'Wheelchairs', ar: 'كراسي متحركة' },
        'walkers': { en: 'Walkers', ar: 'عكازات' },
        'prosthetics': { en: 'Prosthetics', ar: 'أطراف صناعية' },
        
        // Food & Sweeteners
        'vitamins': { en: 'Vitamins', ar: 'فيتامينات' },
        'supplements': { en: 'Supplements', ar: 'مكملات' },
        'sweeteners': { en: 'Sweeteners', ar: 'محليات' },
        
        // Medical Supplies
        'gloves': { en: 'Gloves', ar: 'قفازات' },
        'masks': { en: 'Masks', ar: 'أقنعة' },
        'gauze': { en: 'Gauze', ar: 'شاش' },
        'syringes': { en: 'Syringes', ar: 'محاقن' },
        'bandages': { en: 'Bandages', ar: 'لفافات طبية' },
        'cotton': { en: 'Medical Cotton', ar: 'قطن طبي' },
        
        // Medicines
        'painkillers': { en: 'Pain Killers', ar: 'مسكنات ألم' },
        'antiseptics': { en: 'Antiseptics', ar: 'مطهرات' },
        'ointments': { en: 'Ointments', ar: 'مراهم' },
        'antibiotics': { en: 'Antibiotics', ar: 'مضادات حيوية' },
        
        // Medical Equipment
        'thermometers': { en: 'Thermometers', ar: 'موازين الحرارة' },
        'bp_monitors': { en: 'Blood Pressure Monitors', ar: 'أجهزة ضغط الدم' },
        'stethoscopes': { en: 'Stethoscopes', ar: 'سماعات طبية' },
        'glucometers': { en: 'Glucometers', ar: 'أجهزة قياس السكر' },
        
        // First Aid
        'first_aid_kits': { en: 'First Aid Kits', ar: 'حقائب إسعافات أولية' },
        'bandage_rolls': { en: 'Bandage Rolls', ar: 'لفافات طبية' },
        'adhesive_tape': { en: 'Adhesive Tape', ar: 'شريط لاصق طبي' },
        'scissors': { en: 'Medical Scissors', ar: 'مقص طبي' }
    };
    
    const currentLang = window.languageManager.getCurrentLanguage();
    const tertiary = names[key];
    return tertiary ? tertiary[currentLang] || tertiary.ar : key;
}

// تحميل المنتجات
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    const clearSearch = document.getElementById('clearSearch');
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            filterProducts();
        });
    }
}

async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to load products');
        
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        // استخدام بيانات تجريبية إذا فشل التحميل
        allProducts = getDemoProducts();
        renderProducts(allProducts);
    }
}

function getDemoProducts() {
    return [
        {
            id: "P001",
            name: { en: "Smartphone X", ar: "هاتف ذكي X" },
            description: { en: "Latest smartphone with advanced features", ar: "أحدث هاتف ذكي بميزات متطورة" },
            price: "$299",
            image: "https://via.placeholder.com/200",
            primaryCategory: "electronics",
            category: "mobiles",
            tertiaryCategory: "smartphones"
        },
        {
            id: "P002", 
            name: { en: "Gaming Laptop", ar: "لابتوب ألعاب" },
            description: { en: "High performance gaming laptop", ar: "لابتوب ألعاب عالي الأداء" },
            price: "$899",
            image: "https://via.placeholder.com/200",
            primaryCategory: "electronics", 
            category: "laptops",
            tertiaryCategory: "gaming"
        },
        {
            id: "P003",
            name: { en: "Men's Shirt", ar: "قميص رجالي" },
            description: { en: "Cotton formal shirt", ar: "قميص قطني رسمي" },
            price: "$29",
            image: "https://via.placeholder.com/200", 
            primaryCategory: "clothing",
            category: "men",
            tertiaryCategory: "shirts"
        }
    ];
}

// دوال التصنيف المحسنة
function handlePrimaryClick(primary) {
    const primaryBar = document.getElementById('primaryBar');
    const secondaryBar = document.getElementById('secondaryBar');
    const tertiaryBar = document.getElementById('tertiaryBar');
    
    // Filter products by primary category
    const filtered = allProducts.filter(p => p.primaryCategory === primary);
    renderProducts(filtered);
    
    // Show secondary categories for this primary
    const categories = [...new Set(filtered.map(p => p.category))];
    if (categories.length > 0) {
        primaryBar.style.display = 'none';
        secondaryBar.style.display = 'block';
        
        const currentLang = window.languageManager.getCurrentLanguage();
        const backBtn = `<button class="category-btn back-btn" onclick="goBackToPrimary()">
            ← ${currentLang === 'ar' ? 'رجوع' : 'Back'}
        </button>`;
        
        const buttonsHtml = categories.map(cat => {
            return `<button class="category-btn secondary-btn" data-category="${cat}" onclick="handleSecondaryClick('${cat}', '${primary}')">${getCategoryName(cat)}</button>`;
        }).join('');
        
        secondaryBar.querySelector('.category-buttons').innerHTML = backBtn + buttonsHtml;
    } else {
        secondaryBar.style.display = 'none';
    }
    
    tertiaryBar.style.display = 'none';
}

function handleSecondaryClick(category, primary) {
    const secondaryBar = document.getElementById('secondaryBar');
    const tertiaryBar = document.getElementById('tertiaryBar');
    
    // Filter products by secondary category
    const filtered = allProducts.filter(p => p.primaryCategory === primary && p.category === category);
    renderProducts(filtered);
    
    // Show tertiary categories
    const tertiaries = [...new Set(filtered.map(p => p.tertiaryCategory))];
    if (tertiaries.length > 0) {
        secondaryBar.style.display = 'none';
        tertiaryBar.style.display = 'block';
        
        const currentLang = window.languageManager.getCurrentLanguage();
        const backBtn = `<button class="category-btn back-btn" onclick="goBackToSecondary('${primary}', '${category}')">
            ← ${currentLang === 'ar' ? 'رجوع' : 'Back'}
        </button>`;
        
        const buttonsHtml = tertiaries.map(tert => {
            return `<button class="category-btn tertiary-btn" data-tertiary="${tert}" onclick="handleTertiaryClick('${tert}', '${category}', '${primary}')">${getTertiaryName(tert)}</button>`;
        }).join('');
        
        tertiaryBar.querySelector('.category-buttons').innerHTML = backBtn + buttonsHtml;
    } else {
        tertiaryBar.style.display = 'none';
    }
}

function handleTertiaryClick(tertiary, category, primary) {
    const filtered = allProducts.filter(p => 
        p.primaryCategory === primary && 
        p.category === category && 
        p.tertiaryCategory === tertiary
    );
    renderProducts(filtered);
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const currentLang = window.languageManager.getCurrentLanguage();
    
    const filtered = allProducts.filter(product => {
        const name = product.name?.[currentLang]?.toLowerCase() || '';
        const description = product.description?.[currentLang]?.toLowerCase() || '';
        const id = product.id?.toLowerCase() || '';
        
        return name.includes(searchTerm) || 
               description.includes(searchTerm) || 
               id.includes(searchTerm);
    });
    
    renderProducts(filtered);
}

function renderProducts(products) {
    const container = document.getElementById('productsContainer');
    const currentLang = window.languageManager.getCurrentLanguage();
    
    if (products.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #718096;">
                <p>${currentLang === 'ar' ? 'لا توجد منتجات' : 'No products found'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => {
        const productName = product.name?.[currentLang] || product.name?.ar || 'No name';
        const productDesc = product.description?.[currentLang] || product.description?.ar || '';
        const productPrice = product.price || 'N/A';
        
        const whatsappMessage = currentLang === 'ar' 
            ? `مرحباً، أود طلب المنتج: ${productName} - السعر: ${productPrice}`
            : `Hello, I would like to order: ${productName} - Price: ${productPrice}`;
        const whatsappUrl = `https://wa.me/9647901737635?text=${encodeURIComponent(whatsappMessage)}`;
        
        return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image || 'https://via.placeholder.com/200'}" 
                     alt="${productName}"
                     onerror="this.src='https://via.placeholder.com/200'">
            </div>
            <div class="product-info">
                <h3 class="product-name">${productName}</h3>
                <p class="product-desc">${productDesc}</p>
                <div class="product-footer">
                    <span class="product-price">${productPrice}</span>
                    <a href="${whatsappUrl}" target="_blank" class="whatsapp-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        ${currentLang === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
                    </a>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// دوال التنقل للخلف
function goBackToPrimary() {
    const primaryBar = document.getElementById('primaryBar');
    const secondaryBar = document.getElementById('secondaryBar');
    const tertiaryBar = document.getElementById('tertiaryBar');
    
    primaryBar.style.display = 'block';
    secondaryBar.style.display = 'none';
    tertiaryBar.style.display = 'none';
    
    renderProducts(allProducts);
}

function goBackToSecondary(primary, category) {
    const secondaryBar = document.getElementById('secondaryBar');
    const tertiaryBar = document.getElementById('tertiaryBar');
    
    secondaryBar.style.display = 'block';
    tertiaryBar.style.display = 'none';
    
    const filtered = allProducts.filter(p => p.primaryCategory === primary && p.category === category);
    renderProducts(filtered);
}

// تأكد من تحميل نظام اللغة
if (typeof window.languageManager === 'undefined') {
    console.warn('Language manager not loaded, using fallback');
    window.languageManager = {
        getCurrentLanguage: () => localStorage.getItem('lang') || 'ar'
    };
}