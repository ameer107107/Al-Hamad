function renderProducts(products) {
  const container = document.getElementById("productsContainer");
  container.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    const whatsappNumber = "9647712345678"; // رقمك بدون + أو 0
    const message = encodeURIComponent(
      `مرحباً 👋\nأود طلب المنتج التالي:\n📦 الاسم: ${product.name}\n💰 السعر: ${product.price}\n🖼️ صورة: ${product.image}`
    );
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${product.price}</p>

      <a href="${whatsappLink}" target="_blank" class="whatsapp-btn"
         style="
           display:inline-block;
           background:#25D366;
           color:#fff;
           padding:8px 12px;
           border-radius:8px;
           text-decoration:none;
           font-weight:600;
           margin-top:6px;
         ">
         اطلب عبر واتساب
      </a>
    `;

    container.appendChild(card);
  });
}
