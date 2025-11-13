// language-manager.js - ملف مستقل للترجمة يعمل بشكل مثالي

class LanguageManager {
    constructor() {
        this.currentLang = this.getSavedLanguage();
        this.init();
    }

    // 🔥 تحديد اللغة المحفوظة أو البدء بالعربية
    getSavedLanguage() {
        const savedLang = localStorage.getItem("lang");
        // إذا لم تكن محفوظة أو كانت عربية، نرجع العربية
        if (!savedLang || savedLang === "ar") {
            return "ar";
        }
        return savedLang;
    }

    // 🔥 التهيئة الفورية للغة
    init() {
        this.applyLanguageImmediately();
        this.setupEventListeners();
        this.ensureArabicOnFirstLoad();
        
        // تحديث بعد تحميل DOM
        document.addEventListener('DOMContentLoaded', () => {
            this.updatePageContent();
            this.updateLanguageButton();
        });
    }

    // 🔥 تطبيق اللغة فوراً قبل تحميل الصفحة
    applyLanguageImmediately() {
        const html = document.documentElement;
        
        if (this.currentLang === "ar") {
            html.setAttribute("lang", "ar");
            html.setAttribute("dir", "rtl");
        } else {
            html.setAttribute("lang", "en");
            html.setAttribute("dir", "ltr");
        }
        
        console.log('🌍 Language applied immediately:', this.currentLang);
    }

    // 🔥 التأكد من البدء بالعربية في أول زيارة
    ensureArabicOnFirstLoad() {
        // إذا لم تكن اللغة محفوظة، نحفظ العربية
        if (!localStorage.getItem("lang")) {
            localStorage.setItem("lang", "ar");
            this.currentLang = "ar";
        }
    }

    // 🔥 تبديل اللغة
    toggleLanguage() {
        this.currentLang = this.currentLang === "ar" ? "en" : "ar";
        localStorage.setItem("lang", this.currentLang);
        
        console.log('🔄 Language toggled to:', this.currentLang);
        
        // تطبيق التغييرات فوراً
        this.applyLanguageImmediately();
        this.updatePageContent();
        this.updateLanguageButton();
        
        // إعادة تحميل الصفحة لتطبيق التغييرات على جميع العناصر
        setTimeout(() => {
            window.location.reload();
        }, 400);
    }

    // 🔥 تحديث محتوى الصفحة
    updatePageContent() {
        this.updateTextContent();
        this.updateFormContent();
        this.updateDynamicContent();
    }

    // 🔥 تحديث النصوص الثابتة
    updateTextContent() {
        const elements = document.querySelectorAll('[data-en][data-ar]');
        elements.forEach(element => {
            if (this.currentLang === 'ar') {
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
    }

    // 🔥 تحديث حقول النماذج
    updateFormContent() {
        // تحديث مكان البحث
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.placeholder = this.currentLang === 'ar' 
                ? 'البحث عن المنتجات...' 
                : 'Search products...';
        }

        // تحديث عناصر الإدخال الأخرى
        document.querySelectorAll('input[data-en][data-ar]').forEach(input => {
            input.placeholder = this.currentLang === 'ar' 
                ? input.getAttribute('data-ar') 
                : input.getAttribute('data-en');
        });

        document.querySelectorAll('textarea[data-en][data-ar]').forEach(textarea => {
            textarea.placeholder = this.currentLang === 'ar' 
                ? textarea.getAttribute('data-ar') 
                : textarea.getAttribute('data-en');
        });
    }

    // 🔥 تحديث المحتوى الديناميكي
    updateDynamicContent() {
        // إذا كانت هناك دوال خاصة بالمنتجات، نستدعيها
        if (typeof displayBestSellers === 'function') {
            try {
                displayBestSellers();
            } catch (e) {
                console.log('⚠️ Could not update best sellers:', e);
            }
        }

        if (typeof displayProducts === 'function') {
            try {
                setTimeout(() => displayProducts(), 100);
            } catch (e) {
                console.log('⚠️ Could not update products:', e);
            }
        }

        // تحديث أشرطة التصنيف إذا كانت موجودة
        this.updateClassificationBars();
    }

    // 🔥 تحديث أشرطة التصنيف
    updateClassificationBars() {
        const primaryBar = document.getElementById('primaryBar');
        if (!primaryBar) return;

        // تحديث أزرار التصنيف الأساسي
        document.querySelectorAll('.primary-btn').forEach(btn => {
            const text = this.currentLang === 'ar' 
                ? btn.getAttribute('data-ar') 
                : btn.getAttribute('data-en');
            if (text) btn.textContent = text;
        });

        // تحديث أزرار التصنيف الثانوي إذا كانت مرئية
        const secondaryBar = document.getElementById('secondaryBar');
        if (secondaryBar && secondaryBar.style.display !== 'none') {
            document.querySelectorAll('.secondary-btn').forEach(btn => {
                const text = this.currentLang === 'ar' 
                    ? btn.getAttribute('data-ar') 
                    : btn.getAttribute('data-en');
                if (text) btn.textContent = text;
            });
        }

        // تحديث أزرار التصنيف الثالثي إذا كانت مرئية
        const tertiaryBar = document.getElementById('tertiaryBar');
        if (tertiaryBar && tertiaryBar.style.display !== 'none') {
            document.querySelectorAll('.tertiary-btn').forEach(btn => {
                const text = this.currentLang === 'ar' 
                    ? btn.getAttribute('data-ar') 
                    : btn.getAttribute('data-en');
                if (text) btn.textContent = text;
            });
        }
    }

    // 🔥 تحديث زر اللغة
    updateLanguageButton() {
        const langBtn = document.getElementById('langBtn');
        if (langBtn) {
            if (this.currentLang === 'ar') {
                langBtn.innerHTML = '<span class="language-icon">EN</span>';
                langBtn.title = 'Switch to English';
                langBtn.setAttribute('data-en', 'English');
                langBtn.setAttribute('data-ar', 'الإنجليزية');
            } else {
                langBtn.innerHTML = '<span class="language-icon">AR</span>';
                langBtn.title = 'التحويل إلى العربية';
                langBtn.setAttribute('data-en', 'Arabic');
                langBtn.setAttribute('data-ar', 'العربية');
            }
        }
    }

    // 🔥 إعداد مستمعي الأحداث
    setupEventListeners() {
        // مستمع للزر الرئيسي
        document.addEventListener('click', (e) => {
            if (e.target.closest('#langBtn')) {
                e.preventDefault();
                this.toggleLanguage();
            }
        });

        // مستمع لأزرار اللغة الإضافية
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-lang-toggle]')) {
                e.preventDefault();
                this.toggleLanguage();
            }
        });

        // تحديث الروابط بإضافة معلمة اللغة
        this.updateLinksWithLanguage();
    }

    // 🔥 تحديث الروابط بإضافة معلمة اللغة
    updateLinksWithLanguage() {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                document.querySelectorAll('a[href]').forEach(link => {
                    try {
                        const url = new URL(link.href, window.location.origin);
                        if (url.origin === window.location.origin && !url.searchParams.has('lang')) {
                            url.searchParams.set('lang', this.currentLang);
                            link.href = url.toString();
                        }
                    } catch (e) {
                        // تجاهل الروابط غير الصالحة
                    }
                });
            }, 100);
        });
    }

    // 🔥 الحصول على اللغة الحالية
    getCurrentLanguage() {
        return this.currentLang;
    }

    // 🔥 تعيين لغة محددة
    setLanguage(lang) {
        if (lang === 'ar' || lang === 'en') {
            this.currentLang = lang;
            localStorage.setItem("lang", lang);
            this.applyLanguageImmediately();
            this.updatePageContent();
            this.updateLanguageButton();
            
            setTimeout(() => {
                window.location.reload();
            }, 400);
        }
    }

    // 🔥 التحقق من حالة اللغة
    checkLanguageState() {
        return {
            current: this.currentLang,
            saved: localStorage.getItem("lang"),
            htmlLang: document.documentElement.getAttribute("lang"),
            htmlDir: document.documentElement.getAttribute("dir"),
            isRTL: this.currentLang === "ar"
        };
    }
}

// 🔥 إنشاء نسخة عالمية من المدير
window.languageManager = new LanguageManager();

// 🔥 تعريف الدوال العالمية للتوافق مع الكود القديم
window.toggleLanguage = function() {
    window.languageManager.toggleLanguage();
};

window.getCurrentLanguage = function() {
    return window.languageManager.getCurrentLanguage();
};

// 🔥 تصدير المدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}

console.log('✅ Language Manager initialized successfully!');
console.log('🌍 Current language:', window.languageManager.getCurrentLanguage());