const API_URL = "/api/products";

let products = [];
let editingProductId = null;

const CATEGORIES_DATA = {
  medical: {
    name: { en: "General materials", ar: "مواد عامة" },
    subcategories: [
      {
        key: "Oral",
        name: { en: "🦷 Oral Care", ar: "🦷 معاجين أسنان" },
        tertiary: [
          { key: "toothpaste", name: { en: "Toothpaste", ar: "معجون أسنان" } },
          { key: "toothbrush", name: { en: "Toothbrushes", ar: "فرش أسنان" } },
          { key: "mouthwash", name: { en: "Mouthwash", ar: "غسول فم" } },
          {
            key: "mouth fresheners",
            name: { en: "mouth fresheners", ar: "معطرات للفم " },
          },
          {
            key: "A tablet used for cleaning between the teeth.",
            name: {
              en: "A tablet used for cleaning between the teeth.",
              ar: "حب لتنظيف تخم الأسنان ",
            },
          },
        ],
      },
      {
        key: "Hair & Body Care",
        name: { en: "🧴 Hair & Body Care", ar: "🧴 العناية بالشعر والجسم" },
        tertiary: [
          { key: "shampoo", name: { en: "Shampoo", ar: "شامبو" } },
          {
            key: "Hair care ampoules",
            name: { en: "Hair care ampoules", ar: "	إبر عناية بالشعر" },
          },
          { key: "bodywash", name: { en: "Body Wash", ar: "غسول جسم" } },
          {
            key: "Hair remover",
            name: { en: " Hair remover", ar: "	مزيل شعر" },
          },
          { key: "Oils", name: { en: " Oils ", ar: "	زيوت " } },
        ],
      },
      {
        key: "Personal Care",
        name: { en: "🧼 Personal Care", ar: "🧼 العناية الشخصية" },
        tertiary: [
          { key: "soap", name: { en: "Soap", ar: "صابون" } },
          {
            key: "Feminine wash",
            name: { en: "Feminine wash", ar: " 	غسول مهبلي" },
          },
          {
            key: "Men's body wash",
            name: { en: "Men's body wash", ar: "	غسول رجالي " },
          },
          {
            key: "Skin creams",
            name: { en: "Skin creams", ar: "		كريمات بشرة  " },
          },
          { key: "Face scrub", name: { en: "Face scrub", ar: "		سكراب وجه  " } },
          { key: "Lip balm", name: { en: "Lip balm", ar: "		 	مرطب شفاه  " } },
          {
            key: "Sunscreens",
            name: { en: "Sunscreens", ar: "		 	واقيات شمس  " },
          },
          {
            key: "Heel treatment (softening and smoothing heels)",
            name: {
              en: "Heel treatment (softening and smoothing heels)",
              ar: "		 		كعب غزال (توريد وتنعيم الكعب)   ",
            },
          },
          { key: "Face mask", name: { en: "Face mask", ar: "		 	 	فيس ماسك  " } },
        ],
      },
      {
        key: "baby",
        name: { en: "👶 Baby Products", ar: "👶 منتجات الأطفال" },
        tertiary: [
          {
            key: "Baby powder",
            name: { en: "Baby powder", ar: "	بودرة أطفال" },
          },
          {
            key: "Baby feeding bottle",
            name: { en: "Baby feeding bottle", ar: "	رضاعة أطفال " },
          },
          {
            key: "Baby bottle nipples",
            name: { en: "Baby bottle nipples", ar: " 	حلمات رضاعة الأطفال" },
          },
          {
            key: "Teething pain relief gel",
            name: {
              en: "Teething pain relief gel",
              ar: " 		جل مسكن الألم لبلوغ الأسنان  ",
            },
          },
        ],
      },
      {
        key: "Health",
        name: { en: "🩺 Health & First Aid", ar: "🩺 الصحة والإسعافات" },
        tertiary: [
          { key: "Gloves", name: { en: "Gloves", ar: " 	قفازات" } },
          {
            key: "First aid kits",
            name: { en: "First aid kits", ar: "	حقائب إسعافات أولية" },
          },
          {
            key: "Dettol disinfectant",
            name: { en: "Dettol disinfectant", ar: "	ديتول" },
          },
          { key: "Alcohol", name: { en: "Alcohol", ar: "	كحول" } },
          {
            key: "Povidone-iodine",
            name: { en: "Povidone-iodine", ar: "بوفيدين" },
          },
          {
            key: "Hand sanitizer",
            name: { en: "Hand sanitizer", ar: "	معقم يدين" },
          },
          {
            key: "Effervescent tablets",
            name: { en: "Effervescent tablets", ar: "	فوار" },
          },
        ],
      },
      {
        key: "Specialv",
        name: { en: "Special Products", ar: "منتجات خاصة" },
        tertiary: [
          { key: "Lubricant", name: { en: "Lubricant", ar: "	مزلق " } },
          { key: "Condom", name: { en: "Condom", ar: " واقي ذكري " } },
        ],
      },
      {
        key: "Food",
        name: { en: "Food & Sweeteners", ar: "أغذية ومحليات" },
        tertiary: [
          { key: "Sweetener", name: { en: "Sweetener", ar: "	محلي " } },
        ],
      },
    ],
  },
  consumables: {
    name: { en: "Medical supplies", ar: "مستلزمات طبية" },
    subcategories: [
      {
        key: "Flamingo company",
        name: { en: " Flamingo company", ar: " 🏪شركة Flamingo" },
        tertiary: [
          {
            key: "Flamingo products",
            name: { en: "Flamingo products", ar: "منتجات Flamingo " },
          },
        ],
      },
      {
        key: "Medi System company",
        name: { en: " Medi System company", ar: "🏪شركة Medi System" },
        tertiary: [
          {
            key: "Medi System products",
            name: { en: "Medi System products", ar: "Medi System منتجات  " },
          },
        ],
      },
      {
        key: "Headphones",
        name: { en: " Headphones", ar: "🎧  السماعات " },
        tertiary: [
          {
            key: "Hearing aids",
            name: { en: "Hearing aids", ar: "	سماعات طبية " },
          },
          { key: "Earphones", name: { en: "Earphones", ar: " 	سماعات أذن" } },
        ],
      },
      {
        key: "Nebulizer devices",
        name: { en: "Nebulizer devices", ar: "🌬️ أجهزة الاستنشاق " },
        tertiary: [
          {
            key: "ALL Products",
            name: { en: "ALL Products", ar: "جميع المنتجات" },
          },
        ],
      },
      {
        key: "Batteries",
        name: { en: "Batteries", ar: "🔋 بطاريات " },
        tertiary: [
          {
            key: "Regular batteries",
            name: { en: "Regular batteries", ar: "بطاريات عادية" },
          },
          {
            key: "Blood sugar device batteries",
            name: {
              en: "Blood sugar device batteries",
              ar: "	بطاريات أجهزة سكر ",
            },
          },
          {
            key: "Hearing aid batteries",
            name: { en: "Hearing aid batteries", ar: "	بطاريات سماعة أذن" },
          },
        ],
      },
      {
        key: "Braces and supports",
        name: { en: "Braces and supports", ar: "🩹 الأحزمة والمشدات" },
        tertiary: [
          {
            key: "ALL Products",
            name: { en: "ALL Products", ar: "جميع المنتجات " },
          },
        ],
      },
      {
        key: "Physiotherapy and pain relief",
        name: {
          en: "Physiotherapy and pain relief",
          ar: "💆‍♂️ العلاج الطبيعي والتسكين",
        },
        tertiary: [
          { key: "Stress ball", name: { en: "Stress ball", ar: "	كرة أعصاب " } },
          {
            key: "Sports ice packs",
            name: { en: "Sports ice packs", ar: "ثلج رياضيين" },
          },
          {
            key: "Pain relief spray",
            name: { en: "Pain relief spray", ar: "	بخاخ مسكن الآلام " },
          },
        ],
      },
      {
        key: "Braces and supports",
        name: { en: "Braces and supports", ar: "🩹 الأحزمة والمشدات" },
        tertiary: [
          {
            key: "ALL Products",
            name: { en: "ALL Products", ar: "جميع المنتجات " },
          },
        ],
      },
      {
        key: "Physiotherapy and pain relief",
        name: {
          en: "Physiotherapy and pain relief",
          ar: "💆‍♂️ العلاج الطبيعي والتسكين",
        },
        tertiary: [
          {
            key: "Stress ball",
            name: { en: "Stress ball", ar: "	كرة أعصاب  " },
          },
          {
            key: "Sports ice packs",
            name: { en: "Sports ice packs", ar: "ثلج رياضيين   " },
          },
          {
            key: "Pain relief spray",
            name: { en: "Pain relief spray", ar: "	بخاخ مسكن الآلام  " },
          },
        ],
      },
      {
        key: "Testing and care supplies",
        name: {
          en: "Testing and care supplies",
          ar: "🧪 مستلزمات الفحص والعناية ",
        },
        tertiary: [
          {
            key: "Pregnancy test strip",
            name: { en: "Pregnancy test strip", ar: " 	شريط حمل " },
          },
          {
            key: "Pregnancy test pen",
            name: { en: "Pregnancy test pen", ar: "	قلم حمل " },
          },
          {
            key: "Daily pill organizer",
            name: { en: "Daily pill organizer", ar: "حافظة كبسول يومية" },
          },
          {
            key: "Baby urine collector",
            name: { en: "Baby urine collector", ar: "	لباس إدرار أطفال" },
          },
          {
            key: "Adult urine bag",
            name: { en: "Adult urine bag", ar: "	كيس إدرار كبار" },
          },
          {
            key: "Circumcision garment",
            name: { en: "Circumcision garment", ar: "لباس طهور" },
          },
        ],
      },
      {
        key: "Blood sugar monitoring devices",
        name: {
          en: "Blood sugar monitoring devices",
          ar: "🩸 أجهزة قياس السكر",
        },
        tertiary: [
          { key: "Devices", name: { en: "Devices", ar: " 	أجهزة" } },
          { key: "Test strips", name: { en: "Test strips", ar: "	أشرطة" } },
          { key: "Lancets", name: { en: "Lancets", ar: "واغز" } },
          { key: "Pen", name: { en: "Pen", ar: "قلم" } },
        ],
      },
      {
        key: " Blood pressure monitors",
        name: { en: " Blood pressure monitors", ar: "⏱️ أجهزة قياس الضغط" },
        tertiary: [
          { key: "Devices", name: { en: "Devices", ar: " 	أجهزة" } },
          {
            key: "Pressure cuff",
            name: { en: "Pressure cuff", ar: "	كف جهاز ضغط" },
          },
        ],
      },
      {
        key: " Blood pressure monitors",
        name: { en: " Blood pressure monitors", ar: "⏱️ أجهزة قياس الضغط" },
        tertiary: [
          { key: "Devices", name: { en: "Devices", ar: " 	أجهزة" } },
          {
            key: "Pressure cuff",
            name: { en: "Pressure cuff", ar: "	كف جهاز ضغط" },
          },
        ],
      },
      {
        key: "  Medical patches",
        name: { en: "  Medical patches", ar: "🩼 لصقات طبية" },
        tertiary: [
          {
            key: "Surgical patch",
            name: { en: "Surgical patch", ar: " 	لصقة عمليات" },
          },
          {
            key: "Eye patch (adult)",
            name: { en: "Eye patch (adult)", ar: "	لصقة عيون كبار" },
          },
          {
            key: "Eye patch (child)",
            name: { en: "Eye patch (child)", ar: "	لصقة عيون صغار" },
          },
          {
            key: "Cannula patch",
            name: { en: "Cannula patch", ar: "	لصقة كانولة" },
          },
          {
            key: "Cooling fever patch",
            name: { en: "Cooling fever patch", ar: "	لصقة خافضة حرارة" },
          },
        ],
      },
      {
        key: " Plasters",
        name: { en: "  Plasters", ar: "🩹 بلاستر" },
        tertiary: [
          { key: "Regular", name: { en: "Regular", ar: " عادي" } },
          { key: "Transparent", name: { en: "Transparent", ar: "	شفاف" } },
          { key: "Paper", name: { en: "Paper", ar: "ورقي" } },
        ],
      },
      {
        key: "  Medical bandages and wraps",
        name: {
          en: " Medical bandages and wraps",
          ar: "🧻 ضمادات ولفافات طبية",
        },
        tertiary: [
          { key: "Cotton", name: { en: "Cotton", ar: " 	قطن" } },
          {
            key: "Gauze squares",
            name: { en: "Gauze squares", ar: "	شاش مربعات" },
          },
          {
            key: "Sterile gauze",
            name: { en: "Sterile gauze", ar: "شاش معقم" },
          },
          {
            key: "Elastic wrap",
            name: { en: "Elastic wrap", ar: "	لفاف مطاط " },
          },
          { key: "Bandage", name: { en: "Bandage", ar: "	باندج  " } },
        ],
      },
      {
        key: " Medical consumables",
        name: { en: "  Medical consumables", ar: "🧴 مستهلكات طبية" },
        tertiary: [
          { key: "Tourniquet", name: { en: "Tourniquet", ar: " تورنيكا" } },
          {
            key: "Tongue depressor",
            name: { en: "Tongue depressor", ar: "خافضة لسان" },
          },
          { key: "IV set", name: { en: "IV set", ar: "جهاز إعطاء" } },
          {
            key: "Umbilical cord clamp",
            name: { en: "Umbilical cord clamp", ar: "قراصة سُرّة" },
          },
          { key: "Medical gown", name: { en: "Medical gown", ar: "كاون طبي" } },
        ],
      },
      {
        key: " Medical equipment",
        name: { en: "  Medical equipment", ar: "⚙️ معدات طبية" },
        tertiary: [
          {
            key: "Massage device",
            name: { en: "Massage device", ar: " جهاز تدليك" },
          },
          {
            key: "Anti-bedsore mattress",
            name: { en: "Anti-bedsore mattress", ar: "فراش تقرحات" },
          },
          {
            key: "Surgical cap",
            name: { en: "Surgical cap", ar: " كابسة عمليات" },
          },
          {
            key: "Circumcision device",
            name: { en: "Circumcision device", ar: " جهاز ختان" },
          },
          { key: "Spirometer", name: { en: "Spirometer", ar: " سبايروميتر" } },
          { key: "Oximeter", name: { en: " Oximeter", ar: " أوكسميتر" } },
          { key: " Scale", name: { en: "Scale", ar: " ميزان" } },
          {
            key: "Precision scale",
            name: { en: "Precision scale", ar: " ميزان حساس" },
          },
          { key: "Thermometer", name: { en: "Thermometer", ar: " محرا" } },
        ],
      },
    ],
  },
};

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupEventListeners();
});

function setupEventListeners() {
  document
    .getElementById("addProductBtn")
    .addEventListener("click", openAddModal);
  document
    .getElementById("productForm")
    .addEventListener("submit", handleFormSubmit);
  document
    .getElementById("searchInput")
    .addEventListener("input", filterProducts);
  document
    .getElementById("categoryFilter")
    .addEventListener("change", filterProducts);

  document
    .getElementById("primaryCategory")
    .addEventListener("change", onPrimaryCategoryChange);
  document
    .getElementById("secondaryCategory")
    .addEventListener("change", onSecondaryCategoryChange);
  document
    .getElementById("productImage")
    .addEventListener("change", handleImageSelect);
  // ✅ تسجيل الخروج
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear(); // مسح بيانات تسجيل الدخول
      window.location.href = "/login.html"; // إعادة التوجيه لصفحة تسجيل الدخول
    });
  }
}

function handleImageSelect(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.getElementById("imagePreview").style.display = "block";
      document.getElementById("previewImg").src = event.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    document.getElementById("imagePreview").style.display = "none";
  }
}

function onPrimaryCategoryChange(e) {
  const primaryValue = e.target.value;
  const secondarySelect = document.getElementById("secondaryCategory");
  const tertiarySelect = document.getElementById("tertiaryCategory");

  if (!primaryValue) {
    secondarySelect.disabled = true;
    secondarySelect.innerHTML =
      '<option value="">اختر الفئة الرئيسية أولاً</option>';
    tertiarySelect.disabled = true;
    tertiarySelect.innerHTML =
      '<option value="">اختر الفئة الفرعية أولاً</option>';
    return;
  }

  const subcategories = CATEGORIES_DATA[primaryValue].subcategories;
  secondarySelect.disabled = false;
  secondarySelect.innerHTML =
    '<option value="">اختر الفئة الفرعية</option>' +
    subcategories
      .map((sub) => `<option value="${sub.key}">${sub.name.ar}</option>`)
      .join("");

  tertiarySelect.disabled = true;
  tertiarySelect.innerHTML =
    '<option value="">اختر الفئة الفرعية أولاً</option>';
}

function onSecondaryCategoryChange(e) {
  const primaryValue = document.getElementById("primaryCategory").value;
  const secondaryValue = e.target.value;
  const tertiarySelect = document.getElementById("tertiaryCategory");

  if (!secondaryValue || !primaryValue) {
    tertiarySelect.disabled = true;
    tertiarySelect.innerHTML =
      '<option value="">اختر الفئة الفرعية أولاً</option>';
    return;
  }

  const subcategory = CATEGORIES_DATA[primaryValue].subcategories.find(
    (sub) => sub.key === secondaryValue
  );
  if (subcategory && subcategory.tertiary) {
    tertiarySelect.disabled = false;
    tertiarySelect.innerHTML =
      '<option value="">اختر الفئة التفصيلية</option>' +
      subcategory.tertiary
        .map((tert) => `<option value="${tert.key}">${tert.name.ar}</option>`)
        .join("");
  }
}

async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("فشل في تحميل المنتجات");

    products = await response.json();
    renderProducts(products);
    updateStats();
    populateCategoryFilter();
    showNotification("تم تحميل المنتجات بنجاح", "success");
  } catch (error) {
    console.error("Error:", error);
    showNotification("حدث خطأ في تحميل المنتجات: " + error.message, "error");
    renderEmptyState();
  }
}

function getCategoryName(categoryKey, primaryKey) {
  if (!primaryKey || !categoryKey) return categoryKey || "غير محدد";

  const primary = CATEGORIES_DATA[primaryKey];
  if (!primary) return categoryKey;

  const secondary = primary.subcategories.find(
    (sub) => sub.key === categoryKey
  );
  return secondary ? secondary.name.ar : categoryKey;
}

function getTertiaryName(tertiaryKey, categoryKey, primaryKey) {
  if (!primaryKey || !categoryKey || !tertiaryKey)
    return tertiaryKey || "غير محدد";

  const primary = CATEGORIES_DATA[primaryKey];
  if (!primary) return tertiaryKey;

  const secondary = primary.subcategories.find(
    (sub) => sub.key === categoryKey
  );
  if (!secondary) return tertiaryKey;

  const tertiary = secondary.tertiary.find((tert) => tert.key === tertiaryKey);
  return tertiary ? tertiary.name.ar : tertiaryKey;
}

function renderProducts(productsToRender) {
  const tbody = document.getElementById("productsTableBody");

  if (productsToRender.length === 0) {
    renderEmptyState();
    return;
  }

  tbody.innerHTML = productsToRender
    .map(
      (product) => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${
        product.name?.ar || "منتج"
      }" class="product-img" onerror="this.src='https://via.placeholder.com/60'"></td>
            <td>
                <div class="product-name">${
                  product.name?.ar || "غير متوفر"
                }</div>
                <div class="product-name" style="font-size: 0.85rem; color: #718096;">${
                  product.name?.en || "N/A"
                }</div>
            </td>
            <td>
                <div class="product-desc">${
                  product.description?.ar || "لا يوجد وصف"
                }</div>
            </td>
            <td class="product-price">${product.price}</td>
            <td><span class="product-category">${
              CATEGORIES_DATA[product.primaryCategory]?.name.ar ||
              product.primaryCategory ||
              "غير محدد"
            }</span></td>
            <td><span class="product-category">${getCategoryName(
              product.category,
              product.primaryCategory
            )}</span></td>
            <td><span class="product-category">${getTertiaryName(
              product.tertiaryCategory,
              product.category,
              product.primaryCategory
            )}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="editProduct('${
                      product.id
                    }')">
                        <span class="btn-icon">✏️</span>
                        تعديل
                    </button>
                    <button class="btn btn-danger" onclick="deleteProduct('${
                      product.id
                    }')">
                        <span class="btn-icon">🗑️</span>
                        حذف
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

function renderEmptyState() {
  const tbody = document.getElementById("productsTableBody");
  tbody.innerHTML = `
        <tr>
            <td colspan="9" class="no-products">
                <p>📦 لا توجد منتجات حالياً</p>
                <button class="btn btn-primary" onclick="openAddModal()">
                    <span class="btn-icon">➕</span>
                    إضافة منتج جديد
                </button>
            </td>
        </tr>
    `;
}

function updateStats() {
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.price).length;
  const categories = new Set(products.map((p) => p.category)).size;

  document.getElementById("totalProducts").textContent = totalProducts;
  document.getElementById("activeProducts").textContent = activeProducts;
  document.getElementById("categories").textContent = categories;
}

function populateCategoryFilter() {
  const availableCategories = [];

  Object.keys(CATEGORIES_DATA).forEach((primaryKey) => {
    CATEGORIES_DATA[primaryKey].subcategories.forEach((sub) => {
      availableCategories.push({ value: sub.key, label: sub.name.ar });
    });
  });

  const select = document.getElementById("categoryFilter");

  select.innerHTML =
    '<option value="">جميع الفئات</option>' +
    availableCategories
      .map((cat) => `<option value="${cat.value}">${cat.label}</option>`)
      .join("");
}

function filterProducts() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;

  const filtered = products.filter((product) => {
    const matchesSearch =
      String(product.id ?? "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(product.name?.ar ?? "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(product.name?.en ?? "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(product.description?.ar ?? "")
        .toLowerCase()
        .includes(searchTerm);

    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}

function openAddModal() {
  editingProductId = null;
  document.getElementById("modalTitle").textContent = "إضافة منتج جديد";
  document.getElementById("productForm").reset();

  document.getElementById("secondaryCategory").disabled = true;
  document.getElementById("tertiaryCategory").disabled = true;
  document.getElementById("secondaryCategory").innerHTML =
    '<option value="">اختر الفئة الرئيسية أولاً</option>';
  document.getElementById("tertiaryCategory").innerHTML =
    '<option value="">اختر الفئة الفرعية أولاً</option>';

  document.getElementById("imagePreview").style.display = "none";
  document.getElementById("currentImagePath").value = "";

  document.getElementById("productModal").classList.add("active");
}

function editProduct(productId) {
  const product = products.find((p) => String(p.id) === String(productId));
  if (!product) {
    showNotification("المنتج غير موجود", "error");
    return;
  }

  editingProductId = productId;
  document.getElementById("modalTitle").textContent = "تعديل المنتج";

  document.getElementById("productId").value = product.id;
  document.getElementById("productNameAr").value = product.name?.ar || "";
  document.getElementById("productNameEn").value = product.name?.en || "";
  document.getElementById("productDescAr").value =
    product.description?.ar || "";
  document.getElementById("productDescEn").value =
    product.description?.en || "";
  document.getElementById("productPrice").value = product.price || "";

  // Handle current image
  document.getElementById("currentImagePath").value = product.image || "";
  if (product.image) {
    document.getElementById("imagePreview").style.display = "block";
    document.getElementById("previewImg").src = product.image;
  } else {
    document.getElementById("imagePreview").style.display = "none";
  }

  if (product.primaryCategory) {
    document.getElementById("primaryCategory").value = product.primaryCategory;
    onPrimaryCategoryChange({ target: { value: product.primaryCategory } });

    setTimeout(() => {
      if (product.category) {
        document.getElementById("secondaryCategory").value = product.category;
        onSecondaryCategoryChange({ target: { value: product.category } });

        setTimeout(() => {
          if (product.tertiaryCategory) {
            document.getElementById("tertiaryCategory").value =
              product.tertiaryCategory;
          }
        }, 50);
      }
    }, 50);
  }

  document.getElementById("productModal").classList.add("active");
}

async function deleteProduct(productId) {
  if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("فشل في حذف المنتج");

    products = products.filter((p) => String(p.id) !== String(productId));
    renderProducts(products);
    updateStats();
    populateCategoryFilter();
    showNotification("تم حذف المنتج بنجاح", "success");
  } catch (error) {
    console.error("Error:", error);
    showNotification("حدث خطأ في حذف المنتج: " + error.message, "error");
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const productData = {
    id: document.getElementById("productId").value,
    primaryCategory: document.getElementById("primaryCategory").value,
    category: document.getElementById("secondaryCategory").value,
    tertiaryCategory: document.getElementById("tertiaryCategory").value,
    name: {
      ar: document.getElementById("productNameAr").value,
      en: document.getElementById("productNameEn").value,
    },
    description: {
      ar: document.getElementById("productDescAr").value,
      en: document.getElementById("productDescEn").value,
    },
    price: document.getElementById("productPrice").value,
    image: document.getElementById("currentImagePath").value || "",
  };

  // Get image data if a new image was selected
  const imageFile = document.getElementById("productImage").files[0];
  let imageData = null;

  if (imageFile) {
    imageData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(imageFile);
    });
  }

  const requestData = {
    product: productData,
    imageData: imageData,
  };

  try {
    let response;
    if (editingProductId) {
      response = await fetch(`${API_URL}/${editingProductId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("فشل في تحديث المنتج");

      const updatedProduct = await response.json();
      const index = products.findIndex(
        (p) => String(p.id) === String(editingProductId)
      );
      products[index] = updatedProduct;
      showNotification("تم تحديث المنتج بنجاح", "success");
    } else {
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("فشل في إضافة المنتج");

      const newProduct = await response.json();
      products.push(newProduct);
      showNotification("تم إضافة المنتج بنجاح", "success");
    }

    renderProducts(products);
    updateStats();
    populateCategoryFilter();
    closeModal();
  } catch (error) {
    console.error("Error:", error);
    showNotification("حدث خطأ في حفظ المنتج: " + error.message, "error");
  }
}

function closeModal() {
  document.getElementById("productModal").classList.remove("active");
  document.getElementById("productForm").reset();
  document.getElementById("imagePreview").style.display = "none";
  document.getElementById("currentImagePath").value = "";
  editingProductId = null;
}

function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `notification ${type} show`;

  setTimeout(() => {
    notification.classList.remove("show");
  }, 4000);
}
