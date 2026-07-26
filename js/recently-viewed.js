/* ==========================
   REYSO — RECENTLY VIEWED
   Tracks product detail views in localStorage and renders a
   "اخیراً دیده‌شده" row of cards on pages that include the
   #recently-viewed-section markup. Requires products.js
   (getProductById/formatToman) and wishlist.js
   (bindWishlistButton) to already be loaded.
========================== */

const RECENT_VIEWED_KEY = "reyso_recently_viewed";
const RECENT_VIEWED_MAX = 8;

function trackProductView(id) {
    try {
        const raw = localStorage.getItem(RECENT_VIEWED_KEY);
        let list = raw ? JSON.parse(raw) : [];
        list = list.filter((x) => x !== id);
        list.unshift(id);
        list = list.slice(0, RECENT_VIEWED_MAX);
        localStorage.setItem(RECENT_VIEWED_KEY, JSON.stringify(list));
    } catch (e) {
        // localStorage unavailable — fail silently
    }
}

function getRecentlyViewed(excludeId, limit) {
    try {
        const raw = localStorage.getItem(RECENT_VIEWED_KEY);
        const ids = raw ? JSON.parse(raw) : [];
        const products = ids
            .filter((id) => id !== excludeId)
            .map((id) => (typeof getProductById === "function" ? getProductById(id) : null))
            .filter(Boolean);
        return limit ? products.slice(0, limit) : products;
    } catch (e) {
        return [];
    }
}

function recentlyViewedCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";

    const front = product.images[0];
    const back = product.images[1] || product.images[0];

    card.innerHTML =
        '<button class="wishlist-btn" data-id="' + product.name + '" aria-label="افزودن به علاقه‌مندی‌ها">' +
        '<i class="ri-heart-line"></i></button>' +
        '<button class="quick-view-btn" aria-label="مشاهده سریع">' +
        '<i class="ri-eye-line"></i></button>' +
        '<a href="shop-details.html?id=' + product.id + '" class="product-link">' +
        '<div class="product-media">' +
        '<img class="img-front" loading="lazy" src="' + front + '" alt="' + product.name + '">' +
        '<img class="img-back" loading="lazy" src="' + back + '" alt="' + product.name + '">' +
        (product.oldPrice ? '<span class="shop-card-badge">تخفیف</span>' : "") +
        "</div>" +
        '<div class="product-info">' +
        '<p class="product-name">' + product.name + "</p>" +
        '<p class="product-price">' + formatToman(product.price) + "</p>" +
        "</div>" +
        "</a>";

    return card;
}

function renderRecentlyViewed(excludeId) {
    const section = document.getElementById("recently-viewed-section");
    const grid = document.getElementById("recently-viewed-grid");
    if (!section || !grid) return;

    const products = getRecentlyViewed(excludeId || null, 3);
    if (products.length === 0) {
        section.hidden = true;
        return;
    }

    grid.innerHTML = "";
    products.forEach((p) => grid.appendChild(recentlyViewedCard(p)));

    if (typeof bindWishlistButton === "function") {
        grid.querySelectorAll(".wishlist-btn").forEach(bindWishlistButton);
    }

    section.hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    renderRecentlyViewed(params.get("id"));
});
