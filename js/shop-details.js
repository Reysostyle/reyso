/* =====================================================
   REYSO — SHOP DETAILS PAGE
   Reads ?id= from the URL, looks the product up in
   PRODUCTS (products.js), and renders gallery, price,
   size/color pickers, quantity and add-to-cart.
===================================================== */

function initShopDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const product = id ? getProductById(id) : null;

    const section = document.querySelector(".pd-section");
    if (!product) {
        if (section) {
            section.innerHTML =
                '<div class="container"><p style="padding:40px 0;">این محصول پیدا نشد. <a href="index.html" style="color:var(--gold);text-decoration:underline;">بازگشت به صفحه اصلی</a></p></div>';
        }
        return;
    }

    let selectedSize = product.sizes[0];
    let selectedColor = product.colors[0];
    let qty = 1;

    const crumbCurrent = document.querySelector(".pd-crumb-current");
    const mainImage = document.getElementById("pd-main-image");
    const thumbsWrap = document.getElementById("pd-thumbs");
    const starsEl = document.getElementById("pd-stars");
    const reviewsEl = document.getElementById("pd-reviews");
    const nameEl = document.getElementById("pd-name");
    const descEl = document.getElementById("pd-desc");
    const priceNowEl = document.getElementById("pd-price-now");
    const priceOldEl = document.getElementById("pd-price-old");
    const discountBadge = document.getElementById("pd-discount-badge");
    const sizesWrap = document.getElementById("pd-sizes");
    const colorsWrap = document.getElementById("pd-colors");
    const qtyValue = document.getElementById("pd-qty-value");
    const addBtn = document.getElementById("pd-add-btn");
    const addNote = document.getElementById("pd-add-note");
    const wishBtn = document.getElementById("pd-wish-btn");

    document.title = "ReySo | " + product.name;
    if (crumbCurrent) crumbCurrent.textContent = product.name;
    if (nameEl) nameEl.textContent = product.name;
    if (descEl) descEl.textContent = product.description;

    if (starsEl) {
        const full = "★".repeat(product.rating);
        const empty = "☆".repeat(5 - product.rating);
        starsEl.textContent = full + empty;
    }
    if (reviewsEl) reviewsEl.textContent = "(" + product.reviews.toLocaleString("fa-IR") + " نظر)";

    if (priceNowEl) priceNowEl.textContent = formatToman(product.price);
    if (product.oldPrice) {
        priceOldEl.textContent = formatToman(product.oldPrice);
        priceOldEl.hidden = false;
        const percent = Math.round((1 - product.price / product.oldPrice) * 100);
        discountBadge.textContent = percent.toLocaleString("fa-IR") + "٪ تخفیف";
        discountBadge.hidden = false;
    } else if (priceOldEl) {
        priceOldEl.hidden = true;
    }

    function setMainImage(src) {
        mainImage.src = src;
        mainImage.alt = product.name;
        document.querySelectorAll(".pd-thumbs button").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.src === src);
        });
    }

    function renderThumbs() {
        thumbsWrap.innerHTML = "";
        product.images.forEach((src) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.dataset.src = src;
            btn.innerHTML = '<img src="' + src + '" alt="">';
            btn.addEventListener("click", () => setMainImage(src));
            thumbsWrap.appendChild(btn);
        });
    }

    function renderSizes() {
        sizesWrap.innerHTML = "";
        product.sizes.forEach((size) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "pd-size-btn" + (size === selectedSize ? " active" : "");
            btn.textContent = size;
            btn.addEventListener("click", () => {
                selectedSize = size;
                sizesWrap.querySelectorAll(".pd-size-btn").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
            });
            sizesWrap.appendChild(btn);
        });
    }

    function renderColors() {
        colorsWrap.innerHTML = "";
        product.colors.forEach((color) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "pd-color-btn" + (color.name === selectedColor.name ? " active" : "");
            btn.innerHTML = '<span class="dot" style="background:' + color.hex + '"></span> ' + color.name;
            btn.addEventListener("click", () => {
                selectedColor = color;
                colorsWrap.querySelectorAll(".pd-color-btn").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                setMainImage(color.image);
            });
            colorsWrap.appendChild(btn);
        });
    }

    renderThumbs();
    renderSizes();
    renderColors();
    setMainImage(selectedColor.image);

    document.getElementById("pd-qty-minus").addEventListener("click", () => {
        if (qty > 1) qty -= 1;
        qtyValue.textContent = qty.toLocaleString("fa-IR");
    });

    document.getElementById("pd-qty-plus").addEventListener("click", () => {
        qty += 1;
        qtyValue.textContent = qty.toLocaleString("fa-IR");
    });

    addBtn.addEventListener("click", () => {
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: selectedColor.image,
            size: selectedSize,
            color: selectedColor.name,
            qty: qty
        };

        addToCart(cartItem);
        showCartToast(cartItem);

        addNote.hidden = false;
        clearTimeout(addBtn._noteTimer);
        addBtn._noteTimer = setTimeout(() => {
            addNote.hidden = true;
        }, 2500);
    });

    if (wishBtn) {
        wishBtn.dataset.id = product.name;
    }
}

document.addEventListener("DOMContentLoaded", initShopDetails);
