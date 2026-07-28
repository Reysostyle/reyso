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

    const soldOutSizes = product.soldOutSizes || [];
    let selectedSize = product.sizes.find((s) => !soldOutSizes.includes(s)) || product.sizes[0];
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

    if (typeof trackProductView === "function") trackProductView(product.id);

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
        const stickyImg = document.getElementById("pd-sticky-img");
        if (stickyImg) stickyImg.src = src;
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
            const isSoldOut = soldOutSizes.includes(size);
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "pd-size-btn" + (size === selectedSize ? " active" : "") + (isSoldOut ? " sold-out" : "");
            btn.textContent = size;
            if (isSoldOut) {
                btn.disabled = true;
                btn.title = "این سایز ناموجود است";
            } else {
                btn.addEventListener("click", () => {
                    selectedSize = size;
                    sizesWrap.querySelectorAll(".pd-size-btn").forEach((b) => b.classList.remove("active"));
                    btn.classList.add("active");
                });
            }
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

    initGalleryZoom();
    initStickyBar(product, addBtn);
}

function initGalleryZoom() {
    const wrap = document.getElementById("pd-gallery-main");
    const img = document.getElementById("pd-main-image");
    if (!wrap || !img) return;

    wrap.addEventListener("mousemove", (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = x + "% " + y + "%";
        wrap.classList.add("zoomed");
    });

    wrap.addEventListener("mouseleave", () => {
        wrap.classList.remove("zoomed");
        img.style.transformOrigin = "center center";
    });
}

function initSizeGuide() {
    const btn = document.getElementById("pd-size-guide-btn");
    if (!btn || typeof SIZE_GUIDE === "undefined") return;

    function closeSizeGuide() {
        const modal = document.getElementById("size-guide-modal");
        if (modal) modal.classList.remove("open");
    }

    function buildModal() {
        if (document.getElementById("size-guide-modal")) return;

        const rows = SIZE_GUIDE.map((row) =>
            "<tr><td>" + row.size + "</td><td>" + row.bust + "</td><td>" + row.waist + "</td><td>" + row.hip + "</td></tr>"
        ).join("");

        const modal = document.createElement("div");
        modal.className = "qv-modal";
        modal.id = "size-guide-modal";
        modal.innerHTML =
            '<div class="qv-backdrop"></div>' +
            '<div class="qv-box sg-box">' +
                '<button type="button" class="qv-close" aria-label="بستن"><i class="ri-close-line"></i></button>' +
                '<div class="sg-content">' +
                    "<h3>راهنمای سایز</h3>" +
                    '<p class="sg-note">اندازه‌ها بر حسب سانتی‌متر و بر اساس دور بدن است؛ در صورت بین دو سایز بودن، سایز بزرگ‌تر رو انتخاب کن.</p>' +
                    '<table class="sg-table">' +
                        "<thead><tr><th>سایز</th><th>دور سینه</th><th>دور کمر</th><th>دور باسن</th></tr></thead>" +
                        "<tbody>" + rows + "</tbody>" +
                    "</table>" +
                "</div>" +
            "</div>";

        document.body.appendChild(modal);
        modal.querySelector(".qv-backdrop").addEventListener("click", closeSizeGuide);
        modal.querySelector(".qv-close").addEventListener("click", closeSizeGuide);
    }

    btn.addEventListener("click", () => {
        buildModal();
        document.getElementById("size-guide-modal").classList.add("open");
    });
}

function initStickyBar(product, addBtn) {
    const bar = document.getElementById("pd-sticky-bar");
    const stickyAddBtn = document.getElementById("pd-sticky-add-btn");
    if (!bar || !addBtn || !stickyAddBtn || typeof IntersectionObserver === "undefined") return;

    document.getElementById("pd-sticky-name").textContent = product.name;
    document.getElementById("pd-sticky-price").textContent = formatToman(product.price);

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
                bar.classList.toggle("visible", scrolledPast);
            });
        },
        { threshold: 0 }
    );
    observer.observe(addBtn);

    stickyAddBtn.addEventListener("click", () => addBtn.click());
}

document.addEventListener("DOMContentLoaded", initSizeGuide);

document.addEventListener("DOMContentLoaded", initShopDetails);
